import Link from "next/link"
import type { Category, Tag } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  categories: Category[]
  tags: Tag[]
}

export function Sidebar({ categories, tags }: SidebarProps) {
  const topCategories = categories.slice(0, 10)
  const topTags = tags.slice(0, 20)

  return (
    <aside className="w-80 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Catégories populaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-sm font-medium">{category.name}</span>
                <Badge variant="secondary">{category.postsCount}</Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags populaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <Link key={tag.id} href={`/tags/${tag.slug}`}>
                <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground">
                  {tag.name} ({tag.postsCount})
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
