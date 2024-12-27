'use client'

import { useState, useEffect } from 'react'

const SlugPage = () => {
  const [response, setResponse] = useState<any>(null)
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
          body: JSON.stringify({ path: '/' }),
        })

        if (!res.ok) {
          throw new Error('Failed to revalidate')
        }

        const data = await res.json()
        setResponse(data)
      } catch (error) {
        console.error('Error fetching revalidation:', error)
        setResponse({ revalidated: false, message: 'Error fetching revalidation' })
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
      <h1>Revalidation Status for /slug</h1>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  )
}

export default SlugPage
