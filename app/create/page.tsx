"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { UserSessionModel } from "@/lib/models"
import {
  Bell,
  Disc3,
  Download,
  LogOut,
  Music,
  Music2,
  Pause,
  Play,
  RefreshCw,
  Save,
  Send,
  Settings,
  Share2,
  Sparkles,
  Sparkles as SparklesEffect,
  User,
  Wand2,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { HashLoader } from "react-spinners"

// Music genres
const genres = ["Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Classical", "R&B", "Country", "Ambient", "Lo-fi"]

// Mock conversation history
const initialConversation = [
  {
    role: "assistant",
    content: "Welcome to MelodyCraft! I can help you create beautiful music. What would you like to create today?",
    timestamp: new Date().toISOString(),
  },
]

// Mock generated tracks
const mockGeneratedTracks = [
  {
    id: 1,
    title: "Sunset Waves",
    genre: "Lo-fi",
    duration: "2:34",
    waveform: Array(40)
      .fill(0)
      .map(() => Math.random() * 100),
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Urban Rhythm",
    genre: "Hip Hop",
    duration: "3:15",
    waveform: Array(40)
      .fill(0)
      .map(() => Math.random() * 100),
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
]

export default function MusicCreator() {
  const defaultImage = "https://api.multiavatar.com/test.png";
  const { data: session } = useSession() as { data: UserSessionModel | null };
  // State for conversation
  const [conversation, setConversation] = useState(initialConversation)
  const [inputMessage, setInputMessage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTracks, setGeneratedTracks] = useState(mockGeneratedTracks)
  const [currentTrack, setCurrentTrack] = useState(mockGeneratedTracks[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Parameters state
  const [genre, setGenre] = useState("")
  const [notes, setNotes] = useState("")
  const [primerMelody, setPrimerMelody] = useState("")
  const [duration, setDuration] = useState(30)

  // Refs
  const chatContainerRef = useRef(null)

useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Scroll to bottom of chat when conversation updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation])

  // Simulate progress when playing
  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 300) // Adjust for desired duration
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  // Handle form submission
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!inputMessage.trim() && !genre) return

    // Add user message to conversation
    const userMessage = {
      role: "user",
      content:
        inputMessage ||
        `Generate a ${genre} track${notes ? ` with notes: ${notes}` : ""}${
          primerMelody ? ` and primer melody: ${primerMelody}` : ""
        } for ${duration} seconds`,
      timestamp: new Date().toISOString(),
    }

    setConversation((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate AI generating music
    setIsGenerating(true)
    setTimeout(() => {
      // Add AI response
      const assistantMessage = {
        role: "assistant",
        content: `I've created a ${genre || "unique"} track for you${
          notes ? ` using the notes you provided` : ""
        }${primerMelody ? ` with your primer melody as inspiration` : ""}. The track is ${duration} seconds long.`,
        timestamp: new Date().toISOString(),
      }

      setConversation((prev) => [...prev, assistantMessage])

      // Add new generated track
      const newTrack = {
        id: Date.now(),
        title: `${genre || "New"} Composition ${Math.floor(Math.random() * 100)}`,
        genre: genre || "Custom",
        duration: `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, "0")}`,
        waveform: Array(40)
          .fill(0)
          .map(() => Math.random() * 100),
        timestamp: new Date().toISOString(),
      }

      setGeneratedTracks((prev) => [newTrack, ...prev])
      setCurrentTrack(newTrack)
      setIsGenerating(false)
      setActiveTab("tracks")
    }, 3000)
  }

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      setProgress(0)
    }
  }

  // Format timestamp
  const formatTime = (timestamp: string | number | Date) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

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
            <Link href="/create" className="text-sm font-medium text-primary hover:text-primary transition-colors">
              Create
            </Link>
            <Link href="/play" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
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

      <main className="flex-1 container px-4 py-8 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
              Create Music
            </h1>
            <SparklesEffect>
              <div className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-md px-4 py-1 text-sm text-primary border border-primary/20">
                AI-Powered
              </div>
            </SparklesEffect>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-md">
              <TabsTrigger value="chat" className="data-[state=active]:bg-white/10">
                Chat
              </TabsTrigger>
              <TabsTrigger value="tracks" className="data-[state=active]:bg-white/10">
                Generated Tracks
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="mt-4">
              

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Genre</label>
                    <Select value={genre} onValueChange={setGenre}>
                      <SelectTrigger className="backdrop-blur-md bg-white/5 border-white/10">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent className="backdrop-blur-md bg-white/5 border-white/10">
                        {genres.map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Notes (space separated)</label>
                    <Textarea
                      placeholder="e.g. C4 D4 E4 F4 G4"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="backdrop-blur-md bg-white/5 border-white/10 h-10 min-h-0 py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Primer Melody</label>
                    <Textarea
                      placeholder="Describe a melody to use as inspiration"
                      value={primerMelody}
                      onChange={(e) => setPrimerMelody(e.target.value)}
                      className="backdrop-blur-md bg-white/5 border-white/10 h-10 min-h-0 py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-300">Duration (seconds)</label>
                      <span className="text-sm text-gray-400">{duration}s</span>
                    </div>
                    <Slider
                      value={[duration]}
                      min={10}
                      max={180}
                      step={5}
                      onValueChange={(value) => setDuration(value[0])}
                      className="py-2"
                    />
                  </div>
                </div>

                <div className="relative">
                  <Textarea
                    placeholder="Describe the music you want to create..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="pr-12 backdrop-blur-md bg-white/5 border-white/10 min-h-[80px]"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                    disabled={isGenerating}
                  >
                    {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full relative overflow-hidden group"
                  size="lg"
                  disabled={isGenerating}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-2">
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" /> Generate Music
                      </>
                    )}
                  </span>
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="tracks" className="mt-4 space-y-4">
              <div className="relative rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-xl">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur opacity-10"></div>
                <div className="relative">
                  <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                    Now Playing
                  </h3>

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white/10">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Music2 className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{currentTrack.title}</h4>
                        <p className="text-sm text-gray-400">
                          {currentTrack.genre} • {currentTrack.duration}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>0:00</span>
                        <span>{currentTrack.duration}</span>
                      </div>
                      <Progress value={progress} className="h-1" />
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button
                          onClick={togglePlay}
                          className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-white"
                        >
                          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </Button>
                        <Button variant="outline" size="icon" className="backdrop-blur-md bg-white/5 border-white/10">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="backdrop-blur-md bg-white/5 border-white/10">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="outline" className="backdrop-blur-md bg-white/5 border-white/10 gap-2">
                        <Save className="h-4 w-4" /> Save to Library
                      </Button>
                    </div>

                    <div className="mt-2">
                      <div className="flex items-center h-20">
                        {currentTrack.waveform.map((height, i) => (
                          <div
                            key={i}
                            className={`waveform-bar w-1 mx-0.5 rounded-full ${
                              isPlaying ? "bg-gradient-to-t from-primary/50 to-purple-500/50" : "bg-white/20"
                            }`}
                            style={{
                              height: `${height}%`,
                              animation: isPlaying ? `waveform-animation 1.5s ease-in-out infinite` : "none",
                              animationDelay: `${i * 0.05}s`,
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-xl">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur opacity-10"></div>
                <div className="relative">
                  <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                    Your Generated Tracks
                  </h3>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {generatedTracks.map((track, i) => (
                      <div
                        key={track.id}
                        className={`track-item group grid grid-cols-[auto_1fr_auto] gap-4 items-center rounded-lg p-3 transition-all duration-300 hover:bg-white/10 cursor-pointer ${
                          currentTrack.id === track.id ? "bg-white/10" : ""
                        }`}
                        onClick={() => setCurrentTrack(track)}
                      >
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-white/10">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Disc3 className="h-5 w-5 text-primary" />
                          </div>
                        </div>

                        <div>
                          <p className="font-medium text-white">{track.title}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{track.genre}</span>
                            <span>•</span>
                            <span>{track.duration}</span>
                            <span>•</span>
                            <span>{formatTime(track.timestamp)}</span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentTrack(track)
                            setIsPlaying(true)
                            setProgress(0)
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="relative rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-xl">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur opacity-10"></div>
            <div className="relative">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                Quick Tips
              </h3>
              <ul className="space-y-3">
                {[
                  "Be specific about the genre and mood you want",
                  "Include specific notes if you have a melody in mind",
                  "Specify instruments you'd like to hear",
                  "Mention artists or songs for style inspiration",
                  "Adjust duration based on your needs",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/20 p-1 mt-0.5">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-xl">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur opacity-10"></div>
            <div className="relative">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                Example Prompts
              </h3>
              <div className="space-y-2">
                {[
                  "Create an upbeat pop track with a catchy chorus",
                  "Generate a lo-fi hip hop beat for studying",
                  "Make a cinematic orchestral piece with rising tension",
                  "Create a jazz improvisation in the style of Miles Davis",
                  "Generate an ambient track with nature sounds",
                ].map((prompt, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-2 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-sm"
                    onClick={() => setInputMessage(prompt)}
                  >
                    {prompt}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative rounded-xl backdrop-blur-md bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 p-6 shadow-xl">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur opacity-20"></div>
            <div className="relative">
              <h3 className="text-xl font-bold mb-2 text-white">Upgrade to Pro</h3>
              <p className="text-sm text-gray-200 mb-4">
                Get unlimited music generation, higher quality output, and more advanced controls.
              </p>
              <Button className="w-full relative overflow-hidden group">
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">Upgrade Now</span>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes waveform-animation {
          0%, 100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1);
          }
        }
        
        .animate-in {
          animation-duration: 300ms;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
        
        .fade-in {
          opacity: 0;
        }
        
        .slide-in-from-bottom-3 {
          transform: translateY(12px);
        }
        
        .duration-500 {
          animation-duration: 500ms;
        }
      `}</style>
    </div>
  )
}
