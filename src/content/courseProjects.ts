type CourseProject = {
  team: string
  title: string
  students: { name: string; email: string }[]
}

export const courseProjects: CourseProject[] = [
  {
    team: '01',
    title: "Who's in Control? Handoff Cues and Trust in Human–Robot Collaboration",
    students: [
      { name: 'ZHU Wenhao', email: 'wzhu307@connect.hkust-gz.edu.cn' },
      { name: 'ZOU Yi', email: 'yzou906@connect.hkust-gz.edu.cn' },
      { name: 'Honghao Xu', email: 'hxu883@connect.hkust-gz.edu.cn' },
    ],
  },
  {
    team: '02',
    title: 'Opportunity, Not Obligation: Designing Robot Gaze to Support Entry into Group Conversations',
    students: [
      { name: 'HUANG Xueyin', email: 'xhuang704@connect.hkust-gz.edu.cn' },
      { name: 'CHEN Yanan', email: 'ychen750@connect.hkust-gz.edu.cn' },
      { name: 'LI Yunwei', email: 'yli130@connect.hkust-gz.edu.cn' },
    ],
  },
  {
    team: '03',
    title: 'Nomi: A Patient-Controlled Desktop Companion for Chronic-Care Visit Preparation',
    students: [
      { name: 'HU Yi', email: 'yhu909@connect.hkust-gz.edu.cn' },
      { name: 'LIAO Can', email: 'cliao622@connect.hkust-gz.edu.cn' },
      { name: 'PAN Dongyijie', email: 'dpan750@connect.hkust-gz.edu.cn' },
    ],
  },
  {
    team: '04',
    title: 'Bi-Directional Embodied AI System for Mitigating Human-Feline Separation Anxiety',
    students: [
      { name: 'LI Hangxia', email: 'hli277@connect.hkust-gz.edu.cn' },
      { name: 'WANG Ye', email: 'ywang081@connect.hkust-gz.edu.cn' },
      { name: 'NIU Ruowen', email: 'rniu440@connect.hkust-gz.edu.cn' },
    ],
  },
  {
    team: '05',
    title: 'CORIA: When the Room Becomes the Body – An Embodied Light Agent That Keeps Absent Others Present',
    students: [
      { name: 'YU Tongzhou', email: 'tyu432@connect.hkust-gz.edu.cn' },
      { name: 'LI Jiatong', email: 'jli085@connect.hkust-gz.edu.cn' },
      { name: 'MAI Yuming', email: 'ymai090@connect.hkust-gz.edu.cn' },
    ],
  },
  {
    team: '06',
    title: "Learning Teachers' Experiential Knowledge for Robot Facilitation in Autism Education",
    students: [
      { name: 'CHENG Qiyuan', email: 'qcheng517@connect.hkust-gz.edu.cn' },
      { name: 'LIU Jinming', email: 'jliu380@connect.hkust-gz.edu.cn' },
      { name: 'LE Xu', email: 'lxu760@connect.hkust-gz.edu.cn' },
    ],
  },
  {
    team: '07',
    title: 'What Can Teachers Teach an Embodied AI about Classroom Orchestration? A Feasibility Study of Training Embodied AI with Embodied and Tacit Teacher Knowledge',
    students: [
      { name: 'PAN Mengxu', email: 'mpan108@connect.hkust-gz.edu.cn' },
      { name: 'QIAN BAOYI', email: 'bqian080@connect.hkust-gz.edu.cn' },
      { name: 'YANG MANDI', email: 'myang674@connect.hkust-gz.edu.cn' },
    ],
  },
]
