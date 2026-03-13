import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bnfsnmtzstgevudhuikm.supabase.co'
const supabaseAnonKey = 'sb_publishable_Ccn7nY7-KOu_k1a1i5xH8g_ACUOxyd-'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)