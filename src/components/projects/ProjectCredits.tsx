import { Link } from 'react-router-dom'
import primoPortrait from '../../../assets/Projects/phd/primo-mc2.jpg'
import mirjanaPortrait from '../../../assets/People/id/prpa.jpg'

const projectTeam = [
  {
    role: 'Project Leader',
    name: 'Dongyijie Primo Pan',
    portrait: primoPortrait,
    width: 1272,
    height: 1247,
    crop: 'object-[45%_center]',
    profile: '/people?member=dongyijie-primo-pan',
    linkLabel: 'Project leader profile'
  },
  {
    role: 'Supervisor',
    name: 'Mirjana Prpa',
    portrait: mirjanaPortrait,
    width: 1696,
    height: 2528,
    crop: 'object-[50%_25%] scale-[1.3] origin-[50%_40%]',
    profile: '/people?member=mirjana-prpa',
    linkLabel: 'Supervisor profile'
  }
] as const

const profileLinkClasses =
  'inline-flex min-h-11 items-center gap-4 border-b border-accent pb-1 text-sm text-ink no-underline transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent'

export function ProjectCredits() {
  return (
    <section
      className="border-t border-line py-[clamp(3rem,7vw,6rem)]"
      aria-labelledby="project-credits-title"
    >
      <h2
        id="project-credits-title"
        className="m-0 mb-10 font-mono text-xs font-normal tracking-[0.16em] text-accent uppercase"
      >
        Project team
      </h2>

      <div className="grid grid-cols-2 items-start gap-x-[clamp(2rem,7vw,7rem)] gap-y-12 max-[700px]:grid-cols-1">
        {projectTeam.map((person) => (
          <figure key={person.role} className="m-0 w-full max-w-[24rem]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                className={`absolute inset-0 h-full w-full object-cover ${person.crop}`}
                src={person.portrait}
                width={person.width}
                height={person.height}
                alt={`${person.name}, ${person.role.toLowerCase()}.`}
                loading="lazy"
              />
            </div>
            <figcaption className="mt-6">
              <p className="m-0 mb-3 text-sm text-ink-soft">{person.role}</p>
              <h3 className="m-0 text-[clamp(1.8rem,3.1vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.045em] text-ink min-[701px]:min-h-[2.1em]">
                {person.name}
              </h3>
              <p className="mb-5 mt-4 font-mono text-[0.65rem] tracking-[0.12em] text-ink-soft uppercase">
                FEAR Lab · HKUST(GZ)
              </p>
              <Link className={profileLinkClasses} to={person.profile}>
                {person.linkLabel} <span aria-hidden="true">↗</span>
              </Link>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
