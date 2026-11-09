import type { CourseDetails } from '../../content/course'
import type { CourseProject } from '../../content/courseProjects'
import type { ResearchSection, CourseDesignBoard, DevelopmentStage } from '../../content/courseResearchTemplate'

export type CourseContent = {
  course: CourseDetails
  courseProjects: CourseProject[]
  courseResearchTemplate: ResearchSection[]
  courseDesignBoard: CourseDesignBoard
  developmentStages: DevelopmentStage[]
  expiresAt: number
}
