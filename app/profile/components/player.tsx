"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
} from "lucide-react";

interface MidiPlayerProps {
  apiEndpoint?: string;
  midiData?: ArrayBuffer;
}

export default function MidiPlayer({ apiEndpoint, midiData }: MidiPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);
  
  const [midiInfo, setMidiInfo] = useState<{
    name: string;
    tracks: number;
    genre?: string;
  } | null>(null);

  const playerRef = useRef<HTMLElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundfontRef = useRef<any>(null);
  const midiPlayerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeNotesRef = useRef<Set<string>>(new Set());

  // Initialize Web Audio and MIDI libraries
  useEffect(() => {
    let mounted = true;

    const initializeAudio = async () => {
      if (typeof window === "undefined") return;

      try {
        setIsLoading(true);
        
        // Dynamically import libraries
        const [MidiPlayerModule, SoundfontModule] = await Promise.all([
          import("midi-player-js"),
          import("soundfont-player"),
        ]);

        const MidiPlayer = MidiPlayerModule.default || MidiPlayerModule;
        const Soundfont = SoundfontModule.default || SoundfontModule;

        // Create audio context
        if (!audioContextRef.current) {
          const AudioContext =
            window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioContext();
        }

        // Initialize player
        const player = new MidiPlayer.Player((event: any) => {
          // This callback handles all player events
          if (!mounted) return;
          
          switch (event.name) {
            case 'File loaded':
              const estimatedDuration = player.getSongTime() || 120;
              setDuration(estimatedDuration);
              setCurrentTime(0);
              break;
              
            case 'Playing':
              if (player.getTotalTicks() > 0) {
                const percentage = event.tick / player.getTotalTicks();
                setCurrentTime(percentage * duration);
              }
              break;
              
            case 'End of track':
              setIsPlaying(false);
              setCurrentTime(0);
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              activeNotesRef.current.clear();
              break;
          }
        });

        midiPlayerRef.current = player;

        // Load soundfont
        soundfontRef.current = await Soundfont.instrument(
          audioContextRef.current,
          "acoustic_grand_piano",
          {
            soundfont: "FluidR3_GM",
            gain: isMuted ? 0 : volume / 100,
          }
        );

        if (mounted) {
          setIsInitialized(true);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Failed to initialize MIDI player:", err);
        if (mounted) {
          setError(
            "Failed to initialize MIDI player. Please check if your browser supports Web Audio API."
          );
          setIsLoading(false);
        }
      }
    };

    initializeAudio();

    return () => {
      mounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (midiPlayerRef.current) {
        midiPlayerRef.current.stop();
      }
    };
  }, []);

  // Handle volume changes
  useEffect(() => {
    if (soundfontRef.current) {
      soundfontRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Load MIDI from API or provided data
  useEffect(() => {
    if (!isInitialized || !midiPlayerRef.current) return;

    const loadMidi = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Stop any current playback
        if (isPlaying) {
          midiPlayerRef.current.stop();
          setIsPlaying(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }

        let midiBuffer: ArrayBuffer;

        if (midiData) {
          midiBuffer = midiData;
        } else if (apiEndpoint) {
          const response = await fetch(apiEndpoint);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch MIDI: ${response.status} ${response.statusText}`
            );
          }
          midiBuffer = await response.arrayBuffer();
        } else {
          throw new Error("No MIDI source provided");
        }

        // Convert ArrayBuffer to base64
        const base64String = arrayBufferToBase64(midiBuffer);
        
        // Load the MIDI data
        midiPlayerRef.current.loadDataUri(`data:audio/midi;base64,${base64String}`);
        
        // Extract MIDI info
        extractMidiInfo();

        // Show the player UI
        setTimeout(() => {
          setPlayerVisible(true);
        }, 100);

      } catch (err: any) {
        console.error("Failed to load MIDI:", err);
        setError(err.message || "Failed to load MIDI file");
        setMidiInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    };

    const extractMidiInfo = () => {
      let midiName = "MIDI File";
      let genre = "Classical";
      const player = midiPlayerRef.current;
      
      try {
        if (player.tracks && player.tracks.length > 0) {
          const firstTrack = player.tracks[0];
          if (firstTrack.events && firstTrack.events.length > 0) {
            for (const event of firstTrack.events) {
              if (event.name === "Track Name") {
                midiName = event.data || midiName;
                break;
              }
            }
          }
        }
      } catch (err) {
        console.warn("Could not parse MIDI track name:", err);
      }

      setMidiInfo({
        name: midiName,
        genre: genre,
        tracks: player.tracks ? player.tracks.length : 0,
      });
    };

    if (apiEndpoint || midiData) {
      loadMidi();
    }
  }, [apiEndpoint, midiData, isInitialized]);

  // Play/pause control
  const togglePlayback = () => {
    if (!midiPlayerRef.current || isLoading || !isInitialized) return;
    console.log("Toggling playback...");

    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      midiPlayerRef.current.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      if (currentTime >= duration) {
        setCurrentTime(0);
        midiPlayerRef.current.stop();
      }

      console.log("Playing MIDI file...");
      midiPlayerRef.current.play();
      setIsPlaying(true);

      // Update time display
      intervalRef.current = setInterval(() => {
        if (midiPlayerRef.current && midiPlayerRef.current.isPlaying()) {
          const ticks = midiPlayerRef.current.getCurrentTick();
          const totalTicks = midiPlayerRef.current.getTotalTicks();
          if (totalTicks > 0) {
            const percentage = ticks / totalTicks;
            setCurrentTime(percentage * duration);
          }
        } else if (midiPlayerRef.current && !midiPlayerRef.current.isPlaying()) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsPlaying(false);
        }
      }, 100);
    }
  };

  // Skip back to beginning
  const skipToBeginning = () => {
    if (!midiPlayerRef.current || !isInitialized) return;
    
    midiPlayerRef.current.stop();
    setCurrentTime(0);

    if (isPlaying) {
      setTimeout(() => {
        midiPlayerRef.current.play();
      }, 50);
    }
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (!midiPlayerRef.current || !isInitialized) return;
    
    const newTime = Math.min(currentTime + 10, duration);
    const percentage = newTime / duration;
    const totalTicks = midiPlayerRef.current.getTotalTicks();
    const tickPosition = Math.floor(percentage * totalTicks);

    const wasPlaying = isPlaying;
    
    midiPlayerRef.current.stop();
    midiPlayerRef.current.skipToTick(tickPosition);
    setCurrentTime(newTime);

    if (wasPlaying) {
      setTimeout(() => {
        midiPlayerRef.current.play();
      }, 50);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Handle progress bar click for seeking
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!midiPlayerRef.current || isLoading || !isInitialized) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const position = e.clientX - rect.left;
    const percentage = position / rect.width;
    const seekTime = percentage * duration;
    
    const totalTicks = midiPlayerRef.current.getTotalTicks();
    const tickPosition = Math.floor(percentage * totalTicks);

    const wasPlaying = isPlaying;
    
    midiPlayerRef.current.stop();
    midiPlayerRef.current.skipToTick(tickPosition);
    setCurrentTime(seekTime);

    if (wasPlaying) {
      setTimeout(() => {
        midiPlayerRef.current.play();
      }, 50);
    }
  };

  // Handle volume change through progress bar
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLoading || !isInitialized) return;
    
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const position = e.clientX - rect.left;
    const percentage = position / rect.width;
    const newVolume = Math.max(0, Math.min(100, Math.round(percentage * 100)));
    
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  // Format time display (mm:ss)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <section
      ref={playerRef}
      className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-background/30 border-t border-white/10 supports-[backdrop-filter]:bg-background/10 transition-all duration-1000 z-50 ${
        playerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {error && (
        <div className="bg-red-900/50 text-white text-sm py-1 px-4 text-center">
          {error}
        </div>
      )}
      
      <div className="container px-4 py-3">
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 items-center">
          {/* Current Track Info */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-800">
              <Image
                src={"/placeholder.svg"}
                alt={midiInfo?.name || "Track"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-white text-sm">{midiInfo?.name || "No Track Loaded"}</p>
              <p className="text-xs text-gray-400">{midiInfo?.genre || "MIDI"}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={skipToBeginning}
                disabled={isLoading || !midiInfo || !isInitialized}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-white"
                onClick={togglePlayback}
                disabled={isLoading || !midiInfo || !isInitialized}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={skipForward}
                disabled={isLoading || !midiInfo || !isInitialized}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
              <div 
                className="w-full relative cursor-pointer" 
                onClick={handleProgressClick}
              >
                <Progress 
                  value={(currentTime / (duration || 1)) * 100} 
                  className="h-1" 
                />
              </div>
              <span className="text-xs text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 p-1"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-gray-400" />
              ) : (
                <Volume2 className="h-4 w-4 text-gray-400" />
              )}
            </Button>
            <div 
              className="relative w-24 cursor-pointer" 
              onClick={handleVolumeClick}
            >
              <Progress 
                value={isMuted ? 0 : volume} 
                className="h-1" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
