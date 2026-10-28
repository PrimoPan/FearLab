# Recruiting artwork

The SVGs, QQ character layers, and `qqshow-hongni/source.json` retain the original
bytes from HN's recruiting artwork. `recruiting-poster.svg` is the active poster;
`drafts/` preserves the other versions without including them in the public build.

Import displayed artwork through `src/content/recruitingAssets.ts`. Production
builds then use content-hashed COS URLs, and the existing image manifest/migration
scripts upload the displayed files publicly while archiving source images
privately. Do not add raw `/assets/…` URLs for these files.

Keep the accessible recruiting text in `src/pages/ContactPage.tsx` aligned with
the poster when its requirements or contact details change. Both the preview and
the enlarged reader use `RecruitingPosterArtwork` so the QQ layers stay aligned.
