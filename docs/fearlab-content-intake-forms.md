# FEAR Lab 网站内容收集 Google Forms 设计

这份文档用于搭建 3 个 Google Forms，并分别连接到 3 张 Google Sheets：

- News / Workshop 内容表：用于 News 页面里的两次 co-organized workshops，收集日期、照片、文案和链接。
- Project 内容表：用于 Project 页面里的进行中项目，收集项目标题图、多张图片、简介和参与者。
- Publication 内容表：用于 Publication 页面里的实验室发表，收集会议/期刊、论文、DOI、简介、视频、作者和代表图。

## 当前 FearLab 结构观察

- News 页面已经存在：`src/pages/NewsPage.tsx`。
- News 数据目前写在：`src/content/siteContent.ts`，其中有 `chiAcceptedPapers` 和 `chiWorkshops`。
- Project / Publication 目前还走建设中页面：`src/app/AppShell.tsx` 会把 `/projects` 和 `/publications` 路由到 `ConstructionPage`。
- 现有网站视觉语言偏英文、暗色、简洁、卡片化。表单收集到的内容建议直接要求英文版短文案，中文备注作为内部补充。

## 推荐工作流

1. 建 3 个 Google Forms，每个 Form 自动连接一张 Google Sheet。
2. Form 负责收集组员提交的原始信息和图片。
3. Sheet 里额外增加少量维护字段，如 `reviewStatus`、`publishReady`、`displayOrder`、`slug`、`localAssetPath`。
4. 网站维护者审核后，把发布就绪的数据整理进前端数据文件或 CMS。

## Google Forms 全局设置

- 打开 "Collect email addresses"，方便后续追问。
- 图片上传题启用 "File upload"，限制为图片格式，建议单文件 10 MB 以内。
- 文件上传建议要求登录 FEAR Lab / HKUST(GZ) 账号，避免匿名素材来源不清。
- 每个表单最后必须有图片授权确认：
  - "I confirm that the submitted text and media can be publicly displayed on the FEAR Lab website."
- 表单语言建议中文为主，关键字段保留英文名称，方便后续前端接入。
- 所有日期建议用 Google Forms 的 Date 题型；页面展示用单独的 `displayDate` 字段人工整理。

---

# Form 1: News / Workshop Submission

## 表单标题

FEAR Lab News - Workshop Content Submission

## 表单说明文案

用于收集 FEAR Lab 网站 News 页面中的 workshop 内容。每个 workshop 建议由负责人提交一次主信息；如果你只是补充照片或视频，请在第一题选择 "Supplement media only"。请尽量填写英文展示文案，并确保上传图片可以公开用于实验室网站。

## 建议问题

| Section | Question | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Submitter | Your name | Short answer | Yes | 提交人姓名 |
| Submitter | Your email | Email / collected automatically | Yes | 开启自动收集邮箱 |
| Submitter | Submission type | Multiple choice | Yes | New workshop entry / Update existing entry / Supplement media only |
| Workshop identity | Workshop title | Dropdown + Other | Yes | 默认放入现有两次 workshop 标题 |
| Workshop identity | Short display title | Short answer | No | 可用于移动端或卡片标题 |
| Workshop identity | Related event / conference | Short answer | Yes | 例如 CHI 2026 |
| Workshop identity | Workshop role | Multiple choice | Yes | Co-organized / Organized / Participated / Presented |
| Workshop identity | Location | Short answer | No | 例如 Barcelona, Spain / Online |
| Workshop identity | Start date | Date | Yes | 用于排序 |
| Workshop identity | End date | Date | No | 多日活动填写 |
| Workshop identity | Display date | Short answer | Yes | 例如 Apr 13, 2026 |
| Workshop identity | Official link | URL | No | CFP / workshop website / conference page |
| Website copy | One-sentence summary | Paragraph | Yes | 180 characters max, 用于卡片 |
| Website copy | Full website description | Paragraph | Yes | 80-120 words, 用于详情或扩展卡片 |
| Website copy | FEAR Lab contribution | Paragraph | Yes | 说明实验室角色、组织者、贡献 |
| Website copy | Key themes | Checkboxes | No | Embodied AI / Soma Design / AI Personas / HCI / XR / Responsible AI / Other |
| People | FEAR Lab members involved | Paragraph | Yes | 姓名用英文，逗号分隔 |
| People | External collaborators | Paragraph | No | 姓名、机构、角色 |
| Media | Cover photo | File upload | Yes | 1 张，横图优先 |
| Media | Additional photos | File upload | No | 最多 10 张 |
| Media | Captions for uploaded photos | Paragraph | No | 按文件名对应说明 |
| Media | Photo credit / source | Short answer | Yes | 摄影者或来源 |
| Media | Video link | URL | No | YouTube / Vimeo / Bilibili / Drive |
| Consent | Public website permission | Checkbox | Yes | 必选授权确认 |
| Admin | Internal notes | Paragraph | No | 仅内部使用 |

