import { Fragment, type ReactNode } from 'react'
import type { RichText } from '../../lib/portal/types'

function render(node: RichText, index: number): ReactNode {
  if (node.type === 'text') {
    let value: ReactNode = node.text ?? ''
    for (const mark of node.marks ?? []) {
      if (mark.type === 'bold') value = <strong>{value}</strong>
      if (mark.type === 'italic') value = <em>{value}</em>
      if (mark.type === 'strike') value = <s>{value}</s>
      if (mark.type === 'code') value = <code>{value}</code>
    }
    return <Fragment key={index}>{value}</Fragment>
  }
  const children = node.content?.map(render)
  switch (node.type) {
    case 'paragraph': return <p key={index} className="my-0 mb-5 last:mb-0">{children}</p>
    case 'bulletList': return <ul key={index} className="pl-6">{children}</ul>
    case 'orderedList': return <ol key={index} className="pl-6">{children}</ol>
    case 'listItem': return <li key={index} className="my-2">{children}</li>
    case 'blockquote': return <blockquote key={index} className="ml-0 border-l-2 border-accent pl-5">{children}</blockquote>
    case 'heading': return <h3 key={index} className="text-xl font-medium text-ink">{children}</h3>
    case 'hardBreak': return <br key={index} />
    case 'horizontalRule': return <hr key={index} className="my-8 border-line" />
    default: return <Fragment key={index}>{children}</Fragment>
  }
}

export function RichTextView({ content }: { content: RichText }) {
  return <div className="break-words text-base leading-[1.8] text-ink-soft">{render(content, 0)}</div>
}
