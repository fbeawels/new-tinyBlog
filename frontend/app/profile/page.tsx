"use client"

import { useAuth } from "@/contexts/auth-context"
import { useQuery } from "@tanstack/react-query"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/posts/post-card"
import { postService } from "@/services/post-service"
import { Loader2, Edit, Settings } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useAuth()
  
  // Fetch user's posts
  const { data: postsData, isLoading: isLoadingPosts } = useQuery({
    queryKey: ["user-posts", user?.id],
    queryFn: () => postService.getUserPosts(user?.id || ""),
    enabled: !!user?.id,
  })

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
          <Button asChild>
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Get user initials for avatar fallback
  const userInitials = user.full_name 
    ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.username?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader className="items-center text-center">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user.avatar} alt={user.full_name || user.username} />
                  <AvatarFallback className="text-4xl">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="absolute -bottom-2 -right-2 rounded-full h-10 w-10"
                  asChild
                >
                  <Link href="/profile/edit">
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardTitle className="mt-4">
                {user.full_name || user.username}
              </CardTitle>
              <p className="text-muted-foreground">@{user.username}</p>
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList>
              <TabsTrigger value="posts">My Posts</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="mt-6">
              <div className="space-y-6">
                {isLoadingPosts ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : postsData?.items?.length ? (
                  postsData.items.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't written any posts yet. Create your first post!
                    </p>
                    <Button asChild>
                      <Link href="/posts/new">Create Post</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="drafts" className="mt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No drafts</h3>
                <p className="text-muted-foreground">
                  You don't have any drafts yet.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="mt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No saved posts</h3>
                <p className="text-muted-foreground">
                  Save posts to view them here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
