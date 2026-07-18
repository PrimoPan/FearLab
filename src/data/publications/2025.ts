import type { PublicationRecord } from './types'

export const publications2025 = [
  {
    id: 'root-cause-analysis-training',
    title:
      'Root Cause Analysis Training for Healthcare Professionals With AI-Powered Virtual Simulation: A Proof-of-Concept',
    authors: [
      'Yuqi Hu',
      'Qiwen Xiong',
      'Zhenzhen Qin',
      'Brandon Watanabe',
      'Yujing Wang',
      'Mirjana Prpa',
      'Ilmi Yoon'
    ],
    year: 2025,
    date: '6 August 2025',
    sortDate: '2025-08-06',
    kind: 'preprint',
    venueTag: 'preprint',
    venue: 'arXiv preprint arXiv:2508.04904',
    articleUrl: 'https://arxiv.org/abs/2508.04904'
  },
  {
    id: 'ellma-t',
    title:
      'ELLMA-T: An Embodied LLM-Agent for Supporting English Language Learning in Social VR',
    authors: ['Mengxu Pan', 'Alexandra Kitson', 'Hongyu Wan', 'Mirjana Prpa'],
    year: 2025,
    date: '5 July 2025',
    sortDate: '2025-07-05',
    kind: 'conference',
    venueTag: 'dis',
    venue: 'Proceedings of the 2025 ACM Designing Interactive Systems Conference',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3715336.3735786'
  },
  {
    id: 'persona-l',
    title:
      'Persona-L Has Entered the Chat: Leveraging LLMs and Ability-Based Framework for Personas of People with Complex Needs',
    authors: [
      'Lipeipei Sun',
      'Tianzi Qin',
      'Anran Hu',
      'Jiale Zhang',
      'Shuojia Lin',
      'Jianyan Chen',
      'Mona Ali',
      'Mirjana Prpa'
    ],
    year: 2025,
    date: '2025',
    sortDate: '2025-01-01',
    kind: 'conference',
    venueTag: 'chi',
    venue: 'Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3706598.3713445'
  },
  {
    id: 'your-voice-is-your-voice',
    title:
      'Your Voice Is Your Voice: Supporting Self-Expression Through Speech Generation and LLMs in Augmented and Alternative Communication',
    authors: [
      'Yiwen Xu',
      'Monideep Chakraborti',
      'Tianyi Zhang',
      'Katelyn Eng',
      'Aanchan Mohan',
      'Mirjana Prpa'
    ],
    year: 2025,
    date: '21 March 2025',
    sortDate: '2025-03-21',
    kind: 'preprint',
    venueTag: 'preprint',
    venue: 'arXiv preprint arXiv:2503.17479',
    articleUrl: 'https://arxiv.org/abs/2503.17479'
  },
  {
    id: 'simulating-requirement-elicitation',
    title:
      'Simulating Requirement Elicitation: Development and Evaluation of a Persona-Based Tool',
    authors: ['Ildar Akhmetov', 'Mirjana Prpa'],
    year: 2025,
    date: '18 February 2025',
    sortDate: '2025-02-18',
    kind: 'conference',
    venueTag: 'sigcse',
    venue:
      'Proceedings of the 56th ACM Technical Symposium on Computer Science Education, Volume 2',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3641555.3705250'
  }
] as const satisfies readonly PublicationRecord[]
