import DOMPurify from 'dompurify'
import { generateHTML } from '@tiptap/html'
import type { JSONContent } from '@tiptap/vue-3'
import { tiptapMessageExtensions } from '@/lib/tiptapMessageExtensions'

function parseContent(raw: unknown): JSONContent | null {
  if (raw == null) return null
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as JSONContent
    } catch {
      return {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: raw }] }],
      }
    }
  }
  return raw as JSONContent
}

/**
 * TipTap JSON → HTML via official {@link generateHTML}, then {@link DOMPurify} for safe `v-html`.
 */
export function messageContentToHtml(content: unknown): string {
  const doc = parseContent(content)
  if (!doc || doc.type !== 'doc') return ''

  let html: string
  try {
    html = generateHTML(doc, tiptapMessageExtensions)
  } catch {
    return ''
  }

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style'],
    FORBID_ATTR: ['style'],
  })
}
