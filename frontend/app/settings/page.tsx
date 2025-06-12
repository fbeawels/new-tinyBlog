"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, User, Lock, Bell, CreditCard, HelpCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

type SettingsLink = {
  name: string
  href: string
  icon: React.ReactNode
  description: string
}

const settingsLinks: SettingsLink[] = [
  {
    name: "Account",
    href: "/settings/account",
    icon: <User className="h-4 w-4" />,
    description: "Update your account information and preferences"
  },
  {
    name: "Security",
    href: "/settings/security",
    icon: <Lock className="h-4 w-4" />,
    description: "Change your password and manage security settings"
  },
  {
    name: "Notifications",
    href: "/settings/notifications",
    icon: <Bell className="h-4 w-4" />,
    description: "Configure how you receive notifications"
  },
  {
    name: "Billing",
    href: "/settings/billing",
    icon: <CreditCard className="h-4 w-4" />,
    description: "Manage your subscription and payment methods"
  },
  {
    name: "Help & Support",
    href: "/help",
    icon: <HelpCircle className="h-4 w-4" />,
    description: "Get help and contact support"
  }
]

export default function SettingsPage() {
  const pathname = usePathname()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="space-y-1">
              {settingsLinks.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant={pathname === link.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === link.href
                      ? "bg-muted hover:bg-muted"
                      : "hover:bg-transparent hover:underline"
                  )}
                >
                  <Link href={link.href} className="flex items-center gap-2">
                    {link.icon}
                    {link.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Settings className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Update your account settings and set email preferences.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">
                      Select a setting to get started
                    </h3>
                    <p className="text-muted-foreground">
                      Choose a setting from the sidebar to edit your preferences
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
