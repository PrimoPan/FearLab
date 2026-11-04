export type ResearchSection = {
  id: 'description' | 'problem-statement' | 'literature-review' | 'design-process' | 'implementation' | 'showcase'
  number: string
  title: string
  prompts: string[]
}

export type CourseDesignBoard = { title: string; url: string; embedUrl: string }
export type DevelopmentStage = { id: string; title: string; description: string; output: string }
