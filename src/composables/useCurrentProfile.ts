import { ref, readonly } from 'vue'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/rstore/collections'

const profile = ref<Profile | null>(null)
const loading = ref(false)
let initialized = false

export function useCurrentProfile() {
  async function load() {
    if (loading.value || initialized) return
    loading.value = true
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        profile.value = data as Profile
        initialized = true
      }
    } finally {
      loading.value = false
    }
  }

  function patch(updates: Partial<Profile>) {
    if (profile.value) {
      profile.value = { ...profile.value, ...updates }
    }
  }

  function reset() {
    profile.value = null
    initialized = false
  }

  return {
    profile: readonly(profile),
    loading: readonly(loading),
    load,
    patch,
    reset,
  }
}
