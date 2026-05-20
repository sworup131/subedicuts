/** Shop contact and branding — update with your real details before launch */
export const site = {
  name: 'Subedi CUTs',
  tagline: 'Precision cuts. Sharp finishes.',
  /** Short label under the name in the footer */
  footerLabel: 'Personal project',
  authorName: 'Sworup Subedi',
  /** E.164 or local format; used for tel: links */
  phone: null,
  email: null,
  address: {
    line1: null,
    city: null,
    region: null,
    postal: null,
  },
  mapsUrl: null,
  social: {
    github: 'https://github.com/sworup131',
    instagram: 'https://www.instagram.com/_sworupp/',
    linkedin: 'https://www.linkedin.com/in/sworup-subedi-11543830a/',
  },
  /** Project disclaimer shown in the footer */
  projectDisclaimer:
    'This site is not for business purposes. It is a personal project built to showcase my development and design skills.',
}

/** @param {typeof site.address} address */
export function formatAddressSingleLine(address) {
  if (!address?.line1) return null
  const cityRegion = [address.city, address.region].filter(Boolean).join(', ')
  return [address.line1, cityRegion, address.postal].filter(Boolean).join(', ')
}

/** @param {typeof site.social} social */
export function getActiveSocialLinks(social) {
  if (!social) return []
  return Object.entries(social).filter(([, url]) => Boolean(url))
}
