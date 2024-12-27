'use client'

import { useState, useEffect } from 'react'

const SlugPage = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [message, setMessage] = useState<string | null>("Loading...")

  useEffect(() => {
    const fetchRevalidation = async () => {
      setLoading(true)
      try {
        setMessage("Revalidating Pages...")

        const res = await fetch('/api/revalidate', {
          method: 'POST',
          headers: {
        'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: '/writing/[slug]/page' }),
        })

        if (!res.ok) {
          setMessage("Failed to revalidate")
          throw new Error('Failed to revalidate')
        }

        setMessage("Revalidating Root...")

        const resRoot = await fetch('/api/revalidate', {
          method: 'POST',
          headers: {
        'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: '/' }),
        })

        if (!resRoot.ok) {
          setMessage("Failed to revalidate root")
          throw new Error('Failed to revalidate root')
        }

        setMessage("Revalidated")
      } catch (error) {
        console.error('Error fetching revalidation:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRevalidation()
  }, [])

  return (
    <div>
      <h1>{message}</h1>
    </div>
  )
}

export default SlugPage
