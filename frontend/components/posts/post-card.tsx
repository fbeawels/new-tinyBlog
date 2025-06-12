import Link from "next/link"
import Image from "next/image"
import type { Post, PostWithDetails, Tag, User } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MessageCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

type PostCardPost = Post | PostWithDetails

interface PostCardProps {
  post: PostCardPost
  compact?: boolean
}

// Helper function to safely get the post date
const getPostDate = (post: PostCardPost): Date => {
  try {
    // Handle both published_at and publishedAt properties
    const dateStr = ('published_at' in post && post.published_at) || 
                   ('publishedAt' in post && post.publishedAt) || 
                   post.created_at;
    
    if (!dateStr) return new Date();
    
    // Ensure dateStr is a valid date string
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateStr);
      return new Date();
    }
    return date;
  } catch (e) {
    console.error('Error parsing date:', e);
    return new Date();
  }
}

// Helper function to get tags
const getPostTags = (post: PostCardPost): Tag[] => {
  if (!('tags' in post) || !post.tags) return [];
  
  const tags = post.tags;
  if (tags.length === 0) return [];
  
  // If tags is already an array of Tag objects
  if (typeof tags[0] === 'object' && 'id' in tags[0] && 'name' in tags[0]) {
    return tags as Tag[];
  }
  
  // If tags is an array of strings, convert to Tag objects
  return (tags as string[]).map(tag => ({
    id: tag,
    name: tag,
    slug: tag.toLowerCase().replace(/\s+/g, '-'),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
}

// Helper function to get the author name
const getAuthorName = (post: PostCardPost): string => {
  if ('author' in post && post.author) {
    return post.author.full_name || post.author.username || 'Unknown Author';
  }
  return 'Unknown Author';
}

export function PostCard({ post, compact = false }: PostCardProps) {
  const postDate = getPostDate(post);
  const tags = getPostTags(post);
  const authorName = getAuthorName(post);
  const authorInitial = authorName[0].toUpperCase();
  
  // Get the featured image URL, handling both property names
  const featuredImage = 'featured_image' in post ? post.featured_image : 
                       'featuredImage' in post ? post.featuredImage : undefined;
  
  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <Link href={`/post/${post.slug}`}>
            <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary">{post.title}</h3>
          </Link>
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDistanceToNow(postDate, {
              addSuffix: true,
              locale: fr,
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      {featuredImage && (
        <div className="relative h-48 w-full">
          <Image
            src={featuredImage}
            alt={post.title}
            fill
            className="object-cover rounded-t-lg"
            priority
          />
        </div>
      )}
      <CardHeader>
        <div className="flex flex-wrap gap-2 mb-2">
          {'category' in post && post.category && (
            <Badge variant="secondary" className="text-xs">
              {post.category.name}
            </Badge>
          )}
        </div>
        <Link href={`/post/${post.slug}`}>
          <h2 className="text-xl font-bold hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && typeof post.excerpt === 'string' && (
          <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={('author' in post && post.author?.avatar) || '/images/avatar-placeholder.png'} 
                alt={authorName} 
              />
              <AvatarFallback>{authorInitial}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{authorName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(postDate, {
                  addSuffix: true,
                  locale: fr,
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{'comments_count' in post ? post.comments_count : 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
      {tags.length > 0 && (
        <CardFooter className="flex flex-wrap gap-2 pt-0">
          {tags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="text-xs">
              {tag.name}
            </Badge>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}