## Workshop title 默认选项

- Where is the Body in Designing (Through) AI? Frictions and Opportunities in Integrating AI with Soma Design
- From Generation to Simulation: Responsible Use of AI Personas in Human-Centered Design and Research
- Other / future workshop

## Google Sheet 表头

```csv
timestamp,submitterName,submitterEmail,submissionType,workshopTitle,shortDisplayTitle,relatedEvent,workshopRole,location,startDate,endDate,displayDate,officialLink,oneSentenceSummary,fullDescription,fearLabContribution,keyThemes,fearLabMembers,externalCollaborators,coverPhotoFiles,additionalPhotoFiles,photoCaptions,photoCredit,videoLink,publicPermission,internalNotes,reviewStatus,publishReady,displayOrder,slug,localAssetPath
```

## News 页面英文文案建议

Section kicker:

```text
Co-organized Workshops
```

Section intro:

```text
FEAR Lab helps convene workshop conversations around embodied AI design, responsible AI personas, and human-centered research methods.
```

Card copy template:

```text
{displayDate}
{workshopTitle}
{oneSentenceSummary}
```

---

# Form 2: Project Submission

## 表单标题

FEAR Lab Project - Website Content Submission

## 表单说明文案

用于收集 FEAR Lab 网站 Project 页面展示的进行中项目。每个项目建议由项目负责人或主要参与者提交一次。标题图可以上传多张，后续网站维护者会从中选择封面或做轮播展示。请用英文填写对外展示文案，中文备注可写在最后的内部备注里。

## 建议问题

| Section | Question | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Submitter | Your name | Short answer | Yes | 提交人 |
| Submitter | Your email | Email / collected automatically | Yes | 开启自动收集邮箱 |
| Basics | Project title | Short answer | Yes | 对外展示标题 |
| Basics | Short title / acronym | Short answer | No | 例如 Ellma-T |
| Basics | Project status | Multiple choice | Yes | Ongoing / Recruiting / Data collection / Under review / Recently completed |
| Basics | Project category | Checkboxes | Yes | AI / HCI / XR / Health / Education / Accessibility / Design Research / Other |
| Basics | Start date | Date | No | 用于时间线 |
| Basics | Expected end date | Date | No | 可留空 |
| Basics | Primary contact person | Short answer | Yes | 项目负责人 |
| Website copy | Project tagline | Short answer | Yes | 120 characters max |
| Website copy | Short card description | Paragraph | Yes | 40-60 words |
| Website copy | Full project introduction | Paragraph | Yes | 100-180 words |
| Website copy | Research question / motivation | Paragraph | No | 项目为什么重要 |
| Website copy | Methods / system / study type | Paragraph | No | 例如 VR prototype, interview study, LLM system |
| Website copy | Current outcome / next step | Paragraph | No | 当前阶段或预期成果 |
| People | PI / supervisor | Short answer | No | 如有 |
| People | Project lead(s) | Paragraph | Yes | 英文姓名，逗号分隔 |
| People | Participants | Paragraph | Yes | 建议格式：Name - role - affiliation |
| People | Open to collaborators? | Multiple choice | No | Yes / No / Maybe |
| Media | Cover / title image(s) | File upload | Yes | 1-5 张，横图优先 |
| Media | Additional gallery images | File upload | No | 最多 10 张 |
| Media | Image captions | Paragraph | No | 按文件名对应 |
| Media | Image alt text | Paragraph | Yes | 网站无障碍文本 |
| Links | Demo link | URL | No | 项目 demo |
| Links | Video link | URL | No | 公开视频 |
| Links | Code / artifact link | URL | No | GitHub / OSF / Drive |
| Links | Related publication(s) | Paragraph | No | DOI 或论文标题 |
| Consent | Public website permission | Checkbox | Yes | 必选授权确认 |
| Admin | Internal notes | Paragraph | No | 中文补充也可放这里 |

## Google Sheet 表头

```csv
timestamp,submitterName,submitterEmail,projectTitle,shortTitle,projectStatus,projectCategory,startDate,expectedEndDate,primaryContact,tagline,shortDescription,fullIntroduction,researchQuestion,methods,currentOutcome,piSupervisor,projectLeads,participants,openToCollaborators,coverImageFiles,galleryImageFiles,imageCaptions,imageAltText,demoLink,videoLink,artifactLink,relatedPublications,publicPermission,internalNotes,reviewStatus,publishReady,displayOrder,slug,localAssetPath
```

## Project 页面英文文案建议

Page kicker:

```text
Projects
```

Page headline:

```text
Ongoing Research Projects
```

Page intro:

```text
FEAR Lab projects explore how AI, HCI, and XR systems can support embodied interaction, learning, well-being, and human-centered design practice.
```

Project card template:

```text
{projectTitle}
{tagline}
Led by {projectLeads}
{shortDescription}
```

