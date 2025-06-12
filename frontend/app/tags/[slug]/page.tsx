import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Tag as TagIcon } from "lucide-react"

interface TagPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  // In a real app, this would be fetched from the API
  const tag = getTagBySlug(params.slug)
  
  if (!tag) {
    return {
      title: "Tag Not Found | TinyBlog",
    }
  }

  return {
    title: `#${tag.name} | TinyBlog`,
    description: `Browse all posts tagged with ${tag.name}`,
  }
}

// Mock function to simulate fetching a tag by slug
function getTagBySlug(slug: string) {
  const tags = [
    { 
      id: 1, 
      name: "React", 
      slug: "react", 
      description: "A JavaScript library for building user interfaces",
      postCount: 15 
    },
    { 
      id: 2, 
      name: "TypeScript", 
      slug: "typescript", 
      description: "Typed JavaScript at Any Scale",
      postCount: 12 
    },
    { 
      id: 3, 
      name: "JavaScript", 
      slug: "javascript", 
      description: "The Programming Language for the Web",
      postCount: 20 
    },
    { 
      id: 4, 
      name: "Next.js", 
      slug: "nextjs", 
      description: "The React Framework for the Web",
      postCount: 10 
    },
  ]

  return tags.find(tag => tag.slug === slug)
}

// Mock function to simulate fetching posts by tag
function getPostsByTag(tagId: number) {
  // In a real app, this would be fetched from the API
  const allPosts = [
    {
      id: 1,
      title: "Getting Started with Next.js 14",
      slug: "getting-started-with-nextjs-14",
      excerpt: "Learn how to build modern web applications with Next.js 14.",
      date: "2023-11-15",
      tags: [
        { id: 1, name: "React", slug: "react" },
        { id: 4, name: "Next.js", slug: "nextjs" }
      ],
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "TypeScript Best Practices",
      slug: "typescript-best-practices",
      excerpt: "Level up your TypeScript skills with these best practices.",
      date: "2023-11-10",
      tags: [
        { id: 2, name: "TypeScript", slug: "typescript" },
        { id: 3, name: "JavaScript", slug: "javascript" }
      ],
      readTime: "8 min read"
    },
  ]

  return allPosts.filter(post => 
    post.tags.some(tag => tag.id === tagId)
  )
}

export default function TagPage({ params }: TagPageProps) {
  const tag = getTagBySlug(params.slug)
  
  if (!tag) {
    notFound()
  }

  const posts = getPostsByTag(tag.id)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="pl-0 mb-4"
          >
            <Link href="/tags">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Tags
            </Link>
          </Button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <TagIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">#{tag.name}</h1>
              <p className="text-muted-foreground">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} tagged with {tag.name}
              </p>
            </div>
          </div>
          
          {tag.description && (
            <p className="text-lg text-muted-foreground mb-6">
              {tag.description}
            </p>
          )}
        </div>

        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="space-y-1">
                    <Link href={`/posts/${post.slug}`}>
                      <CardTitle className="text-xl hover:underline">
                        {post.title}
                      </CardTitle>
                    </Link>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link 
                        key={tag.id} 
                        href={`/tags/${tag.slug}`}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
                      >
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found with this tag.</p>
          </div>
        )}
      </div>
    </div>
  )
}
