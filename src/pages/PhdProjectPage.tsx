import { ProjectCredits } from '../components/projects/ProjectCredits'
import { ProjectHero } from '../components/projects/ProjectHero'
import { ProjectMethods } from '../components/projects/ProjectMethods'
import { ProjectNeurodiversity } from '../components/projects/ProjectNeurodiversity'
import { ProjectOutputs } from '../components/projects/ProjectOutputs'
import { ProjectResearchGap } from '../components/projects/ProjectResearchGap'
import { projectWidth } from '../components/projects/ProjectReveal'
import { ProjectWearables } from '../components/projects/ProjectWearables'

export function PhdProjectPage() {
  return (
    <article className="relative z-[1]">
      <ProjectHero />
      <div className={projectWidth}>
        <ProjectResearchGap />
        <ProjectNeurodiversity />
        <ProjectWearables />
        <ProjectMethods />
        <ProjectOutputs />
        <ProjectCredits />
      </div>
    </article>
  )
}
