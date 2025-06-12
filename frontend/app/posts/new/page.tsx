"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { postService, type PostCreateDTO } from "@/services/post-service"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MultiSelect from "@/components/ui/multi-select"
import { categoryService, type Category } from "@/services/category-service"
import { tagService, type Tag } from "@/services/tag-service"
import { Skeleton } from "@/components/ui/skeleton"

interface FormValues {
  title: string;
  text: string;
  category_id: string;
  tags: string[];
  is_visible: boolean;
}

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  text: z.string().min(10, "Content must be at least 10 characters"),
  category_id: z.string().min(1, "Please select a category"),
  tags: z.array(z.string()).default([]),
  is_visible: z.boolean().default(false)
})

// Reusing types from services

export default function NewPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          categoryService.getCategories(),
          tagService.getTags()
        ])
        
        // Map to the expected format for the form
        setCategories(categoriesData)
        setTags(tagsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load categories and tags. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      text: "",
      category_id: "",
      tags: [],
      is_visible: false,
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get the current user's token
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Format the current date for created_at and updated_at
      const now = new Date().toISOString();
      
      // Create the post data matching PostCreateDTO
      const postData: PostCreateDTO = {
        title: values.title,
        content: values.text,
        category_id: values.category_id,
        tags: values.tags,
        is_visible: values.is_visible,
        author_id: '', // Will be set by the backend based on the token
        created_at: now,
        updated_at: now,
        slug: values.title.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
      };
      
      await postService.createPost(postData);
      
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      router.push("/posts");
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || error.message || "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle tag selection
  const handleTagSelect = useCallback((selectedTags: string[]) => {
    form.setValue('tags', selectedTags, { shouldValidate: true })
  }, [form])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground">Share your thoughts with the world</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter post title" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The title of your post
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your post content here..."
                        className="min-h-[300px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <div className="w-full">
                        <MultiSelect
                          options={tags.map(tag => ({
                            value: tag.id,
                            label: tag.name
                          }))}
                          selected={field.value}
                          onChange={handleTagSelect}
                          placeholder="Select tags..."
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_visible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Publish immediately</FormLabel>
                      <FormDescription>
                        Make this post publicly visible
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

            <div className="flex justify-end space-x-4 pt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  'Create Post'
                )}
              </Button>
            </div>
          </>
        )}
        </form>
      </Form>
    </div>
  )
}
