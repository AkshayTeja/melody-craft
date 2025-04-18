import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Music, Sparkles, Zap, Layers, Users, Check, ChevronRight, Play, Download, Wand2 } from "lucide-react"

export default function LandingPage() {
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
            <Link
              href="#features"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              Sign In
            </Link>
            <Button className="relative overflow-hidden group">
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative">Get Started</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)]" />
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent blur-3xl opacity-20"></div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-md px-4 py-1 text-sm text-primary border border-primary/20">
                  Introducing MelodyCraft
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                  Create Beautiful Music with AI
                </h1>
                <p className="max-w-[600px] text-gray-400 md:text-xl">
                  Transform your ideas into professional tracks in seconds. Our AI-powered platform helps musicians,
                  producers, and creators generate unique melodies, harmonies, and complete compositions.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="relative overflow-hidden group">
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center gap-1.5">
                      Try For Free <ChevronRight className="h-4 w-4" />
                    </span>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 gap-1.5"
                  >
                    <Play className="h-4 w-4" /> Watch Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-primary" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-primary" />
                    <span>14-day free trial</span>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-xl blur-xl opacity-30"></div>
                <div className="relative h-[350px] w-full max-w-[500px] rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-1 shadow-2xl">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/placeholder.svg?height=350&width=500"
                      alt="MelodyCraft AI Interface"
                      width={500}
                      height={350}
                      className="rounded-lg object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="icon"
                        className="h-16 w-16 rounded-full bg-primary/80 backdrop-blur-md hover:bg-primary transition-colors duration-300"
                      >
                        <Play className="h-8 w-8" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="border-y border-white/10 bg-white/5 backdrop-blur-md py-10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <h2 className="text-center text-sm font-medium text-gray-400">
                TRUSTED BY MUSICIANS AND CREATORS WORLDWIDE
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 w-32 bg-white/5 backdrop-blur-md rounded-md border border-white/10" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent blur-3xl opacity-20 rounded-full"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-md px-4 py-1 text-sm text-primary border border-primary/20">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                Create Music Like Never Before
              </h2>
              <p className="max-w-[700px] text-gray-400 md:text-xl">
                Our AI-powered platform offers everything you need to compose, arrange, and produce professional-quality
                music.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Sparkles className="h-10 w-10 text-primary" />,
                  title: "AI Composition",
                  description:
                    "Generate original melodies, harmonies, and complete tracks based on your input and preferences.",
                },
                {
                  icon: <Zap className="h-10 w-10 text-primary" />,
                  title: "Real-time Generation",
                  description:
                    "Create music in seconds with our lightning-fast AI models trained on millions of songs.",
                },
                {
                  icon: <Layers className="h-10 w-10 text-primary" />,
                  title: "Multi-track Support",
                  description:
                    "Generate individual instrument tracks and layer them to create rich, complex compositions.",
                },
                {
                  icon: <Wand2 className="h-10 w-10 text-primary" />,
                  title: "Style Transfer",
                  description: "Transform your compositions into different genres and styles with a single click.",
                },
                {
                  icon: <Users className="h-10 w-10 text-primary" />,
                  title: "Collaborative Workspace",
                  description: "Invite team members to collaborate on projects in real-time with shared workspaces.",
                },
                {
                  icon: <Download className="h-10 w-10 text-primary" />,
                  title: "Export Options",
                  description: "Export your creations in multiple formats including WAV, MP3, MIDI, and more.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col items-center gap-2 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 text-center shadow-xl transition-all duration-300 hover:bg-white/10 hover:shadow-primary/10 hover:shadow-2xl"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="relative mb-4 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-md p-3 border border-white/10">
                    {feature.icon}
                  </div>
                  <h3 className="relative text-xl font-bold">{feature.title}</h3>
                  <p className="relative text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-white/5 backdrop-blur-md py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary/20 via-purple-500/10 to-transparent blur-3xl opacity-20 rounded-full"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-md px-4 py-1 text-sm text-primary border border-primary/20">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                Create Music in Three Simple Steps
              </h2>
              <p className="max-w-[700px] text-gray-400 md:text-xl">
                Our intuitive platform makes music creation accessible to everyone, regardless of experience level.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Describe Your Vision",
                  description:
                    "Tell our AI what kind of music you want to create using text prompts or by uploading reference tracks.",
                },
                {
                  step: "02",
                  title: "Generate & Customize",
                  description:
                    "Our AI generates multiple options based on your input. Customize and refine until it's perfect.",
                },
                {
                  step: "03",
                  title: "Export & Share",
                  description:
                    "Download your creation in your preferred format or share it directly to streaming platforms.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col items-center gap-2 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 text-center shadow-xl transition-all duration-300 hover:bg-white/10 hover:shadow-primary/10 hover:shadow-2xl"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="absolute -top-6 rounded-full bg-gradient-to-r from-primary to-purple-500 px-4 py-2 text-xl font-bold text-white shadow-lg shadow-primary/20">
                    {step.step}
                  </div>
                  <h3 className="relative mt-6 text-xl font-bold">{step.title}</h3>
                  <p className="relative text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-primary/20 via-purple-500/10 to-transparent blur-3xl opacity-20 rounded-full"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-md px-4 py-1 text-sm text-primary border border-primary/20">
                Pricing
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                Choose the Perfect Plan for Your Needs
              </h2>
              <p className="max-w-[700px] text-gray-400 md:text-xl">
                Whether you're a hobbyist or a professional, we have a plan that fits your creative journey.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {[
                {
                  name: "Starter",
                  price: "$9",
                  description: "Perfect for beginners and casual creators.",
                  features: ["10 AI generations per month", "Basic editing tools", "MP3 exports", "Community support"],
                },
                {
                  name: "Pro",
                  price: "$29",
                  description: "Ideal for serious musicians and content creators.",
                  features: [
                    "100 AI generations per month",
                    "Advanced editing tools",
                    "All export formats",
                    "Priority support",
                    "Collaborative workspace",
                  ],
                  popular: true,
                },
                {
                  name: "Enterprise",
                  price: "$99",
                  description: "For studios and professional teams.",
                  features: [
                    "Unlimited AI generations",
                    "Full suite of tools",
                    "API access",
                    "Dedicated support",
                    "Custom model training",
                  ],
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  className={`group relative flex flex-col rounded-xl backdrop-blur-md ${
                    plan.popular
                      ? "bg-gradient-to-b from-white/10 to-white/5 border border-primary/50"
                      : "bg-white/5 border border-white/10"
                  } p-6 shadow-xl transition-all duration-300 hover:shadow-primary/10 hover:shadow-2xl`}
                >
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-xl blur ${
                      plan.popular ? "opacity-30" : "opacity-0 group-hover:opacity-20"
                    } transition-opacity duration-300`}
                  ></div>
                  {plan.popular && (
                    <div className="relative mb-4 rounded-full bg-gradient-to-r from-primary to-purple-500 px-3 py-1 text-xs text-white w-fit">
                      Most Popular
                    </div>
                  )}
                  <h3 className="relative text-2xl font-bold">{plan.name}</h3>
                  <div className="relative mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                      {plan.price}
                    </span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="relative mt-2 text-sm text-gray-400">{plan.description}</p>
                  <ul className="relative mt-6 space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/20 p-1">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`relative mt-8 overflow-hidden group ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
                        : "backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <span className="relative">Get Started</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-white/5 backdrop-blur-md py-20 relative overflow-hidden">
          <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-primary/20 via-purple-500/10 to-transparent blur-3xl opacity-20 rounded-full"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="inline-block rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-md px-4 py-1 text-sm text-primary border border-primary/20">
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                What Our Users Say
              </h2>
              <p className="max-w-[700px] text-gray-400 md:text-xl">
                Join thousands of satisfied creators who have transformed their music production process.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "MelodyCraft has completely transformed my workflow. I can now create professional-sounding tracks in minutes instead of days.",
                  author: "Alex Johnson",
                  role: "Independent Artist",
                },
                {
                  quote:
                    "As a film composer, deadlines are tight. MelodyCraft helps me quickly generate ideas that I can refine into the perfect soundtrack.",
                  author: "Sarah Williams",
                  role: "Film Composer",
                },
                {
                  quote:
                    "The quality of the AI-generated music is incredible. It's hard to believe these compositions weren't created by human musicians.",
                  author: "Michael Chen",
                  role: "Music Producer",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col gap-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 p-6 shadow-xl transition-all duration-300 hover:bg-white/10 hover:shadow-primary/10 hover:shadow-2xl"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 p-2 w-10 h-10 flex items-center justify-center">
                    <Music className="h-5 w-5 text-primary" />
                  </div>
                  <p className="relative italic text-gray-300">"{testimonial.quote}"</p>
                  <div className="relative mt-auto flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary/30 to-purple-500/30" />
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.author}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent blur-3xl opacity-20 rounded-full"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">
                Ready to Transform Your Music Creation?
              </h2>
              <p className="max-w-[700px] text-gray-400 md:text-xl">
                Join thousands of creators who are already using MelodyCraft to bring their musical ideas to life.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="relative overflow-hidden group">
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center gap-1.5">
                    Start Free Trial <ChevronRight className="h-4 w-4" />
                  </span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 gap-1.5"
                >
                  <Play className="h-4 w-4" /> Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/10 bg-white/5 backdrop-blur-md py-10">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
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
              <p className="mt-2 text-sm text-gray-400">
                Transforming ideas into beautiful music with the power of AI.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Releases
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-white">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                    Licenses
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} MelodyCraft. All rights reserved.</p>
            <div className="flex gap-4">
              {["Twitter", "Instagram", "GitHub", "YouTube"].map((social) => (
                <Link key={social} href="#" className="text-xs text-gray-400 hover:text-primary transition-colors">
                  {social}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
