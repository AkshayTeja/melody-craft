"use client"
import Link from "next/link"
import Image from "next/image"
import { SetStateAction, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Music,
  User,
  Clock,
  Heart,
  MoreHorizontal,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  LogOut,
  Settings,
  Bell,
  Sparkles,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for recently played tracks
const recentTracks = [
  {
    id: 1,
    title: "Midnight Serenade",
    artist: "Lunar Waves",
    duration: "3:45",
    cover: "/placeholder.svg?height=60&width=60",
    date: "Today",
  },
  {
    id: 2,
    title: "Electric Dreams",
    artist: "Neon Pulse",
    duration: "4:12",
    cover: "/placeholder.svg?height=60&width=60",
    date: "Today",
  },
  {
    id: 3,
    title: "Ocean Breeze",
    artist: "Coastal Echoes",
    duration: "3:28",
    cover: "/placeholder.svg?height=60&width=60",
    date: "Yesterday",
  },
  {
    id: 4,
    title: "Urban Jungle",
    artist: "City Lights",
    duration: "5:02",
    cover: "/placeholder.svg?height=60&width=60",
    date: "Yesterday",
  },
  {
    id: 5,
    title: "Starlight Symphony",
    artist: "Cosmic Harmony",
    duration: "4:37",
    cover: "/placeholder.svg?height=60&width=60",
    date: "2 days ago",
  },
  {
    id: 6,
    title: "Digital Sunset",
    artist: "Virtual Horizon",
    duration: "3:55",
    cover: "/placeholder.svg?height=60&width=60",
    date: "3 days ago",
  },
]

// Mock user data
const userData = {
  name: "Alex Johnson",
  username: "alexj",
  avatar: "/placeholder.svg?height=100&width=100",
  memberSince: "January 2023",
  tracksCreated: 42,
  followers: 128,
  following: 75,
}

export default function UserProfile() {
  // Refs for animation sections
  const profileRef = useRef(null)
  const recentTracksRef = useRef(null)
  const playerRef = useRef(null)

  // State for player
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(recentTracks[0])
  const [progress, setProgress] = useState(45)

  useEffect(() => {
    // Simple animation on scroll
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    }, observerOptions)

    // Observe all animation targets
    if (profileRef.current) observer.observe(profileRef.current)
    if (recentTracksRef.current) observer.observe(recentTracksRef.current)
    if (playerRef.current) observer.observe(playerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Play a specific track
  const playTrack = (track: SetStateAction<{ id: number; title: string; artist: string; duration: string; cover: string; date: string }>) => {
    setCurrentTrack(track)
    setIsPlaying(true)
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
            <Link href="#" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/create" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              Create
            </Link>
            <Link href="#" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              Play
            </Link>
            <Link href="#" className="text-sm font-medium text-primary transition-colors">
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
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback className="bg-primary/20 text-primary">{userData.name.charAt(0)}</AvatarFallback>
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
                    <p className="text-sm font-medium leading-none">{userData.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">@{userData.username}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* User Profile Section */}
        <section
          ref={profileRef}
          className="relative py-16 overflow-hidden opacity-0 translate-y-10 transition-all duration-1000"
        >
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)]" />
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent blur-3xl opacity-20"></div>

          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-12">
              {/* Profile Card */}
              <div className="profile-card group relative flex flex-col items-center gap-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-xl transition-all duration-500 hover:shadow-primary/10 hover:shadow-2xl">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-purple-500 opacity-70 blur-sm"></div>
                  <Avatar className="h-24 w-24 border-2 border-white/10">
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                      {userData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                    {userData.name}
                  </h2>
                  <p className="text-gray-400">@{userData.username}</p>
                </div>

                <div className="w-full grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-white">{userData.tracksCreated}</span>
                    <span className="text-xs text-gray-400">Tracks</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-white">{userData.followers}</span>
                    <span className="text-xs text-gray-400">Followers</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-white">{userData.following}</span>
                    <span className="text-xs text-gray-400">Following</span>
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2"></div>

                <div className="text-sm text-gray-400">
                  <p>Member since {userData.memberSince}</p>
                </div>

                <Button className="w-full relative overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative">Edit Profile</span>
                </Button>
              </div>

              {/* User Stats and Activity */}
              <div className="space-y-8">
                <div className="relative rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-xl">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur opacity-10"></div>

                  <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                    Your Music Journey
                  </h3>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        label: "Tracks Created",
                        value: userData.tracksCreated,
                        icon: <Music className="h-5 w-5 text-primary" />,
                      },
                      { label: "Hours Spent", value: "128", icon: <Clock className="h-5 w-5 text-primary" /> },
                      { label: "Likes Received", value: "356", icon: <Heart className="h-5 w-5 text-primary" /> },
                      { label: "Pro Status", value: "Active", icon: <Sparkles className="h-5 w-5 text-primary" /> },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="stat-card group relative flex items-center gap-4 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 p-4 transition-all duration-300 hover:bg-white/10"
                        style={{
                          transitionDelay: `${i * 100}ms`,
                          animation: `fadeIn 0.5s ease-out forwards ${i * 100 + 300}ms`,
                        }}
                      >
                        <div className="rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 p-2 transition-all duration-300 group-hover:scale-110">
                          {stat.icon}
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">{stat.label}</p>
                          <p className="text-xl font-bold text-white">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-xl">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur opacity-10"></div>

                  <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                    Your Activity
                  </h3>

                  <div className="relative h-[200px]">
                    {/* Activity Graph - Simplified for demo */}
                    <div className="absolute inset-0 flex items-end">
                      {[35, 55, 40, 70, 50, 60, 80, 65, 75, 45, 55, 90].map((height, i) => (
                        <div
                          key={i}
                          className="activity-bar flex-1 mx-0.5 rounded-t-sm bg-gradient-to-t from-primary/50 to-purple-500/50"
                          style={{
                            height: `${height}%`,
                            opacity: 0,
                            animation: `fadeIn 0.5s ease-out forwards ${i * 50 + 300}ms`,
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10"></div>
                  </div>

                  <div className="mt-4 flex justify-between text-xs text-gray-400">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recently Played Tracks Section */}
        <section
          id="recent-tracks"
          ref={recentTracksRef}
          className="py-16 relative overflow-hidden opacity-0 translate-y-10 transition-all duration-1000"
        >
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-primary/20 via-purple-500/10 to-transparent blur-3xl opacity-20 rounded-full"></div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col gap-4">
              <div className="inline-block w-fit rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-md px-4 py-1 text-sm text-primary border border-primary/20">
                Your Music
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                Recently Played Tracks
              </h2>
              <p className="max-w-[700px] text-gray-400 md:text-xl">
                Your listening history and created tracks all in one place.
              </p>
            </div>

            <div className="mt-8 relative rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-xl overflow-hidden">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur opacity-10"></div>

              <div className="relative">
                <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center text-sm font-medium text-gray-400 mb-4 px-4">
                  <span>#</span>
                  <span>Title</span>
                  <span>Duration</span>
                  <span></span>
                </div>

                <div className="space-y-2">
                  {recentTracks.map((track, i) => (
                    <div
                      key={track.id}
                      className="track-item group grid grid-cols-[auto_1fr_auto_auto] gap-4 items-center rounded-lg p-4 transition-all duration-300 hover:bg-white/10 opacity-0"
                      style={{
                        transitionDelay: `${i * 100}ms`,
                        animation: `slideUp 0.5s ease-out forwards ${i * 100 + 300}ms`,
                      }}
                      onClick={() => playTrack(track)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 text-gray-400 group-hover:text-primary transition-colors">
                        {currentTrack.id === track.id && isPlaying ? (
                          <div className="flex space-x-0.5">
                            {[1, 2, 3].map((bar) => (
                              <div
                                key={bar}
                                className="w-1 bg-primary rounded-full animate-sound-wave"
                                style={{
                                  height: "16px",
                                  animationDelay: `${bar * 0.2}s`,
                                }}
                              ></div>
                            ))}
                          </div>
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden">
                          <Image
                            src={track.cover || "/placeholder.svg"}
                            alt={track.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-white">{track.title}</p>
                          <p className="text-sm text-gray-400">{track.artist}</p>
                        </div>
                      </div>

                      <div className="text-gray-400">{track.duration}</div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            playTrack(track)
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-40 backdrop-blur-md bg-white/5 border border-white/10">
                            <DropdownMenuItem className="cursor-pointer">Add to playlist</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Download</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Music Player Section */}
        <section
          ref={playerRef}
          className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-background/30 border-t border-white/10 supports-[backdrop-filter]:bg-background/10 opacity-0 translate-y-10 transition-all duration-1000 z-50"
        >
          <div className="container px-4 py-3">
            <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 items-center">
              {/* Current Track Info */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                  <Image
                    src={currentTrack.cover || "/placeholder.svg"}
                    alt={currentTrack.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{currentTrack.title}</p>
                  <p className="text-xs text-gray-400">{currentTrack.artist}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              {/* Player Controls */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-white"
                    onClick={togglePlay}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <div className="w-full flex items-center gap-2">
                  <span className="text-xs text-gray-400">1:42</span>
                  <Progress value={progress} className="h-1" />
                  <span className="text-xs text-gray-400">{currentTrack.duration}</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="flex items-center justify-end gap-2">
                <Volume2 className="h-4 w-4 text-gray-400" />
                <Progress value={75} className="h-1 w-24" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes animate-sound-wave {
          0%, 100% {
            height: 4px;
          }
          50% {
            height: 16px;
          }
        }
        
        .animate-sound-wave {
          animation: animate-sound-wave 1s ease-in-out infinite;
        }
        
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .bg-grid-white\/5 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  )
}
