import qiyuanId from '../../../../assets/People/id/Qiyuan.jpg'
import qiyuanLife from '../../../../assets/People/photos/life/Qiyuan.jpg'
import { paragraphs, tidyWebsite } from '../helpers'
import type { PersonRecord } from '../types'

export const qiyuanCheng: PersonRecord = {
  slug: 'qiyuan-cheng',
  name: 'Qiyuan Cheng',
  positionLabel: 'Research Assistant',
  groupKey: 'ra',
  website: tidyWebsite(''),
  emails: ['chengqiyuan2024@gmail.com'],
  researchInterest: 'Aging, XR, Human-AI Interaction',
  bioParagraphs: paragraphs(
    `Qiyuan Cheng is a research assistant at FEAR Lab, HKUST (Guangzhou), under
    Dr. Mirjana Prpa. He holds an M.S. in Industrial Engineering (Human Factors) from
    the University of Illinois Urbana-Champaign, where he worked with Dr. Avinash Gupta
    and Dr. Wendy Rogers on VR-based engagement for older adults.`
  ),
  idPhoto: qiyuanId,
  lifePhoto: qiyuanLife,
  lifePhotoAlt: 'Qiyuan Cheng standing by the waterfront.',
  storySide: 'left',
  photoContain: true,
  photoPositionDesktop: '52% 24%',
  photoPositionMobile: '56% 18%',
  photoBrightness: 1.05,
  backdropBrightness: 0.9,
  photoScaleStart: 1,
  photoScaleEnd: 1.02
}
