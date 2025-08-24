'use client'

import { useState, useEffect } from 'react'

const SlugPage = () => {
  const [message, setMessage] = useState("Loading...")

  useEffect(() => {
    const fetchRevalidation = async () => {
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

        setMessage("Revalidating Sections...")

        const resSection = await fetch('/api/revalidate', {
          method: 'POST',
          headers: {
        'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: '/section/[slug]/page' }),
        })

        if (!resSection.ok) {
          setMessage("Failed to revalidate sections")
          throw new Error('Failed to revalidate sections')
        }

        setMessage("Revalidating Staff...")

        const resStaff = await fetch('/api/revalidate', {
          method: 'POST',
          headers: {
        'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: '/staff/[slug]/page' }),
        })

        if (!resStaff.ok) {
          setMessage("Failed to revalidate staff")
          throw new Error('Failed to revalidate staff')
        }

        setMessage("Revalidating Home Page...")

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
        setMessage("Revalidated")
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
