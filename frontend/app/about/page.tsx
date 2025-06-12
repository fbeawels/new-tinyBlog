import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About Us | TinyBlog",
  description: "Learn more about TinyBlog and our mission to share knowledge and ideas.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About TinyBlog</h1>
          <p className="text-xl text-muted-foreground">
            Sharing knowledge, one post at a time
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
            <CardDescription>
              How TinyBlog came to be and what we stand for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Welcome to TinyBlog, a platform built for passionate writers and curious readers. 
              Our journey began with a simple idea: create a space where ideas can be shared freely 
              and knowledge can be accessible to everyone.
            </p>
            <p>
              In a world overflowing with information, we believe in quality over quantity. 
              Our mission is to provide a clean, distraction-free environment for meaningful 
              content that educates, inspires, and connects people.
            </p>
            <div className="relative aspect-video rounded-lg overflow-hidden mt-6">
              <Image
                src="/images/about-hero.jpg"
                alt="Team working together"
                fill
                className="object-cover"
                priority
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Quality Content</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize well-researched, thoughtful content that provides real value to our readers.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Community First</h3>
                <p className="text-sm text-muted-foreground">
                  Our community of writers and readers is at the heart of everything we do.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Continuous Learning</h3>
                <p className="text-sm text-muted-foreground">
                  We believe in the power of learning and sharing knowledge to make a difference.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meet the Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src="/images/team/placeholder.jpg"
                    alt="Team member"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-sm text-muted-foreground">Founder & Editor</p>
                  <p className="text-sm mt-2">
                    Passionate about technology, writing, and building communities.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src="/images/team/placeholder.jpg"
                    alt="Team member"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">Jane Smith</h3>
                  <p className="text-sm text-muted-foreground">Content Strategist</p>
                  <p className="text-sm mt-2">
                    Loves storytelling and helping writers find their voice.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Join Our Community</CardTitle>
            <CardDescription>
              Become part of our growing community of writers and readers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Whether you're a seasoned writer or just starting out, we'd love to have you 
              contribute to our platform. Share your knowledge, experiences, and perspectives 
              with our engaged community of readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                Join Now
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
              >
                Contact Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
