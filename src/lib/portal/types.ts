export type PortalUser = {
  id: string
  username: string
  name: string
  role: 'admin' | 'member'
  usingInitialPassword: boolean
}

export type RichText = {
  type: string
  text?: string
  attrs?: Record<string, unknown>
  marks?: { type: string; attrs?: Record<string, unknown> }[]
  content?: RichText[]
}

export type ProjectImage = { id?: string; url: string; alt: string; caption: string }
export type ProjectSection = {
  id: string
  layout: 'text' | 'image-left' | 'image-right' | 'gallery'
  heading: string
  body: RichText
  images: ProjectImage[]
  linkLabel: string
  linkUrl: string
}

export type ProjectMaterial = {
  authors: string
  hero: string
  heroAlt: string
  title: string
  subtitle: string
  leader: string
  supervisor: string
  sections: ProjectSection[]
}

export type PortalProject = {
  id: string
  ownerId: string
  status: 'draft' | 'submitted' | 'changes' | 'approved'
  version: number
  feedback: string
  data: ProjectMaterial
  updatedAt: string
  publishedAt: string | null
  order: number
}

export type PortalSession = { user: PortalUser | null; csrfToken: string | null }
export const emptyDocument = (): RichText => ({ type: 'doc', content: [{ type: 'paragraph' }] })
export const newSection = (): ProjectSection => ({ id: crypto.randomUUID(), layout: 'image-left', heading: '', body: emptyDocument(), images: [], linkLabel: '', linkUrl: '' })
export const newMaterial = (author: string): ProjectMaterial => ({ authors: author, hero: '', heroAlt: '', title: '', subtitle: '', leader: author, supervisor: 'Mirjana Prpa', sections: [newSection()] })
