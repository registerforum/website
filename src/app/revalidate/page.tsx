'use client'

import { useState, useEffect } from 'react'

const SlugPage = () => {
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchRevalidation = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/revalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: '/writing/[slug]/page' }),
        })

        if (!res.ok) {
          throw new Error('Failed to revalidate')
        }
      } catch (error) {
        console.error('Error fetching revalidation:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRevalidation()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h1>Revalidated</h1>
    </div>
  )
}

export default SlugPage
