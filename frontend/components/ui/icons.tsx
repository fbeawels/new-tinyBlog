import * as React from "react"
import { Loader2, Mail, Phone, MapPin, Clock, MessageSquare, Twitter, Github, Linkedin } from "lucide-react"

const Icons = {
  spinner: Loader2,
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
  clock: Clock,
  'message-square': MessageSquare,
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
}

type IconName = keyof typeof Icons

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName
  size?: number | string
  className?: string
}

export const Icon = ({
  name,
  size = 24,
  className = "",
  ...props
}: IconProps) => {
  const IconComponent = Icons[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }
  
  return <IconComponent size={size} className={className} {...props} />
}

export { Icons }
