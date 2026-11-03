export type ResearchSection = {
  id: string
  title: string
  prompts: string[]
}

export const courseResearchTemplate: ResearchSection[] = [
  {
    id: 'description',
    title: 'Description of the project (context)',
    prompts: [
      'Introduce the project, its intended users, and the setting in which it will be used.',
      'Describe the proposed experience and use a storyboard image sequence or video to illustrate the context, user actions, and system responses. Include image descriptions or video captions and a transcript.',
    ],
  },
  {
    id: 'problem-statement',
    title: 'Research Problem / Problem Statement',
    prompts: [
      'State the specific problem the project addresses, who experiences it, and the conditions in which it occurs.',
      'Support the problem statement with evidence and citations. Distinguish the problem from the proposed solution.',
    ],
  },
  {
    id: 'research-question',
    title: 'Research Question',
    prompts: [
      'State a focused, answerable research question that follows from the problem statement.',
      'If subquestions are needed, label them RQ1, RQ2, and so on, and explain what evidence would answer each one.',
    ],
  },
  {
    id: 'motivation',
    title: 'Motivation',
    prompts: [
      'Explain why this problem is worth investigating and why it matters to the intended users or research community.',
      'Describe the practical and academic reasons for pursuing the project, supported by evidence where appropriate.',
    ],
  },
  {
    id: 'research-gap',
    title: 'Research Gap',
    prompts: [
      'Identify what remains unresolved in existing knowledge, methods, or systems.',
      'Support the gap with the literature reviewed below and explain how it leads to the research question.',
    ],
  },
  {
    id: 'literature-review',
    title: 'Literature review',
    prompts: [
      'Synthesize relevant research by theme, theory, method, or approach. Compare findings and limitations rather than listing papers individually.',
      'Discuss the closest related work and cite the sources that establish the problem, research gap, and basis for the proposed approach.',
    ],
  },
  {
    id: 'novelty',
    title: 'Novelty of your work (especially in the context of lit.review)',
    prompts: [
      'Explain precisely how the proposed work differs from the closest studies or systems in the literature review.',
      'Identify the new perspective, interaction, method, application context, or evidence the project proposes to offer. Support comparisons with citations and avoid unsupported claims of being the first.',
    ],
  },
  {
    id: 'anticipated-contributions',
    title: 'Anticipated Contributions',
    prompts: [
      'List the expected contributions to knowledge, design, methods, or practice and connect each to the research question.',
      'Explain what evidence would establish each contribution. Label these as anticipated outcomes rather than completed findings.',
    ],
  },
  {
    id: 'scope-deliverables',
    title: 'Project Scope & Deliverables',
    prompts: [
      'In scope: specify the users, scenarios, functionality, and research or evaluation activities the project will cover.',
      'Out of scope: explicitly identify features, populations, settings, and claims that the project will not address.',
      'List concrete deliverables, such as a prototype, study protocol, evaluation report, or demonstration video. Define completion criteria, milestones, and dependencies for each.',
    ],
  },
  {
    id: 'tech-stack',
    title: 'Tech stack that will be utilized for this project',
    prompts: [
      'List the planned hardware, programming languages, frameworks, AI models or services, data storage, and development tools where applicable.',
      'Explain the role of each technology and why it fits the project. Record relevant versions, integration requirements, costs, and constraints; mark undecided choices as to be determined.',
    ],
  },
  {
    id: 'team-assignments',
    title: 'Team Assignments',
    prompts: [
      'Clearly state which team member is in charge of each part of the project, including research, design, implementation, evaluation, and reporting as applicable.',
      'For each member, specify their responsibilities, expected deliverables, and milestones. Identify a lead for shared tasks and explain dependencies between members.',
    ],
  },
  {
    id: 'references',
    title: 'References',
    prompts: [
      'Provide complete references in a consistent academic citation style, with DOI or source links where available.',
      'Ensure every in-text citation has a matching reference and verify bibliographic details against the original sources.',
    ],
  },
]
