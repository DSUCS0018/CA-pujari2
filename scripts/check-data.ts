import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '../.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env: any = {}
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && value) {
    env[key.trim()] = value.join('=').trim()
  }
})

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

async function check() {
  console.log('--- NSE Programs ---')
  const { data: nse } = await supabase.from('nse_programs').select('title')
  console.log(nse?.map(n => n.title))

  console.log('\n--- Courses ---')
  const { data: courses } = await supabase.from('courses').select('title')
  console.log(courses?.map(c => c.title))
  
  process.exit(0)
}

check()
