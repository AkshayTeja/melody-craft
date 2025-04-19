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

export default function CustomMidiPlayer({ apiEndpoint, midiData }: MidiPlayerProps) {
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
        const player = new MidiPlayer.Player();
        midiPlayerRef.current = player;

        // Load soundfont
        const soundfont = await Soundfont.instrument(
          audioContextRef.current,
          "acoustic_grand_piano",
          {
            soundfont: "FluidR3_GM",
            gain: isMuted ? 0 : volume / 100,
          }
        );
        soundfontRef.current = soundfont;

        // Set up event listeners only after both are ready
        player.on("playing", (currentTick: any) => {
          if (!mounted) return;
          if (player.getTotalTicks() > 0) {
            const percentage = currentTick.tick / player.getTotalTicks();
            setCurrentTime(percentage * player.getSongTime());
          }
        });

        player.on("endOfFile", () => {
          if (!mounted) return;
          setIsPlaying(false);
          setCurrentTime(0);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          // Clear all active notes
          activeNotesRef.current.clear();
        });

        player.on("midiEvent", (event: any) => {
          // Only process if we have the soundfont ready
          if (!soundfontRef.current) return;

          try {
            // Handle note-on events
            if (event.name === "Note on" && event.velocity > 0) {
              const actualVolume = isMuted
                ? 0
                : (event.velocity / 127) * (volume / 100);
              soundfont.play(
                event.noteNumber,
                audioContextRef.current!.currentTime,
                {
                  gain: actualVolume,
                  duration: 3, // Default duration that will be stopped on note-off
                }
              );

              // Track active note for visualization
              activeNotesRef.current.add(event.noteNumber.toString());
            }

            // Handle note-off events
            if (event.name === "Note off" || event.velocity === 0) {
              // Remove from active notes
              activeNotesRef.current.delete(event.noteNumber.toString());
            }
          } catch (err) {
            console.error("Error handling MIDI event:", err);
          }
        });

        if (mounted) {
          setIsInitialized(true);
        }
      } catch (err) {
        console.error("Failed to initialize MIDI player:", err);
        if (mounted) {
          setError(
            "Failed to initialize MIDI player. Please check if your browser supports Web Audio API."
          );
        }
      }
    };

    initializeAudio();

    return () => {
      mounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
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
          // Use provided MIDI data
          midiBuffer = midiData;
        } else if (apiEndpoint) {
          // Fetch from API
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

        // Convert ArrayBuffer to base64 string
        const uint8Array = new Uint8Array(midiBuffer);
        let binaryString = "";
        uint8Array.forEach((byte) => {
          binaryString += String.fromCharCode(byte);
        });
        const base64String = btoa(binaryString);

        // Load the MIDI data
        midiPlayerRef.current.loadDataUri(`data:audio/midi;base64,${base64String}`);

        // Extract MIDI info from the first track
        let midiName = "MIDI File";
        let genre = "Classical";
        try {
          if (midiPlayerRef.current.tracks && midiPlayerRef.current.tracks.length > 0) {
            const firstTrack = midiPlayerRef.current.tracks[0];
            if (firstTrack.events && firstTrack.events.length > 0) {
              // Try to find track name event
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
          tracks: midiPlayerRef.current.tracks
            ? midiPlayerRef.current.tracks.length
            : 0,
        });

        // Set duration and reset state
        const estimatedDuration = midiPlayerRef.current.getSongTime() || 120; // Default to 2min if unknown
        setDuration(estimatedDuration);
        setCurrentTime(0);
        
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

    if (apiEndpoint || midiData) {
      loadMidi();
    }
  }, [apiEndpoint, midiData, isInitialized, isPlaying]);

  // Play/pause control
  const togglePlayback = () => {
    if (!midiPlayerRef.current || isLoading || !isInitialized) return;

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

      midiPlayerRef.current.play();
      setIsPlaying(true);

      // Update time display
      intervalRef.current = setInterval(() => {
        if (midiPlayerRef.current && midiPlayerRef.current.isPlaying()) {
          setCurrentTime((prev) => {
            const newTime = prev + 0.1;
            return newTime > duration ? duration : newTime;
          });
        } else if (!midiPlayerRef.current.isPlaying()) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsPlaying(false);
        }
      }, 100);
    }
  };

  // Handle seek to new position
  const handleSeek = (value: number) => {
    if (!midiPlayerRef.current || isLoading || !isInitialized) return;
    
    const seekTime = value;
    setCurrentTime(seekTime);

    const wasPlaying = isPlaying;

    // Pause current playback
    if (isPlaying) {
      midiPlayerRef.current.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Calculate tick position - handle edge cases
    const totalTicks =
      midiPlayerRef.current.totalTicks || midiPlayerRef.current.getTotalTicks();
    if (totalTicks > 0) {
      const tickPosition = Math.floor((seekTime / duration) * totalTicks);
      try {
        midiPlayerRef.current.skipToTick(tickPosition);
      } catch (err) {
        console.error("Error seeking:", err);
      }
    }

    // Resume playback if it was playing before
    if (wasPlaying) {
      midiPlayerRef.current.play();
      setIsPlaying(true);

      // Update time display
      intervalRef.current = setInterval(() => {
        if (midiPlayerRef.current.isPlaying()) {
          setCurrentTime((prev) => {
            const newTime = prev + 0.1;
            return newTime > duration ? duration : newTime;
          });
        }
      }, 100);
    }
  };

  // Format time display (mm:ss)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Skip back to beginning
  const skipToBeginning = () => {
    if (midiPlayerRef.current && isInitialized) {
      // Stop and reset to beginning
      midiPlayerRef.current.stop();
      setCurrentTime(0);

      // If it was playing, restart playback
      if (isPlaying) {
        setTimeout(() => {
          midiPlayerRef.current.play();
        }, 50);
      }
    }
  };

  // Skip forward 10 seconds
  const skipForward = () => {
    if (midiPlayerRef.current && isInitialized) {
      // Skip forward 10 seconds
      const newTime = Math.min(currentTime + 10, duration);
      setCurrentTime(newTime);

      const wasPlaying = isPlaying;

      // Calculate new tick position
      const totalTicks =
        midiPlayerRef.current.totalTicks || midiPlayerRef.current.getTotalTicks();
      if (totalTicks > 0) {
        const tickPosition = Math.floor((newTime / duration) * totalTicks);

        try {
          // Need to stop first for reliable seeking in some MIDI players
          midiPlayerRef.current.pause();
          midiPlayerRef.current.skipToTick(tickPosition);

          // Resume if it was playing
          if (wasPlaying) {
            setTimeout(() => {
              midiPlayerRef.current.play();
            }, 50);
          }
        } catch (err) {
          console.error("Error seeking:", err);
        }
      }
    }
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!midiPlayerRef.current || isLoading || !isInitialized) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const position = e.clientX - rect.left;
    const percentage = position / rect.width;
    const seekTime = percentage * duration;
    
    handleSeek(seekTime);
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
            <div className="relative w-12 h-12 rounded-md overflow-hidden">
              <Image
                src={"/placeholder.svg"}
                alt={midiInfo?.name || "Track"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-white text-sm">{midiInfo?.name || "Track"}</p>
              <p className="text-xs text-gray-400">{midiInfo?.genre || "Genre"}</p>
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
              <div className="w-full relative" onClick={handleProgressClick}>
                <Progress 
                  value={(currentTime / duration) * 100} 
                  className="h-1 cursor-pointer" 
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
            <div className="relative w-24">
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