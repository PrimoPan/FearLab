import type { PublicationRecord } from './types'

export const publications2024 = [
  {
    id: 'challenges-and-opportunities-synthetic-personae',
    title: 'Challenges and Opportunities of LLM-Based Synthetic Personae and Data in HCI',
    authors: [
      'Mirjana Prpa',
      'Giovanni Maria Troiano',
      'Bingsheng Yao',
      'Toby Jia-Jun Li',
      'Dakuo Wang',
      'Hansu Gu'
    ],
    year: 2024,
    date: '11 November 2024',
    sortDate: '2024-11-11',
    kind: 'conference',
    venueTag: 'cscw',
    venue:
      'Companion Publication of the 2024 Conference on Computer-Supported Cooperative Work and Social Computing',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3678884.3681826'
  },
  {
    id: 'safe-guard',
    title:
      'Safe Guard: An LLM-Agent for Real-Time Voice-Based Hate Speech Detection in Social Virtual Reality',
    authors: ['Yiwen Xu', 'Qinyang Hou', 'Hongyu Wan', 'Mirjana Prpa'],
    year: 2024,
    date: '23 September 2024',
    sortDate: '2024-09-23',
    kind: 'preprint',
    venueTag: 'preprint',
    venue: 'arXiv preprint arXiv:2409.15623',
    articleUrl: 'https://arxiv.org/abs/2409.15623'
  },
  {
    id: 'hybrid-drawing-solutions',
    title: 'Hybrid Drawing Solutions in AR Bitmap-to-Vector Techniques on 3D Surfaces',
    authors: ['Pengcheng Ding', 'Yedian Cheng', 'Mirjana Prpa'],
    year: 2024,
    date: '23 September 2024',
    sortDate: '2024-09-23',
    kind: 'preprint',
    venueTag: 'preprint',
    venue: 'arXiv preprint arXiv:2409.15171',
    articleUrl: 'https://arxiv.org/abs/2409.15171'
  },
  {
    id: 'powerful-modern-aac-tool',
    title: 'A Powerful and Modern AAC Composition Tool for Impaired Speakers',
    authors: [
      'Aanchan Mohan',
      'Monideep Chakraborti',
      'Katelyn Eng',
      'Nailia Kushaeva',
      'Mirjana Prpa',
      'Jordan Lewis',
      'Tianyi Zhang',
      'Vince Geisler',
      'Carol Geisler'
    ],
    year: 2024,
    date: '2024',
    sortDate: '2024-01-01',
    kind: 'conference',
    venueTag: 'interspeech',
    venue: 'Proceedings of Interspeech 2024',
    articleUrl: 'https://www.isca-archive.org/interspeech_2024/mohan24_interspeech.html'
  },
  {
    id: 'human-llm-voice-assistant-interaction',
    title:
      'Human and LLM-Based Voice Assistant Interaction: An Analytical Framework for User Verbal and Nonverbal Behaviors',
    authors: [
      'Szeyi Chan',
      'Shihan Fu',
      'Jiachen Li',
      'Bingsheng Yao',
      'Smit Desai',
      'Mirjana Prpa',
      'Dakuo Wang'
    ],
    year: 2024,
    date: '29 August 2024',
    sortDate: '2024-08-29',
    kind: 'preprint',
    venueTag: 'preprint',
    venue: 'arXiv preprint arXiv:2408.16465',
    articleUrl: 'https://arxiv.org/abs/2408.16465'
  },
  {
    id: 'building-llm-ai-agents',
    title: 'Building LLM-Based AI Agents in Social Virtual Reality',
    authors: [
      'Hongyu Wan',
      'Jinda Zhang',
      'Abdulaziz Arif Suria',
      'Bingsheng Yao',
      'Dakuo Wang',
      'Yvonne Coady',
      'Mirjana Prpa'
    ],
    year: 2024,
    date: '11 May 2024',
    sortDate: '2024-05-11',
    kind: 'conference',
    venueTag: 'chi-ea',
    venue:
      'Extended Abstracts of the 2024 CHI Conference on Human Factors in Computing Systems',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3613905.3651026'
  }
] as const satisfies readonly PublicationRecord[]
