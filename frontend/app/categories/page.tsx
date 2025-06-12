import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Categories | TinyBlog",
  description: "Browse posts by category",
}

export default function CategoriesPage() {
  // In a real app, this would be fetched from the API
  const categories = [
    { id: 1, name: "Technology", slug: "technology", postCount: 24 },
    { id: 2, name: "Programming", slug: "programming", postCount: 18 },
    { id: 3, name: "Web Development", slug: "web-development", postCount: 15 },
    { id: 4, name: "Design", slug: "design", postCount: 12 },
    { id: 5, name: "Productivity", slug: "productivity", postCount: 9 },
    { id: 6, name: "Lifestyle", slug: "lifestyle", postCount: 7 },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Categories</h1>
          <p className="text-xl text-muted-foreground">
            Browse posts by category
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="h-full transition-colors hover:bg-accent/50">
                <CardHeader>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="pt-8 text-center">
          <p className="text-muted-foreground">
            Can't find what you're looking for?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Let us know
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
