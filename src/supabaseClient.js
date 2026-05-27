import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://thbuuvbfyxblyuydpcic.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoYnV1dmJmeXhibHl1eWRwY2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMjE1MTAsImV4cCI6MjA5MzU5NzUxMH0.5lvARO0DFyflVetpm3CjVaFsAspQkoGwZi82B6_85Kw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
