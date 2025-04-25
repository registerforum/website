import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
    try {
        const { title, content, author } = await request.json()

        if (!title || !content) {
            return NextResponse.json({ error: 'Missing required fields: title and content are required.' }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('articles')
            .insert([{ title, content, author }])
            .select()
            .maybeSingle()

        if (error) {
            console.error('Error inserting article:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ article: data })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}