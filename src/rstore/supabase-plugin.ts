import { definePlugin } from '@rstore/vue'
import { supabase } from '@/lib/supabase'

export const supabasePlugin = definePlugin({
  name: 'supabase',
  setup({ hook }) {
    hook('fetchFirst', async (payload) => {
      if (!payload.key) return

      const { data, error } = await supabase
        .from(payload.collection.name)
        .select('*')
        .eq('id', payload.key)
        .single()

      if (error) throw error
      payload.setResult(data)
    })

    hook('fetchMany', async (payload) => {
      let query = supabase
        .from(payload.collection.name)
        .select('*')

      const params = payload.getParams()
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          query = query.eq(key, value)
        }
      }

      const { data, error } = await query
      if (error) throw error
      payload.setResult(data ?? [])
    })

    hook('createItem', async (payload) => {
      const { data, error } = await supabase
        .from(payload.collection.name)
        .insert(payload.item)
        .select()
        .single()

      if (error) throw error
      payload.setResult(data)
    })

    hook('updateItem', async (payload) => {
      const { data, error } = await supabase
        .from(payload.collection.name)
        .update(payload.item)
        .eq('id', payload.key)
        .select()
        .single()

      if (error) throw error
      payload.setResult(data)
    })

    hook('deleteItem', async (payload) => {
      const { error } = await supabase
        .from(payload.collection.name)
        .delete()
        .eq('id', payload.key)

      if (error) throw error
    })
  },
})
