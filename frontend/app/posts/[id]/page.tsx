"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { postService } from "@/services/post-service"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CalendarDays, Clock, MessageCircle, Tag, User } from "lucide-react"
import Link from "next/link"

interface Comment {
  id: string
  content: string
  author: {
    id: string
    username: string
    avatar?: string
  }
  created_at: string
  updated_at: string
}

export default function PostPage() {
  const { id } = useParams()
  const router = useRouter()

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getPostById(id as string),
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to posts
          </Button>
          
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/6" />
            <div className="pt-8 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="text-muted-foreground">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  const publishedDate = new Date(post.published_at || post.created_at)
  const readTime = Math.ceil((post.content?.split(/\s+/).length || 0) / 200) // 200 words per minute

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to posts
      </Button>

      <article className="space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1.5" />
              <Link href={`/profile/${post.author.username}`} className="hover:underline">
                {post.author.full_name || post.author.username}
              </Link>
            </div>
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              {format(publishedDate, 'PPP', { locale: fr })}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5" />
              {readTime} min read
            </div>
          </div>

          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Badge variant="secondary" className="text-sm font-medium">
                    {category.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </header>

        {post.cover_image && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <Link key={tag.id} href={`/tags/${tag.slug}`}>
                <Badge variant="outline" className="text-sm font-medium">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        <Separator className="my-8" />

        <footer className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <MessageCircle className="h-4 w-4 mr-1.5" />
              {post.comments_count || 0} Comments
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Share
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Save
            </Button>
          </div>
        </footer>
      </article>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Comments ({post.comments_count || 0})</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>Leave a comment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  You must be logged in to post a comment.
                </p>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" asChild>
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {post.comments && post.comments.length > 0 ? (
          <div className="mt-8 space-y-6">
            {post.comments.map((comment: Comment) => (
              <div key={comment.id} className="flex space-x-4">
                <Avatar>
                  <AvatarImage src={comment.author.avatar} alt={comment.author.username} />
                  <AvatarFallback>
                    {comment.author.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Link 
                      href={`/profile/${comment.author.username}`}
                      className="font-medium hover:underline"
                    >
                      {comment.author.username}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(comment.created_at), 'MMM d, yyyy', { locale: fr })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </section>
    </div>
  )
}
