import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileWarning, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-destructive/10">
            <FileWarning className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Button asChild className="mt-4">
          <Link href="/" className="inline-flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Need help?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
