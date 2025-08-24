// app/api/revalidate/route.ts (if using App Directory)
import { revalidatePath } from 'next/cache'

export async function POST(request) {
  const { path } = await request.json() // Parse the JSON body

  if (path) {
    revalidatePath(path)
    return new Response(
      JSON.stringify({ revalidated: true, now: Date.now() }),
      {
        headers: {
          'Cache-Control': 'no-store', // Disable caching for this response
          'Content-Type': 'application/json',
        },
      }
    )
  }

  return new Response(
    JSON.stringify({
      revalidated: false,
      now: Date.now(),
      message: 'Missing path to revalidate',
    }),
    {
      headers: {
        'Cache-Control': 'no-store', // Disable caching for the error response
        'Content-Type': 'application/json',
      },
    }
  )
}
