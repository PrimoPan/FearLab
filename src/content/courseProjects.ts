export type CourseProject = {
  team: string
  teamLabel?: string
  aliases?: string[]
  title: string
  summary: string
  teaser?: { src: string; alt: string }
  students: { name: string; email: string }[]
}
