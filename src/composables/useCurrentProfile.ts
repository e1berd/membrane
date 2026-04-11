import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/lib/database.types'

export function useCurrentProfile() {
  const queryClient = useQueryClient()

  const { data: profile, isLoading: loading } = useQuery({
    queryKey: ['currentProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      return data
    },
    staleTime: Infinity,
  })

  function patch(updates: Partial<Tables<'profiles'>>) {
    queryClient.setQueryData(['currentProfile'], (old: Tables<'profiles'> | null) => {
      if (!old) return old
      return { ...old, ...updates }
    })
  }

  function reset() {
    queryClient.setQueryData(['currentProfile'], null)
  }

  return {
    profile,
    loading,
    patch,
    reset,
  }
}
