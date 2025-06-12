import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search | TinyBlog',
  description: 'Search for blog posts, categories, and tags',
}

export default function SearchPage() {
  // In a real app, you would implement search functionality here
  // and fetch results based on the search query
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Search</h1>
          <p className="text-xl text-muted-foreground">
            Find the content you're looking for
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search posts, categories, tags..."
                className="w-full rounded-lg bg-background pl-10"
              />
              <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Search Results</h2>
            <p className="text-sm text-muted-foreground">0 results found</p>
          </div>
          
          <div className="space-y-4">
            {/* Search results would be mapped here */}
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Enter a search term to find posts, categories, or tags
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
