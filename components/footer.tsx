import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#0B0E17] border-t border-[#1F2937] py-16">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#00E6E6] rounded-lg flex items-center justify-center">
                <span className="text-[#0B0E17] font-bold text-lg">M</span>
              </div>
              <span className="text-white font-bold text-xl">MovieDetect</span>
            </div>
            <p className="text-[#B3B3B3] text-sm">
              Discover movies and TV shows using advanced AI-powered search technology.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-[#B3B3B3] hover:text-[#00E6E6] p-2">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-[#B3B3B3] hover:text-[#00E6E6] p-2">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-[#B3B3B3] hover:text-[#00E6E6] p-2">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-[#B3B3B3] hover:text-[#00E6E6] p-2">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Navigation</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-[#B3B3B3] hover:text-[#00E6E6] text-sm transition-colors">
                Home
              </Link>
              <Link href="/movies" className="block text-[#B3B3B3] hover:text-[#00E6E6] text-sm transition-colors">
                Movies
              </Link>
              <Link href="/tv-shows" className="block text-[#B3B3B3] hover:text-[#00E6E6] text-sm transition-colors">
                TV Shows
              </Link>
              <Link href="/genres" className="block text-[#B3B3B3] hover:text-[#00E6E6] text-sm transition-colors">
                Genres
              </Link>
              <Link href="/sports" className="block text-[#B3B3B3] hover:text-[#00E6E6] text-sm transition-colors">
                Sports
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Support</h3>
            <div className="space-y-2">
              <Link href="/contact" className="block text-[#B3B3B3] hover:text-[#00E6E6] text-sm transition-colors">
                Contact Us
              </Link>
              <Link href="/features" className="block text-[#B3B3B3] hover:text-[#00E6E6] text-sm transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="block text-[#B3B3B3] hover:text-[#00E6E6] text-sm transition-colors">
                Pricing
              </Link>
              <Link href="/profile" className="block text-[#B3B3B3] hover:text-[#00E6E6] text-sm transition-colors">
                My Account
              </Link>
              <Link href="/settings" className="block text-[#B3B3B3] hover:text-[#00E6E6] text-sm transition-colors">
                Settings
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Stay Updated</h3>
            <p className="text-[#B3B3B3] text-sm">Get the latest movie recommendations and updates.</p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-[#1F2937] border-[#1F2937] text-white placeholder-[#B3B3B3] focus:border-[#00E6E6]"
              />
              <Button className="w-full bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#1F2937] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#B3B3B3] text-sm">© 2024 MovieDetect. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-[#B3B3B3] hover:text-[#00E6E6] text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[#B3B3B3] hover:text-[#00E6E6] text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-[#B3B3B3] hover:text-[#00E6E6] text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
