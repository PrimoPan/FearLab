import { useEffect, useId, useRef } from 'react'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import type { RichText } from '../../lib/portal/types'
import { buttonClass, labelClass } from './portalStyles'

type RichTextEditorProps = {
  value: RichText
  onChange: (value: RichText) => void
  label: string
  disabled?: boolean
}

const extensions = [StarterKit.configure({
  blockquote: false, code: false, codeBlock: false, hardBreak: false,
  heading: false, horizontalRule: false, orderedList: false,
  strike: false, underline: false, link: false, trailingNode: false
})]

export function RichTextEditor({ value, onChange, label, disabled = false }: RichTextEditorProps) {
  const labelId = useId()
  const changeRef = useRef(onChange)
  changeRef.current = onChange
  const editor = useEditor({
    extensions,
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => changeRef.current(current.getJSON() as RichText),
    editorProps: { attributes: {
      role: 'textbox', 'aria-multiline': 'true', 'aria-labelledby': labelId,
      class: 'min-h-[12rem] border border-line bg-panel p-4 font-sans text-base leading-[1.7] text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent [&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_strong]:font-semibold [&_em]:italic'
    } }
  })
  const active = useEditorState({ editor, selector: ({ editor: current }) => ({
    bold: current?.isActive('bold') ?? false,
    italic: current?.isActive('italic') ?? false,
    bullets: current?.isActive('bulletList') ?? false,
    paragraph: current?.isActive('paragraph') && !current.isActive('bulletList')
  }) })

  useEffect(() => { editor?.setEditable(!disabled, false) }, [editor, disabled])
  useEffect(() => {
    if (editor && JSON.stringify(editor.getJSON()) !== JSON.stringify(value)) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [editor, value])

  const controls = [
    { label: 'Paragraph', pressed: active?.paragraph ?? false, run: () => editor?.chain().focus().clearNodes().setParagraph().run() },
    { label: 'Bold', pressed: active?.bold ?? false, run: () => editor?.chain().focus().toggleBold().run() },
    { label: 'Italic', pressed: active?.italic ?? false, run: () => editor?.chain().focus().toggleItalic().run() },
    { label: 'Bullet list', pressed: active?.bullets ?? false, run: () => editor?.chain().focus().toggleBulletList().run() }
  ]

  return (
    <div className={disabled ? 'opacity-60' : undefined}>
      <p id={labelId} className={`${labelClass} mt-0`}>{label}</p>
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={`${label} formatting`}>
        {controls.map((control) => (
          <button key={control.label} type="button" className={`${buttonClass} aria-pressed:border-accent aria-pressed:text-accent`} aria-pressed={control.pressed} disabled={disabled || !editor} onClick={control.run}>
            {control.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