---

# Form 3: Publication Submission

## 表单标题

FEAR Lab Publication - Website Archive Submission

## 表单说明文案

用于收集 FEAR Lab 成立以来的论文、会议发表、期刊文章、workshop paper、poster、demo 或预印本。请按正式发表信息填写，作者顺序必须与论文一致。若 DOI 暂未发布，可以先填写 paper link 或 "Not available yet"。

## 建议问题

| Section | Question | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Submitter | Your name | Short answer | Yes | 提交人 |
| Submitter | Your email | Email / collected automatically | Yes | 开启自动收集邮箱 |
| Publication identity | Paper title | Paragraph | Yes | 与论文完全一致 |
| Publication identity | Publication year | Short answer | Yes | 例如 2026 |
| Publication identity | Status | Multiple choice | Yes | Published / Accepted / In press / Preprint / Under review |
| Publication identity | Publication type | Multiple choice | Yes | Conference paper / Journal article / Workshop paper / Poster / Demo / Preprint |
| Publication identity | Venue name | Short answer | Yes | 例如 CHI, DIS, UIST, CSCW |
| Publication identity | Venue full name / edition | Short answer | No | 例如 CHI 2026 |
| Publication identity | Track / session | Short answer | No | 如 Social VR |
| Publication identity | DOI | Short answer | No | 例如 10.1145/... |
| Publication identity | Paper URL | URL | No | ACM DL / arXiv / publisher |
| Publication identity | Award / recognition | Short answer | No | Best Paper, Honorable Mention |
| Authors | Full author list | Paragraph | Yes | 按论文顺序，英文姓名 |
| Authors | FEAR Lab author(s) | Paragraph | Yes | 实验室成员 |
| Authors | Corresponding author | Short answer | No | 如适用 |
| Authors | Equal contribution notes | Short answer | No | 例如 first two authors contributed equally |
| Website copy | One-line contribution | Short answer | Yes | 160 characters max |
| Website copy | Website summary | Paragraph | Yes | 80-140 words, 不直接复制 abstract 也可以 |
| Website copy | Keywords / tags | Checkboxes | No | AI / HCI / XR / VR / Education / Health / Embodied Interaction / Personas / Other |
| Website copy | Related project | Short answer | No | 关联 Project 页面标题 |
| Media | Representative figure | File upload | Yes | 1 张，横图优先 |
| Media | Figure caption | Paragraph | No | 可公开展示 |
| Media | Figure alt text | Paragraph | Yes | 网站无障碍文本 |
| Media | Video link | URL | No | Talk / teaser / demo |
| Links | Code link | URL | No | GitHub 等 |
| Links | Dataset / material link | URL | No | OSF / Drive 等 |
| Citation | BibTeX | Paragraph | No | 推荐粘贴 |
| Citation | APA / plain citation | Paragraph | No | 可选 |
| Consent | Public website permission | Checkbox | Yes | 必选授权确认 |
| Admin | Internal notes | Paragraph | No | 内部补充 |

## Google Sheet 表头

```csv
timestamp,submitterName,submitterEmail,paperTitle,publicationYear,status,publicationType,venueName,venueFullName,trackSession,doi,paperUrl,award,fullAuthorList,fearLabAuthors,correspondingAuthor,equalContributionNotes,oneLineContribution,websiteSummary,keywords,relatedProject,representativeFigureFile,figureCaption,figureAltText,videoLink,codeLink,datasetMaterialLink,bibtex,apaCitation,publicPermission,internalNotes,reviewStatus,publishReady,displayOrder,slug,localAssetPath
```

## Publication 页面英文文案建议

Page kicker:

```text
Publications
```

Page headline:

```text
Research Outputs and Publications
```

Page intro:

```text
FEAR Lab publications document our work across AI-mediated interaction, immersive systems, embodied design, learning support, and human-centered research methods.
```

Publication card template:

```text
{venueName} {publicationYear}
{paperTitle}
{fullAuthorList}
DOI: {doi}
{oneLineContribution}
```

## 建议审核字段说明

这些字段不要放在 Google Form 里，可以在 Google Sheet 后面手动新增：

| Field | Suggested values | Purpose |
| --- | --- | --- |
| reviewStatus | New / Needs edit / Approved / Rejected | 内容审核状态 |
| publishReady | Yes / No | 是否可放上网站 |
| displayOrder | Number | 网站排序 |
| slug | kebab-case text | 前端路由或 key |
| localAssetPath | text | 图片下载到仓库后的路径 |

## 前端数据结构建议

后续如果把 Sheet 数据整理进 `src/content/siteContent.ts`，建议拆成 3 个数组：

```ts
export const newsWorkshops = [...]
export const labProjects = [...]
export const labPublications = [...]
```

这样可以逐步替换现有的 `chiWorkshops`，并把 `/projects` 和 `/publications` 从建设中页面切换成真实列表页。
