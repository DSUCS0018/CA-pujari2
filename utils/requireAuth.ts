// utils/requireAuth.ts
import type { User } from "@supabase/supabase-js"

export const requireAuth = (
  user: User | null | undefined,
  router: any,
  redirect = "/signup"
) => {
  if (!user) {
    router.push(redirect)
    return false
  }
  return true
}
