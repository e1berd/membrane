import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

/**
 * Same document schema as {@link MessageEditor}: StarterKit (subset) + underline from the toolbar.
 * Used by {@link generateHTML} so stored JSON renders identically to the editor.
 */
export const tiptapMessageExtensions = [
  StarterKit.configure({
    heading: false,
    codeBlock: false,
    horizontalRule: false,
    blockquote: false,
  }),
  Underline,
]
