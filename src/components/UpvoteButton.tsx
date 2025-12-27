'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UpvoteButtonProps {
  printId: string
  initialCount: number
  initialHasUpvoted?: boolean
  userId?: string | null
}

export default function UpvoteButton({
  printId,
  initialCount,
  initialHasUpvoted = false,
  userId
}: UpvoteButtonProps) {
  const router = useRouter()
  const [upvoteCount, setUpvoteCount] = useState(initialCount)
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpvote = async () => {
    // Require authentication
    if (!userId) {
      router.push('/login?redirect=/prints/' + printId)
      return
    }

    setIsLoading(true)

    try {
      if (hasUpvoted) {
        // Remove upvote
        const { error } = await supabase
          .from('upvotes')
          .delete()
          .match({ user_id: userId, print_id: printId })

        if (error) throw error

        setUpvoteCount(prev => prev - 1)
        setHasUpvoted(false)
      } else {
        // Add upvote
        const { error } = await supabase
          .from('upvotes')
          .insert({ user_id: userId, print_id: printId })

        if (error) {
          // Handle duplicate upvote error (already upvoted)
          if (error.code === '23505') {
            setHasUpvoted(true)
            return
          }
          throw error
        }

        setUpvoteCount(prev => prev + 1)
        setHasUpvoted(true)
      }
    } catch (error: any) {
      console.error('Upvote error:', error)
      // Revert on error
      setHasUpvoted(!hasUpvoted)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={hasUpvoted ? 'default' : 'outline'}
      size="lg"
      onClick={handleUpvote}
      disabled={isLoading}
      className="gap-2"
    >
      <ArrowUp className={`h-5 w-5 ${hasUpvoted ? 'fill-current' : ''}`} />
      <span className="font-semibold">{upvoteCount}</span>
      <span className="hidden sm:inline">
        {hasUpvoted ? 'Upvoted' : 'Upvote'}
      </span>
    </Button>
  )
}
