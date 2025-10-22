import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_API_KEY } from '../config.mjs'

const supabase = createClient( SUPABASE_URL ,SUPABASE_API_KEY);

