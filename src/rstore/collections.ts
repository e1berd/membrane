import type { StoreSchema } from '@rstore/vue'
import { withItemType } from '@rstore/vue'
import { z } from 'zod'

export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  bio: string | null
  profile_color: string | null
  overlay_url: string | null
  updated_at: string | null
  created_at: string
}

export interface Chat {
  id: string
  name: string
  is_group: boolean
  created_at: string
}

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  text: string
  created_at: string
}

export const profiles = withItemType<Profile>().defineCollection({
  name: 'profiles',
  formSchema: {
    update: z.object({
      username: z.string().min(1, 'Имя пользователя обязательно').max(255).optional(),
      avatar_url: z.string().url().nullable().optional(),
      bio: z.string().max(255).nullable().optional(),
      profile_color: z.string().max(7).nullable().optional(),
      overlay_url: z.string().url().nullable().optional(),
    }),
  },
} as const)

export const chats = withItemType<Chat>().defineCollection({
  name: 'chats',
} as const)

export const messages = withItemType<Message>().defineCollection({
  name: 'messages',
  formSchema: {
    create: z.object({
      chat_id: z.string().uuid(),
      text: z.string().min(1, 'Сообщение не может быть пустым'),
    }),
  },
} as const)

export const schema = [profiles, chats, messages] as const satisfies StoreSchema
