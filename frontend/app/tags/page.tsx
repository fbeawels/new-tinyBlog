import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Tags | TinyBlog",
  description: "Browse posts by tag",
}

export default function TagsPage() {
  // In a real app, this would be fetched from the API
  const tags = [
    { id: 1, name: "React", slug: "react", postCount: 15 },
    { id: 2, name: "TypeScript", slug: "typescript", postCount: 12 },
    { id: 3, name: "JavaScript", slug: "javascript", postCount: 20 },
    { id: 4, name: "Next.js", slug: "nextjs", postCount: 10 },
    { id: 5, name: "CSS", slug: "css", postCount: 8 },
    { id: 6, name: "Tailwind CSS", slug: "tailwind-css", postCount: 9 },
    { id: 7, name: "Node.js", slug: "nodejs", postCount: 7 },
    { id: 8, name: "API", slug: "api", postCount: 11 },
    { id: 9, name: "Web Development", slug: "web-dev", postCount: 18 },
    { id: 10, name: "UI/UX", slug: "ui-ux", postCount: 6 },
    { id: 11, name: "Git", slug: "git", postCount: 5 },
    { id: 12, name: "Performance", slug: "performance", postCount: 7 },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Tags</h1>
          <p className="text-xl text-muted-foreground">
            Browse posts by tag
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link 
                  key={tag.id} 
                  href={`/tags/${tag.slug}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
                >
                  {tag.name}
                  <span className="ml-2 bg-background/20 px-2 py-0.5 rounded-full text-xs">
                    {tag.postCount}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="pt-4 text-center">
          <p className="text-muted-foreground">
            Looking for something specific?{' '}
            <Link href="/search" className="text-primary hover:underline">
              Try our search
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
