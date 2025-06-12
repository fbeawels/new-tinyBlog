"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { postService } from "@/services/post-service"
import { PostCard } from "@/components/posts/post-card"
import { Sidebar } from "@/components/layout/sidebar"
import { Pagination } from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Category, Tag } from "@/types"

// Helper function to create a date string for mock data
const createDateString = (daysAgo = 0) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  const { data: postsData, isLoading, error } = useQuery({
    queryKey: ["posts", currentPage],
    queryFn: () => postService.getPosts({ 
      page: currentPage, 
      limit: postsPerPage 
    }),
  })

  // Mock data for sidebar - in real app, fetch from API
  const mockCategories: Category[] = [
    { 
      id: "1", 
      name: "Technologie", 
      slug: "tech", 
      description: "Articles about technology",
      created_at: createDateString(30),
      updated_at: createDateString(1)
    },
    { 
      id: "2", 
      name: "Design", 
      slug: "design",
      description: "Design related content",
      created_at: createDateString(25),
      updated_at: createDateString(2)
    },
    { 
      id: "3", 
      name: "Business", 
      slug: "business",
      description: "Business and entrepreneurship",
      created_at: createDateString(20),
      updated_at: createDateString(3)
    },
  ]

  const mockTags: Tag[] = [
    { 
      id: "1", 
      name: "React", 
      slug: "react",
      created_at: createDateString(15),
      updated_at: createDateString(1)
    },
    { 
      id: "2", 
      name: "JavaScript", 
      slug: "javascript",
      created_at: createDateString(10),
      updated_at: createDateString(2)
    },
    { 
      id: "3", 
      name: "CSS", 
      slug: "css",
      created_at: createDateString(5),
      updated_at: createDateString(1)
    },
  ]

  const totalPages = postsData?.pages || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          <main className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Articles récents</h1>
              <p className="text-muted-foreground">Découvrez les derniers articles de notre communauté</p>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {postsData?.items?.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </div>
                )}
              </>
            )}
          </main>

          <Sidebar categories={mockCategories} tags={mockTags} />
        </div>
      </div>
    </div>
  )
}
