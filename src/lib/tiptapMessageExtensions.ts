import StarterKit from '@tiptap/starter-kit'

/**
 * Схема документа как в {@link MessageEditor}.
 * Подчёркивание идёт из StarterKit v3 (встроенный Underline), отдельно не подключаем.
 * Используется редактором и {@link generateHTML} в `messageContentToHtml`.
 */
export const tiptapMessageExtensions = [
  StarterKit.configure({
    heading: false,
    codeBlock: false,
    horizontalRule: false,
    blockquote: false,
  }),
]
