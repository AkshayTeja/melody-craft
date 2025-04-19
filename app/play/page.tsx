"use client";

import MidiPlayer from "@/components/player";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { UserSessionModel } from "@/lib/models";
import { Bell, FileMusic, Globe, LogOut, Music, Settings, Upload, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { HashLoader } from "react-spinners";

export default function MidiPlayerPage() {
  const defaultImage = "https://api.multiavatar.com/test.png";
  const { data: session } = useSession() as { data: UserSessionModel | null };
  const [apiUrl, setApiUrl] = useState("");
  const [midiData, setMidiData] = useState<ArrayBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loadMethod, setLoadMethod] = useState<"file" | "url">("file");

  const handleFetchMidi = async () => {
    if (!apiUrl) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch MIDI: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.arrayBuffer();
      setMidiData(data);
      setFileName("File from URL");
    } catch (err: any) {
      console.error("Error fetching MIDI:", err);
      setError(err.message || "Failed to fetch MIDI file");
      setMidiData(null);
      setFileName(null);
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check if it's a MIDI file
    if (
      !file.type.includes("midi") &&
      !file.name.endsWith(".mid") &&
      !file.name.endsWith(".midi")
    ) {
      setError("Please upload a valid MIDI file");
      return;
    }

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as ArrayBuffer;
      setMidiData(result);
      setFileName(file.name);
      setError(null);
      setIsLoading(false);
    };

    reader.onerror = () => {
      setError("Failed to read the file");
      setIsLoading(false);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/midi": [".mid", ".midi"],
      "audio/x-midi": [".mid", ".midi"],
      // Some systems might use these MIME types
      "application/x-midi": [".mid", ".midi"],
      "application/midi": [".mid", ".midi"],
    },
    maxFiles: 1,
    // This prevents click propagation issues
    noClick: false,
    noKeyboard: false,
    preventDropOnDocument: true,
  });

  if (!session) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <HashLoader className="h-32 w-32" color={"#5f05e6"} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground">
          <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/30 border-b border-white/10 supports-[backdrop-filter]:bg-background/10">
            <div className="container flex h-16 items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-purple-500 opacity-70 blur-sm"></div>
                  <div className="relative flex items-center justify-center rounded-full bg-background/50 backdrop-blur-sm p-1">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                  MelodyCraft
                </span>
              </div>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/create" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
                  Create
                </Link>
                <Link href="/lay" className="text-sm font-medium text-primary hover:text-primary transition-colors">
                  Play
                </Link>
                <Link href="/profile" className="text-sm font-medium text-foreground/70 transition-colors">
                  Profile
                </Link>
              </nav>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-foreground/70" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                    3
                  </span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8 border border-white/10">
                        <AvatarImage src={session?.user.image || defaultImage} alt={session?.user.name || "User"} />
                        <AvatarFallback className="bg-primary/20 text-primary">{session?.user.name.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 backdrop-blur-md bg-white/5 border border-white/10"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session?.user.name || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{session?.user.email || "user@example.com"}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => redirect("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => redirect("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
    
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                MIDI Player
              </h1>
              <p className="mt-2 text-gray-400 md:text-xl">
                Play and control your MIDI files with precision
              </p>
            </div>

            {/* Input Section */}
            <div className="relative mb-8 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-xl">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-xl blur opacity-10"></div>
              <div className="relative z-10">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Load MIDI File
                </h2>

                <div className="flex mb-4 rounded-md overflow-hidden border border-white/20">
                  <Button
                    variant={loadMethod === "file" ? "default" : "ghost"}
                    className={`flex-1 rounded-none ${
                      loadMethod === "file" ? "bg-primary" : "hover:bg-white/10"
                    }`}
                    onClick={() => setLoadMethod("file")}
                  >
                    <FileMusic className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                  <Button
                    variant={loadMethod === "url" ? "default" : "ghost"}
                    className={`flex-1 rounded-none ${
                      loadMethod === "url" ? "bg-primary" : "hover:bg-white/10"
                    }`}
                    onClick={() => setLoadMethod("url")}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    From URL
                  </Button>
                </div>

                {loadMethod === "file" ? (
                  <div
                    {...getRootProps()}
                    className={`relative border-2 border-dashed rounded-lg p-10 cursor-pointer text-center transition-colors
                      ${
                        isDragActive
                          ? "border-primary/80 bg-primary/10"
                          : "border-white/20 hover:border-white/40"
                      }`}
                  >
                    <input {...getInputProps()} />
                    <Upload
                      className={`mx-auto h-12 w-12 mb-4 ${
                        isDragActive ? "text-primary" : "text-gray-400"
                      }`}
                    />
                    {isDragActive ? (
                      <p className="text-primary text-lg">
                        Drop the MIDI file here...
                      </p>
                    ) : (
                      <>
                        <p className="text-gray-300 mb-2 text-lg">
                          Drag and drop a MIDI file here
                        </p>
                        <p className="text-gray-400">
                          Or click to select from your device
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          Supports .mid and .midi files
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      placeholder="Enter MIDI file URL"
                      className="flex-1 bg-white/10 border-white/20 text-white"
                    />
                    <Button
                      onClick={handleFetchMidi}
                      disabled={isLoading || !apiUrl}
                      className="px-4 py-2 bg-primary/80 hover:bg-primary disabled:opacity-50"
                    >
                      {isLoading ? "Loading..." : "Load"}
                    </Button>
                  </div>
                )}

                {fileName && (
                  <div className="mt-4 p-3 bg-white/10 rounded border border-white/20">
                    <p className="text-sm text-gray-300">
                      <span className="font-medium">Loaded:</span> {fileName}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-200">
                    {error}
                  </div>
                )}

                {isLoading && (
                  <div className="mt-4 p-3 bg-primary/20 border border-primary/30 rounded-md text-primary/90">
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary/50 border-t-primary rounded-full"></div>
                      <span>Loading MIDI file...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* MIDI Player Component */}
            {midiData ? (
              <MidiPlayer midiData={midiData} />
            ) : (
              <div className="text-center p-12 rounded-xl backdrop-blur-md bg-white/5 border border-white/10">
                <FileMusic className="h-16 w-16 mx-auto mb-4 text-gray-500 opacity-60" />
                <p className="text-gray-400 text-lg">
                  Upload a MIDI file or enter a URL to start playing
                </p>
                <p className="text-gray-500 mt-2">
                  Your uploaded MIDI will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>

  );
}
