"use cldsent";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
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
  const [midiInfo, setMidiInfo] = useState<{
    name: string;
    tracks: number;
  } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const soundfontRef = useRef<any>(null);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeNotesRef = useRef<Set<string>>(new Set());
  const visualizerBarsRef = useRef<number[]>(Array(32).fill(5));

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
        playerRef.current = player;

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
          visualizerBarsRef.current = Array(32).fill(5);
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

              // Update visualizer
              const noteIndex = Math.abs(
                event.noteNumber % visualizerBarsRef.current.length
              );
              visualizerBarsRef.current[noteIndex] =
                80 + Math.floor(Math.random() * 20);
            }

            // Handle note-off events
            if (event.name === "Note off" || event.velocity === 0) {
              // Stop the note
              //   soundfont.stop(event.noteNumber);

              // Remove from active notes
              activeNotesRef.current.delete(event.noteNumber.toString());

              // Update visualizer
              const noteIndex = Math.abs(
                event.noteNumber % visualizerBarsRef.current.length
              );
              visualizerBarsRef.current[noteIndex] = Math.max(
                5,
                visualizerBarsRef.current[noteIndex] - 30
              );
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

    // Set up visualizer animation
    const visualizerInterval = setInterval(() => {
      if (isPlaying) {
        // Decay all bars slightly for animation effect
        visualizerBarsRef.current = visualizerBarsRef.current.map((height) =>
          Math.max(5, height * 0.95)
        );
      }
    }, 50);

    return () => {
      mounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (visualizerInterval) {
        clearInterval(visualizerInterval);
      }
      // Don't automatically close the audioContext - it may be reused
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
    if (!isInitialized || !playerRef.current) return;

    const loadMidi = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Stop any current playback
        if (isPlaying) {
          playerRef.current.stop();
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
        playerRef.current.loadDataUri(`data:audio/midi;base64,${base64String}`);

        // Extract MIDI info from the first track
        let midiName = "MIDI File";
        try {
          if (playerRef.current.tracks && playerRef.current.tracks.length > 0) {
            const firstTrack = playerRef.current.tracks[0];
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
          tracks: playerRef.current.tracks
            ? playerRef.current.tracks.length
            : 0,
        });

        // Set duration and reset state
        const estimatedDuration = playerRef.current.getSongTime() || 120; // Default to 2min if unknown
        setDuration(estimatedDuration);
        setCurrentTime(0);

        // Reset visualizer
        visualizerBarsRef.current = Array(32).fill(5);
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
  }, [apiEndpoint, midiData, isInitialized]);

  // Play/pause control
  const togglePlayback = () => {
    if (!playerRef.current || isLoading || !isInitialized) return;

    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      playerRef.current.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      if (currentTime >= duration) {
        setCurrentTime(0);
        playerRef.current.stop();
      }

      playerRef.current.play();
      setIsPlaying(true);

      // Update time display
      intervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.isPlaying()) {
          setCurrentTime((prev) => {
            const newTime = prev + 0.1;
            return newTime > duration ? duration : newTime;
          });
        } else if (!playerRef.current.isPlaying()) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setIsPlaying(false);
        }
      }, 100);
    }
  };

  // Seek to position
  const handleSeek = (value: number[]) => {
    if (!playerRef.current || isLoading || !isInitialized) return;

    const seekTime = value[0];
    setCurrentTime(seekTime);

    const wasPlaying = isPlaying;

    // Pause current playback
    if (isPlaying) {
      playerRef.current.pause();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Calculate tick position - handle edge cases
    const totalTicks =
      playerRef.current.totalTicks || playerRef.current.getTotalTicks();
    if (totalTicks > 0) {
      const tickPosition = Math.floor((seekTime / duration) * totalTicks);
      try {
        playerRef.current.skipToTick(tickPosition);
      } catch (err) {
        console.error("Error seeking:", err);
      }
    }

    // Resume playback if it was playing before
    if (wasPlaying) {
      playerRef.current.play();
      setIsPlaying(true);

      // Update time display
      intervalRef.current = setInterval(() => {
        if (playerRef.current.isPlaying()) {
          setCurrentTime((prev) => {
            const newTime = prev + 0.1;
            return newTime > duration ? duration : newTime;
          });
        }
      }, 100);
    }
  };

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-xl overflow-hidden">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-xl blur opacity-20"></div>
      <div className="relative z-10">
        {/* MIDI Visualization */}
        <div className="h-40 mb-6 rounded-lg bg-black/30 overflow-hidden flex items-center justify-center">
          {isLoading ? (
            <div className="text-gray-400 flex items-center">
              <div className="animate-spin mr-2 h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
              Loading MIDI file...
            </div>
          ) : error ? (
            <div className="text-red-400 px-4 text-center">{error}</div>
          ) : (
            <div className="w-full h-full flex items-end justify-center gap-1 px-4">
              {Array.from({ length: 32 }).map((_, i) => {
                // Calculate bar height based on active notes or animation
                const height = isPlaying ? visualizerBarsRef.current[i] : 5;

                return (
                  <div
                    key={i}
                    className="w-full bg-gradient-to-t from-primary to-purple-500 rounded-t-sm"
                    style={{
                      height: `${height}%`,
                      opacity: isPlaying ? 0.7 + height / 400 : 0.3,
                      transition: "height 150ms ease, opacity 150ms ease",
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* MIDI Info */}
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {midiInfo?.name || "No MIDI loaded"}
            </h3>
            {midiInfo && (
              <p className="text-sm text-gray-400">
                {midiInfo.tracks} track{midiInfo.tracks !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="text-sm text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            disabled={isLoading || !midiInfo || !isInitialized}
            className="w-full [&>span:first-child]:h-1.5 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-primary [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-gradient-to-r [&>span:first-child_span]:from-primary [&>span:first-child_span]:to-purple-500 [&_[role=slider]:focus-visible]:ring-2 [&_[role=slider]:focus-visible]:ring-primary"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full hover:bg-white/10"
              disabled={isLoading || !midiInfo || !isInitialized}
              onClick={() => {
                if (playerRef.current) {
                  // Stop and reset to beginning
                  playerRef.current.stop();
                  setCurrentTime(0);

                  // If it was playing, restart playback
                  if (isPlaying) {
                    setTimeout(() => {
                      playerRef.current.play();
                    }, 50);
                  }
                }
              }}
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              variant="default"
              className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
              disabled={isLoading || !midiInfo || !isInitialized}
              onClick={togglePlayback}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 rounded-full hover:bg-white/10"
              disabled={isLoading || !midiInfo || !isInitialized}
              onClick={() => {
                if (playerRef.current && isInitialized) {
                  // Skip forward 10 seconds
                  const newTime = Math.min(currentTime + 10, duration);
                  setCurrentTime(newTime);

                  const wasPlaying = isPlaying;

                  // Calculate new tick position
                  const totalTicks =
                    playerRef.current.totalTicks ||
                    playerRef.current.getTotalTicks();
                  if (totalTicks > 0) {
                    const tickPosition = Math.floor(
                      (newTime / duration) * totalTicks
                    );

                    try {
                      // Need to stop first for reliable seeking in some MIDI players
                      playerRef.current.pause();
                      playerRef.current.skipToTick(tickPosition);

                      // Resume if it was playing
                      if (wasPlaying) {
                        setTimeout(() => {
                          playerRef.current.play();
                        }, 50);
                      }
                    } catch (err) {
                      console.error("Error seeking:", err);
                    }
                  }
                }
              }}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full hover:bg-white/10"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0])}
              className="w-24 [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white/70 [&_[role=slider]:focus-visible]:ring-1 [&_[role=slider]:focus-visible]:ring-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
