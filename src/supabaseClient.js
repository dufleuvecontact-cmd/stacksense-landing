import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pjapdxatvghedkbxtnzo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqYXBkeGF0dmdoZWRrYnh0bnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNTEwNzAsImV4cCI6MjA5MDkyNzA3MH0.1Zp5S-qVWMTNcjTOZ4Vmq71BqVq7DTO-75e3n4RX95k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
