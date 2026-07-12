export type PublicationRecord = {
  id: string
  title: string
  authors: readonly string[]
  year: number
  date: string
  venue: string
  articleUrl: string
}

export const publications: readonly PublicationRecord[] = [
  {
    id: 'understanding-down-syndrome-stereotypes',
    title: 'Understanding Down Syndrome Stereotypes in LLM-Based Personas',
    authors: [
      'Chantelle Wu',
      'Mengxu Pan',
      'Peinan Wang',
      'Nafi Nibras',
      'Meida Li',
      'Dajun Yuan',
      'Zhixiao Wang',
      'Jiahuan He',
      'Mona Ali',
      'Mirjana Prpa'
    ],
    year: 2026,
    date: '13 June 2026',
    venue: 'Proceedings of the 2026 Designing Interactive Systems Conference',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3800645.3812894'
  },
  {
    id: 'toward-scalable-patient-safety-training',
    title:
      'Toward Scalable Patient Safety Training: A Prototype for Root Cause Analysis Simulation With AI Virtual Avatars',
    authors: [
      'Yuqi Hu',
      'Qiwen Xiong',
      'Zhenzhen Qin',
      'Brandon Watanabe',
      'Yujing Wang',
      'Mirjana Prpa',
      'Ilmi Yoon'
    ],
    year: 2026,
    date: '8 May 2026',
    venue: '2026 IEEE Conference on Artificial Intelligence',
    articleUrl: 'https://ieeexplore.ieee.org/document/11536351/'
  },
  {
    id: 'llm-based-embodied-conversational-agent',
    title:
      'LLM-Based Embodied Conversational Agent for Reducing Foreign Language Speaking Anxiety in Social VR',
    authors: [
      'Mengxu Pan',
      'Panxin Liu',
      'Jinda Zhang',
      'Raina Cao',
      'Viduni Ariyawansa',
      'Yaning Li',
      'Bingsheng Yao',
      'Dakuo Wang',
      'Philippe Pasquier',
      'Alexandra Kitson',
      'Mirjana Prpa'
    ],
    year: 2026,
    date: '13 April 2026',
    venue: 'Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3772318.3791068'
  },
  {
    id: 'quantifying-latencies',
    title:
      'Quantifying Latencies: A Conversation Analysis Approach to Human-Agent Interactions in Virtual Reality',
    authors: [
      'Raina Cao',
      'Mengxu Pan',
      'Panxin Liu',
      'Viduni Ariyawansa',
      'Mirjana Prpa',
      'Alexandra Kitson'
    ],
    year: 2026,
    date: '13 April 2026',
    venue: 'Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3772318.3790947'
  },
  {
    id: 'from-generation-to-simulation',
    title:
      'From Generation to Simulation: Responsible Use of AI Personas in Human-Centered Design and Research',
    authors: [
      'Ahmet Baki Kocaballi',
      'Mirjana Prpa',
      'Joni Salminen',
      'Danial Amin',
      'Bernard J. Jansen'
    ],
    year: 2026,
    date: '13 April 2026',
    venue:
      'Proceedings of the Extended Abstracts of the 2026 CHI Conference on Human Factors in Computing Systems',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3772363.3778745'
  },
  {
    id: 'where-is-the-body',
    title:
      'Where Is the Body in Designing (Through) AI? Frictions and Opportunities in Integrating AI with Soma Design',
    authors: [
      'Claudia Núñez-Pacheco',
      'Pedro Sanches',
      'Jesse Josua Benjamin',
      'Iohanna Nicenboim',
      'Mirjana Prpa',
      'Sarah Fdili Alaoui',
      'Michelle Rennerova'
    ],
    year: 2026,
    date: '13 April 2026',
    venue:
      'Proceedings of the Extended Abstracts of the 2026 CHI Conference on Human Factors in Computing Systems',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3772363.3778774'
  },
  {
    id: 'user-perspectives-social-vr',
    title: 'User Perspectives on the Role of LLM-Based AI Agents in Social VR',
    authors: ['Alexandra Kitson', 'Mirjana Prpa'],
    year: 2026,
    date: '21 March 2026',
    venue:
      '2026 IEEE Conference on Virtual Reality and 3D User Interfaces Abstracts and Workshops',
    articleUrl: 'https://ieeexplore.ieee.org/document/11489599/'
  },
  {
    id: 'a-safe-first-step',
    title:
      '“A Safe First Step”: Design and Evaluation of an Emotionally Expressive AI Virtual Patient for Clinical Simulation in Speech-Language Pathology Training',
    authors: [
      'Yuqi Hu',
      'Yujing Wang',
      'Brandon Watanabe',
      'Mingkai Gao',
      'Zhenzhen Qin',
      'Kunyi Shi',
      'Zinan Zhang',
      'Shreevidhya Shambanna',
      'Zhuoying Xue',
      'Tao Zou',
      'Qiwen Xiong',
      'Nia Johnson',
      'Mirjana Prpa',
      'Brandy Jernigan',
      'Ilmi Yoon',
      'Akram Bayat'
    ],
    year: 2026,
    date: '4 February 2026',
    venue: 'Research Square preprint',
    articleUrl: 'https://www.researchsquare.com/article/rs-8588902/v1'
  },
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
    venue:
      'Proceedings of the 56th ACM Technical Symposium on Computer Science Education, Volume 2',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3641555.3705250'
  },
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
    venue: 'arXiv preprint arXiv:2409.15623',
    articleUrl: 'https://arxiv.org/abs/2409.15623'
  },
  {
    id: 'hybrid-drawing-solutions',
    title: 'Hybrid Drawing Solutions in AR Bitmap-to-Vector Techniques on 3D Surfaces',
    authors: ['Pengcheng Ding', 'Yedian Cheng', 'Mirjana Prpa'],
    year: 2024,
    date: '23 September 2024',
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
    venue:
      'Extended Abstracts of the 2024 CHI Conference on Human Factors in Computing Systems',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3613905.3651026'
  },
  {
    id: 'extended-reality-high-fidelity-learning',
    title: 'Extended Reality: Meeting the Promise of Real-Time High Fidelity Learning Environments',
    authors: [
      'Anthony Estey',
      'Derek Jacoby',
      'Yvonne Coady',
      'Rachel Ralph',
      'Mirjana Prpa',
      'Marc-Antoine Drouin',
      'Frank Maurer'
    ],
    year: 2022,
    date: '28 September 2022',
    venue:
      'Adjunct Publication of the 24th International Conference on Human-Computer Interaction with Mobile Devices and Services',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3528575.3551428'
  },
  {
    id: 'attending-to-inner-self',
    title:
      'Attending to Inner Self: Designing and Unfolding Breath-Based VR Experiences Through Micro-Phenomenology',
    authors: ['Mirjana Prpa'],
    year: 2020,
    date: '17 August 2020',
    venue: 'Simon Fraser University',
    articleUrl: 'https://summit.sfu.ca/item/20693'
  },
  {
    id: 'articulating-experience',
    title:
      'Articulating Experience: Reflections from Experts Applying Micro-Phenomenology to Design Research in HCI',
    authors: ['Mirjana Prpa', 'Sarah Fdili-Alaoui', 'Thecla Schiphorst', 'Philippe Pasquier'],
    year: 2020,
    date: '21 April 2020',
    venue: 'Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3313831.3376664'
  },
  {
    id: 'inhaling-and-exhaling',
    title: 'Inhaling and Exhaling: How Technologies Can Perceptually Extend Our Breath Awareness',
    authors: [
      'Mirjana Prpa',
      'Ekaterina R. Stepanova',
      'Thecla Schiphorst',
      'Bernhard E. Riecke',
      'Philippe Pasquier'
    ],
    year: 2020,
    date: '21 April 2020',
    venue: 'Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3313831.3376183'
  },
  {
    id: 'respire-virtual-reality-art',
    title: 'Respire: Virtual Reality Art with Musical Agent Guided by Respiratory Interaction',
    authors: ['Kıvanç Tatar', 'Mirjana Prpa', 'Philippe Pasquier'],
    year: 2019,
    date: '1 December 2019',
    venue: 'Leonardo Music Journal',
    articleUrl: 'https://direct.mit.edu/lmj/article/69852'
  },
  {
    id: 'micro-phenomenology-first-person-hci',
    title: 'Micro-Phenomenology in First Person HCI and Design Research',
    authors: ['Philippe Pasquier', 'Mirjana Prpa'],
    year: 2019,
    date: '2019',
    venue: 'First-Person Research Methods in HCI Workshop, DIS 2019',
    articleUrl:
      'https://1stpersonresearch.wordpress.com/wp-content/uploads/2019/05/02-prpa.pdf'
  },
  {
    id: 'brain-computer-interfaces-art',
    title: 'Brain-Computer Interfaces in Contemporary Art: A State of the Art and Taxonomy',
    authors: ['Mirjana Prpa', 'Philippe Pasquier'],
    year: 2019,
    date: '26 May 2019',
    venue: 'Brain Art: Brain-Computer Interfaces for Artistic Expression',
    articleUrl: 'https://link.springer.com/chapter/10.1007/978-3-030-14323-7_3'
  },
  {
    id: 'immersive-interactive-technologies',
    title:
      'Immersive Interactive Technologies for Positive Change: A Scoping Review and Design Considerations',
    authors: ['Alexandra Kitson', 'Mirjana Prpa', 'Bernhard E. Riecke'],
    year: 2018,
    date: '3 August 2018',
    venue: 'Frontiers in Psychology',
    articleUrl:
      'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.01354/full'
  },
  {
    id: 'attending-to-breath',
    title:
      'Attending to Breath: Exploring How the Cues in a Virtual Environment Guide the Attention to Breath and Shape the Quality of Experience to Support Mindfulness',
    authors: [
      'Mirjana Prpa',
      'Kıvanç Tatar',
      'Jules Françoise',
      'Bernhard E. Riecke',
      'Thecla Schiphorst',
      'Philippe Pasquier'
    ],
    year: 2018,
    date: '8 June 2018',
    venue: 'Proceedings of the 2018 Designing Interactive Systems Conference',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3196709.3196765'
  },
  {
    id: 'respire-breath-away',
    title: 'Respire: A Breath Away from the Experience in Virtual Environment',
    authors: ['Mirjana Prpa', 'Thecla Schiphorst', 'Kıvanç Tatar', 'Philippe Pasquier'],
    year: 2018,
    date: '20 April 2018',
    venue:
      'Extended Abstracts of the 2018 CHI Conference on Human Factors in Computing Systems',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3170427.3180282'
  },
  {
    id: 'pulse-breath-water-system',
    title:
      'The Pulse Breath Water System: Exploring Breathing as an Embodied Interaction for Enhancing the Affective Potential of Virtual Reality',
    authors: ['Mirjana Prpa', 'Kıvanç Tatar', 'Bernhard E. Riecke', 'Philippe Pasquier'],
    year: 2017,
    date: '14 May 2017',
    venue: 'International Conference on Virtual, Augmented and Mixed Reality',
    articleUrl: 'https://link.springer.com/chapter/10.1007/978-3-319-57987-0_13'
  },
  {
    id: 'sonic-cradle',
    title:
      'Sonic Cradle—Immersive Interaction Design Combining Breathing and Neurofeedback to Foster Focused Attention Meditation on Breath',
    authors: [
      'Mirjana Prpa',
      'Denise Quesnel',
      'Alexandra Kitson',
      'Karen Cochrane',
      'Jay Vidyarthi',
      'Bernhard E. Riecke'
    ],
    year: 2016,
    date: '2016',
    venue: '2nd International Conference on Mindfulness',
    articleUrl:
      'https://www.researchgate.net/publication/301888217_Sonic_Cradle_-_Immersive_interaction_design_combining_breathing-_and_neurofeedback_to_foster_focused_attention_meditation_on_breath'
  },
  {
    id: 'hacking-alternatives',
    title:
      'Hacking Alternatives in 21st Century: Designing a Bio-Responsive Virtual Environment for Stress Reduction',
    authors: ['Mirjana Prpa', 'Karen Anne Cochrane', 'Bernhard E. Riecke'],
    year: 2015,
    date: '24 September 2015',
    venue: 'International Symposium on Pervasive Computing Paradigms for Mental Health',
    articleUrl: 'https://link.springer.com/chapter/10.1007/978-3-319-32270-4_4'
  },
  {
    id: 'state-scape',
    title: 'State.scape: A Brain as an Experience Generator',
    authors: ['Mirjana Prpa', 'Bernhard E. Riecke', 'Svetozar Miucin'],
    year: 2015,
    date: 'August 2015',
    venue: 'Proceedings of the 21st International Symposium on Electronic Art',
    articleUrl:
      'https://www.isea-symposium-archives.org/presentation/state-scape-a-brain-as-an-experience-generator/'
  },
  {
    id: 'stereo-projection-vection',
    title:
      'Comparing the Effectiveness of Stereo Projection Versus 3D TV in Inducing Self-Motion Illusions (Vection)',
    authors: [
      'Jacqueline D. Jordan',
      'Mirjana Prpa',
      'Daniel Feuereissen',
      'Bernhard E. Riecke'
    ],
    year: 2014,
    date: '8 August 2014',
    venue: 'Proceedings of the ACM Symposium on Applied Perception',
    articleUrl: 'https://dl.acm.org/doi/10.1145/2628257.2628360'
  }
] as const
