import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowUp, Eye, MessageCircle } from 'lucide-react'

interface PrintCardProps {
  print: {
    id: string
    title: string
    description?: string
    preview_image_url: string
    upvote_count: number
    view_count: number
    comment_count: number
    category_name?: string
    category_slug?: string
    username: string
    display_name: string
    avatar_url?: string
    created_at: string
  }
}

export default function PrintCard({ print }: PrintCardProps) {
  const imageUrl = print.preview_image_url || '/placeholder-model.png'

  return (
    <Link href={`/prints/${print.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={print.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Category badge */}
          {print.category_name && (
            <Badge
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white"
              variant="secondary"
            >
              {print.category_name}
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {print.title}
          </h3>

          {print.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {print.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <ArrowUp className="h-4 w-4" />
              <span>{print.upvote_count}</span>
            </div>

            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{print.view_count}</span>
            </div>

            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{print.comment_count}</span>
            </div>
          </div>
        </CardContent>

        {/* Footer - Creator info */}
        <CardFooter className="p-4 pt-0">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={print.avatar_url} alt={print.username} />
              <AvatarFallback>
                {print.display_name?.charAt(0) || print.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <span className="text-sm text-gray-600">
              by{' '}
              <span className="font-medium text-gray-900 hover:underline">
                {print.display_name || print.username}
              </span>
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
