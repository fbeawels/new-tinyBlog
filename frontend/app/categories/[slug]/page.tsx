import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  // In a real app, this would be fetched from the API
  const category = getCategoryBySlug(params.slug)
  
  if (!category) {
    return {
      title: "Category Not Found | TinyBlog",
    }
  }

  return {
    title: `${category.name} | TinyBlog`,
    description: `Browse all posts in the ${category.name} category`,
  }
}

// Mock function to simulate fetching a category by slug
function getCategoryBySlug(slug: string) {
  const categories = [
    { 
      id: 1, 
      name: "Technology", 
      slug: "technology", 
      description: "The latest in technology news, reviews, and insights.",
      postCount: 24 
    },
    { 
      id: 2, 
      name: "Programming", 
      slug: "programming", 
      description: "Tutorials, tips, and best practices for programmers of all levels.",
      postCount: 18 
    },
    { 
      id: 3, 
      name: "Web Development", 
      slug: "web-development", 
      description: "Frontend, backend, and everything in between for web developers.",
      postCount: 15 
    },
    { 
      id: 4, 
      name: "Design", 
      slug: "design", 
      description: "UI/UX, graphic design, and creative inspiration.",
      postCount: 12 
    },
    { 
      id: 5, 
      name: "Productivity", 
      slug: "productivity", 
      description: "Tools, tips, and strategies to get more done.",
      postCount: 9 
    },
    { 
      id: 6, 
      name: "Lifestyle", 
      slug: "lifestyle", 
      description: "Balancing work, life, and everything in between.",
      postCount: 7 
    },
  ]

  return categories.find(category => category.slug === slug)
}

// Mock function to simulate fetching posts by category
function getPostsByCategory(categoryId: number) {
  // In a real app, this would be fetched from the API
  const allPosts = [
    {
      id: 1,
      title: "Getting Started with Next.js 14",
      slug: "getting-started-with-nextjs-14",
      excerpt: "Learn how to build modern web applications with Next.js 14.",
      date: "2023-11-15",
      category: { id: 1, name: "Technology", slug: "technology" },
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "TypeScript Best Practices",
      slug: "typescript-best-practices",
      excerpt: "Level up your TypeScript skills with these best practices.",
      date: "2023-11-10",
      category: { id: 2, name: "Programming", slug: "programming" },
      readTime: "8 min read"
    },
    // Add more mock posts as needed
  ]

  return allPosts.filter(post => post.category.id === categoryId)
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug)
  
  if (!category) {
    notFound()
  }

  const posts = getPostsByCategory(category.id)

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
            <Link href="/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Categories
            </Link>
          </Button>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-xl text-muted-foreground">
              {category.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
            </p>
          </div>
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
                    <p className="text-sm text-muted-foreground">
                      {post.date} · {post.readTime}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
