import type { Locale } from '@/i18n/config'

/** Sample authors used to seed the `authors` collection. Run via src/seed/run.ts. */
export type AuthorLinks = {
  orcid?: string
  scholar?: string
  researchgate?: string
  linkedin?: string
  website?: string
}

export type AuthorSeed = {
  slug: string
  name: string
  /** Names this author appears under in publication author lists. */
  aliases: string[]
  title: Record<Locale, string>
  institution: string
  location: string
  bio: Record<Locale, string>
  interests: string[]
  gradient: string
  isVerified: boolean
  memberSince: number
  links: AuthorLinks
}

export const authorSeeds: AuthorSeed[] = [
  {
    slug: 'samuel-adeyemi',
    name: 'Dr. Samuel Adeyemi',
    aliases: ['Dr. Samuel Adeyemi'],
    title: { en: 'Senior Lecturer, Computer Science', hr: 'Viši predavač, računarstvo' },
    institution: 'University of Lagos',
    location: 'Lagos, Nigeria',
    bio: {
      en: 'Samuel studies how machine learning and edge sensing can make cities more efficient and more livable. His work connects spatial-temporal deep learning with municipal infrastructure, from traffic signal control to energy balancing, and is validated on real metropolitan testbeds.',
      hr: 'Samuel istražuje kako strojno učenje i rubno senzoriranje mogu gradove učiniti učinkovitijima i ugodnijima za život. Njegov rad povezuje prostorno-vremensko duboko učenje s gradskom infrastrukturom, od upravljanja semaforima do uravnoteženja energije, a provjeren je na stvarnim metropolitanskim testnim područjima.',
    },
    interests: ['Machine Learning', 'Smart Cities', 'Edge Computing', 'Urban Analytics'],
    gradient: 'gradient-cs',
    isVerified: true,
    memberSince: 2021,
    links: {
      orcid: 'https://orcid.org/0000-0002-1825-0097',
      scholar: 'https://scholar.google.com/',
      linkedin: 'https://www.linkedin.com/',
    },
  },
  {
    slug: 'josko-troselj',
    name: 'Dr. Joško Trošelj',
    aliases: ['Dr. Joško Trošelj', 'Trošelj J.', 'Troselj J.'],
    title: { en: 'Research Scientist, Hydrology', hr: 'Znanstveni istraživač, hidrologija' },
    institution: 'Ruđer Bošković Institute',
    location: 'Zagreb, Croatia',
    bio: {
      en: 'Joško works on flood forecasting, coastal hazards and the impact of climate change on water resources, combining numerical modelling with operational early-warning systems.',
      hr: 'Joško se bavi prognoziranjem poplava, obalnim opasnostima i utjecajem klimatskih promjena na vodne resurse, spajajući numeričko modeliranje s operativnim sustavima ranog upozoravanja.',
    },
    interests: ['Hydrology', 'Flood Forecasting', 'Climate Impacts', 'Early Warning'],
    gradient: 'gradient-hydro',
    isVerified: true,
    memberSince: 2020,
    links: { scholar: 'https://scholar.google.com/' },
  },
  {
    slug: 'funke-adebayo',
    name: 'Dr. Funke Adebayo',
    aliases: ['Dr. Funke Adebayo'],
    title: { en: 'Associate Professor, Energy Systems', hr: 'Izvanredna profesorica, energetski sustavi' },
    institution: 'Obafemi Awolowo University',
    location: 'Ile-Ife, Nigeria',
    bio: {
      en: 'Funke designs decentralised renewable energy systems for rural electrification, with a focus on techno-economic modelling and community-managed governance.',
      hr: 'Funke projektira decentralizirane sustave obnovljive energije za elektrifikaciju ruralnih područja, s naglaskom na tehno-ekonomsko modeliranje i upravljanje u zajednici.',
    },
    interests: ['Renewable Energy', 'Microgrids', 'Rural Electrification'],
    gradient: 'gradient-energy',
    isVerified: true,
    memberSince: 2022,
    links: {},
  },
  {
    slug: 'blessing-okonfor',
    name: 'Prof. Blessing Okonfor',
    aliases: ['Prof. Blessing Okonfor', 'Prof. Blessing Okafor'],
    title: { en: 'Professor, Education & Policy', hr: 'Profesorica, obrazovanje i politike' },
    institution: 'University of Ibadan',
    location: 'Ibadan, Nigeria',
    bio: {
      en: 'Blessing researches how digital tools change learning outcomes and how energy and infrastructure policy shape access to education.',
      hr: 'Blessing istražuje kako digitalni alati mijenjaju ishode učenja i kako politike energije i infrastrukture oblikuju pristup obrazovanju.',
    },
    interests: ['Digital Learning', 'Education Policy', 'Energy Access'],
    gradient: 'gradient-edu',
    isVerified: false,
    memberSince: 2023,
    links: {},
  },
]
