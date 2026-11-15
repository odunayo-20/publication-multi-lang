import type { Publication } from '@/payload-types'

export interface ExtendedBenchmarkPublication extends Publication {
  coverGradient: string
  views: string
  citationsCount: string
  keywordsList: string[]
}

export const benchmarkPublications: Record<string, ExtendedBenchmarkPublication> = {
  'review-renewable-energy-rural-communities': {
    id: 9001,
    title: 'A Review of Renewable Energy Solutions for Rural Communities',
    slug: 'review-renewable-energy-rural-communities',
    type: 'journal-article',
    authors: [
      { name: 'Dr. Funke Adebayo', isSelf: false },
      { name: 'Prof. Blessing Okonfor', isSelf: false },
      { name: 'Dr. Joško Trošelj', isSelf: true },
    ],
    venue: 'International Journal of Engineering Research',
    year: 2025,
    volume: '11',
    issue: '3',
    pages: '142-168',
    doi: '10.1234/acp.2025.003',
    abstract:
      'Access to reliable, affordable, and clean energy remains a critical catalyst for socio-economic development across underserved rural regions globally. This review synthesizes recent advancements in decentralized renewable energy systems, focusing on off-grid photovoltaic microgrids, biomass gasification, wind-diesel hybrids, and emerging iron-flow/lithium-iron-phosphate battery storage architectures. We analyze techno-economic models across 42 implemented rural electrification projects, comparing levelized cost of electricity (LCOE), intermittency mitigation techniques, and community-managed governance frameworks. Findings indicate that hybrid microgrids with smart load dispatch achieve 99.2% uptime while reducing operating expenses by up to 48% compared to diesel-based minigrids. The paper concludes with actionable policy recommendations for international development agencies and regional grid operators to accelerate equitable rural energy transition.',
    coverGradient: 'gradient-energy',
    views: '842',
    citationsCount: '8',
    keywordsList: [
      'Renewable Energy',
      'Microgrids',
      'Solar Photovoltaics',
      'Rural Electrification',
      'Energy Policy',
      'Decentralized Grids',
    ],
    updatedAt: '2025-11-02T10:00:00.000Z',
    createdAt: '2025-11-02T10:00:00.000Z',
    _status: 'published',
  },

  'machine-learning-approaches-smart-cities': {
    id: 9002,
    title: 'Machine Learning Approaches for Sustainable Smart Cities',
    slug: 'machine-learning-approaches-smart-cities',
    type: 'journal-article',
    authors: [
      { name: 'Dr. Samuel Adeyemi', isSelf: false },
      { name: 'Dr. Joško Trošelj', isSelf: true },
    ],
    venue: 'International Journal of Computer Science and Applications',
    year: 2025,
    volume: '12',
    issue: '4',
    pages: '88-104',
    doi: '10.1234/acp.2025.001',
    abstract:
      'This study explores the application of machine learning techniques in developing sustainable smart cities. The research examines how data-driven models can optimize urban resources, improve energy efficiency, and enhance the quality of life for citizens. By integrating spatial-temporal deep neural networks with edge IoT sensor arrays, the proposed framework enables dynamic real-time traffic signal optimization, anomaly detection in municipal water distribution, and localized thermal load forecasting. Empirical evaluations across three metropolitan testbeds demonstrate an 18.4% reduction in peak-hour vehicular emissions and a 22.7% improvement in municipal power grid balancing efficiency. Results confirm that machine learning plays an indispensable role in achieving sustainability goals in modern urban environments.',
    coverGradient: 'gradient-cs',
    views: '1.2k',
    citationsCount: '23',
    keywordsList: [
      'Machine Learning',
      'Smart Cities',
      'Sustainability',
      'Urban Planning',
      'Data Analytics',
      'Edge Computing',
    ],
    updatedAt: '2025-11-12T08:30:00.000Z',
    createdAt: '2025-11-12T08:30:00.000Z',
    _status: 'published',
  },

  'impact-digital-learning-student-performance': {
    id: 9003,
    title: 'The Impact of Digital Learning on Student Performance',
    slug: 'impact-digital-learning-student-performance',
    type: 'journal-article',
    authors: [
      { name: 'Prof. Blessing Okonfor', isSelf: false },
      { name: 'Dr. Samuel Adeyemi', isSelf: false },
    ],
    venue: 'Journal of Education and Practice',
    year: 2025,
    volume: '15',
    issue: '2',
    pages: '45-59',
    doi: '10.1234/acp.2025.002',
    abstract:
      'A longitudinal cohort study evaluating digital learning tools, adaptive learning management platforms, and student academic performance across tertiary educational institutions. The study evaluates cognitive engagement, flipped classroom efficacy, and equity in multimodal remote learning across 2,400 students over a four-semester curriculum. Results demonstrate statistically significant gains in critical reasoning scores (p < 0.001) and self-paced retention rates.',
    coverGradient: 'gradient-edu',
    views: '930',
    citationsCount: '12',
    keywordsList: [
      'Digital Learning',
      'Educational Technology',
      'Student Performance',
      'Pedagogical Frameworks',
      'Higher Education',
    ],
    updatedAt: '2025-11-10T11:15:00.000Z',
    createdAt: '2025-11-10T11:15:00.000Z',
    _status: 'published',
  },

  'youth-participation-community-development': {
    id: 9004,
    title: 'Youth Participation in Community Development Projects',
    slug: 'youth-participation-community-development',
    type: 'journal-article',
    authors: [
      { name: 'Dr. Musa Ibrahim', isSelf: false },
      { name: 'Dr. Funke Adebayo', isSelf: false },
    ],
    venue: 'Journal of Social Sciences and Humanities',
    year: 2025,
    volume: '9',
    issue: '3',
    pages: '112-128',
    doi: '10.1234/acp.2025.004',
    abstract:
      'Investigating participatory civic engagement among youth cohorts in municipal grassroots community initiatives. Through mixed-method survey evaluations and structured qualitative stakeholder interviews, the paper identifies socio-demographic drivers, digital collaboration avenues, and institutional policy bottlenecks influencing youth engagement and civic program sustainability.',
    coverGradient: 'gradient-cs',
    views: '521',
    citationsCount: '6',
    keywordsList: [
      'Civic Engagement',
      'Community Development',
      'Youth Leadership',
      'Public Policy',
      'Social Sciences',
    ],
    updatedAt: '2025-10-31T09:00:00.000Z',
    createdAt: '2025-10-31T09:00:00.000Z',
    _status: 'published',
  },

  'real-time-flash-flood-forecasting-early-warning': {
    id: 9005,
    title: 'Real-time Flash Flood Forecasting: Integrated Hydrological & Meteorological Models',
    slug: 'real-time-flash-flood-forecasting-early-warning',
    type: 'journal-article',
    authors: [
      { name: 'Dr. Joško Trošelj', isSelf: true },
      { name: 'Dr. Sridhara Nayak', isSelf: false },
      { name: 'Prof. Tetsuya Takemi', isSelf: false },
    ],
    venue: 'Geomatics, Natural Hazards and Risk',
    year: 2023,
    volume: '14',
    issue: '1',
    pages: '2269295',
    doi: '10.1080/19475705.2023.2269295',
    abstract:
      'Coupling meso-scale numerical weather prediction ensemble hindcasts with distributed kinematic wave runoff models for high-fidelity flash flood early warning and emergency disaster management in steep coastal and mountainous catchments.',
    coverGradient: 'gradient-hydro',
    views: '1.5k',
    citationsCount: '31',
    keywordsList: [
      'Flash Flood Forecasting',
      'Early Warning Systems',
      'Hydrological Modeling',
      'Disaster Mitigation',
      'Kinematic Wave',
    ],
    updatedAt: '2023-10-28T14:20:00.000Z',
    createdAt: '2023-10-28T14:20:00.000Z',
    _status: 'published',
  },

  'deep-learning-urban-traffic-management': {
    id: 9006,
    title: 'Deep Learning for Urban Traffic Management Systems',
    slug: 'deep-learning-urban-traffic-management',
    type: 'journal-article',
    authors: [
      { name: 'Dr. Samuel Adeyemi', isSelf: false },
      { name: 'Prof. Blessing Okonfor', isSelf: false },
    ],
    venue: 'International Journal of Computer Science and Applications',
    year: 2025,
    volume: '12',
    issue: '4',
    pages: '120-135',
    doi: '10.1234/acp.2025.005',
    abstract:
      'Deploying deep convolutional and spatial-temporal graph neural networks for real-time intersection congestion control, vehicle flow forecasting, and dynamic signal phase adaptation in high-density metropolitan corridors.',
    coverGradient: 'gradient-cs',
    views: '956',
    citationsCount: '16',
    keywordsList: [
      'Deep Learning',
      'Traffic Management',
      'Graph Neural Networks',
      'Intelligent Transportation',
      'Smart Mobility',
    ],
    updatedAt: '2025-11-10T16:00:00.000Z',
    createdAt: '2025-11-10T16:00:00.000Z',
    _status: 'published',
  },

  'data-driven-energy-optimization': {
    id: 9007,
    title: 'Data-Driven Energy Optimization in Smart Grids',
    slug: 'data-driven-energy-optimization',
    type: 'journal-article',
    authors: [
      { name: 'Dr. Funke Adebayo', isSelf: false },
      { name: 'Dr. Samuel Adeyemi', isSelf: false },
    ],
    venue: 'International Journal of Engineering Research',
    year: 2025,
    volume: '11',
    issue: '2',
    pages: '77-92',
    doi: '10.1234/acp.2025.006',
    abstract:
      'Predictive energy load balancing and automated demand-response algorithms in decentralized smart grid networks with intermittent renewable generation assets and distributed battery storage.',
    coverGradient: 'gradient-energy',
    views: '742',
    citationsCount: '9',
    keywordsList: [
      'Energy Optimization',
      'Smart Grids',
      'Demand Response',
      'Load Balancing',
      'Battery Storage',
    ],
    updatedAt: '2025-11-08T09:40:00.000Z',
    createdAt: '2025-11-08T09:40:00.000Z',
    _status: 'published',
  },

  'ai-smart-city-infrastructure': {
    id: 9008,
    title: 'AI in Smart City Infrastructure Resilience',
    slug: 'ai-smart-city-infrastructure',
    type: 'journal-article',
    authors: [
      { name: 'Dr. Joško Trošelj', isSelf: true },
      { name: 'Dr. Samuel Adeyemi', isSelf: false },
    ],
    venue: 'International Journal of Engineering Research',
    year: 2025,
    volume: '11',
    issue: '3',
    pages: '140-156',
    doi: '10.1234/acp.2025.007',
    abstract:
      'Examining cyber-physical resilience in smart city municipal infrastructure using automated anomaly detection, multi-sensor fusion, and distributed edge computing.',
    coverGradient: 'gradient-hydro',
    views: '640',
    citationsCount: '11',
    keywordsList: [
      'Smart City Infrastructure',
      'Artificial Intelligence',
      'Cyber-Physical Systems',
      'Resilience',
      'Sensor Fusion',
    ],
    updatedAt: '2025-11-02T13:20:00.000Z',
    createdAt: '2025-11-02T13:20:00.000Z',
    _status: 'published',
  },

  'renewable-energy-solutions-sustainable-future': {
    id: 9009,
    title: 'Renewable Energy Solutions for a Sustainable Future',
    slug: 'renewable-energy-solutions-sustainable-future',
    type: 'journal-article',
    authors: [
      { name: 'A. Smith', isSelf: false },
      { name: 'Prof. R. Gbadur', isSelf: false },
    ],
    venue: 'International Journal of Engineering Research',
    year: 2025,
    volume: '11',
    issue: '4',
    pages: '201-218',
    doi: '10.1234/acp.2025.008',
    abstract:
      'A comprehensive evaluation of next-generation renewable storage integration, offshore wind farm dynamics, and sustainable clean grid transitions in industrialized economies.',
    coverGradient: 'gradient-energy',
    views: '1.5k',
    citationsCount: '13',
    keywordsList: [
      'Renewable Energy',
      'Sustainable Future',
      'Offshore Wind',
      'Grid Transition',
      'Energy Storage',
    ],
    updatedAt: '2025-11-16T10:00:00.000Z',
    createdAt: '2025-11-16T10:00:00.000Z',
    _status: 'published',
  },

  'solar-energy-systems-design-optimization': {
    id: 9010,
    title: 'Solar Energy Systems: Design and Optimization',
    slug: 'solar-energy-systems-design-optimization',
    type: 'journal-article',
    authors: [
      { name: 'M. Ibrahim', isSelf: false },
      { name: 'S. Yosuf', isSelf: false },
    ],
    venue: 'International Journal of Engineering Research',
    year: 2025,
    volume: '11',
    issue: '4',
    pages: '219-234',
    doi: '10.1234/acp.2025.009',
    abstract:
      'Computational approaches for multi-objective optimization of photovoltaic array tilt angles, dynamic tracking mechanics, and inverter sizing in high-insolation sub-tropical zones.',
    coverGradient: 'gradient-energy',
    views: '1.1k',
    citationsCount: '9',
    keywordsList: [
      'Solar Energy',
      'Photovoltaic Systems',
      'Multi-Objective Optimization',
      'Tracking Mechanics',
    ],
    updatedAt: '2025-11-12T14:00:00.000Z',
    createdAt: '2025-11-12T14:00:00.000Z',
    _status: 'published',
  },

  'economic-impact-sustainable-energy-policies': {
    id: 9011,
    title: 'The Economic Impact of Sustainable Energy Policies',
    slug: 'economic-impact-sustainable-energy-policies',
    type: 'journal-article',
    authors: [
      { name: 'L. Johnsen', isSelf: false },
      { name: 'C. Adeyemi', isSelf: false },
    ],
    venue: 'Journal of Social Sciences and Humanities',
    year: 2025,
    volume: '9',
    issue: '4',
    pages: '180-198',
    doi: '10.1234/acp.2025.010',
    abstract:
      'Macroeconomic modeling of feed-in tariffs, carbon tax incentives, and renewable energy capital subsidies across emerging market economies.',
    coverGradient: 'gradient-edu',
    views: '742',
    citationsCount: '6',
    keywordsList: [
      'Energy Economics',
      'Sustainable Policies',
      'Carbon Tax',
      'Macroeconomics',
      'Public Subsidies',
    ],
    updatedAt: '2025-11-07T08:00:00.000Z',
    createdAt: '2025-11-07T08:00:00.000Z',
    _status: 'published',
  },

  'ai-driven-energy-management-smart-grids': {
    id: 9012,
    title: 'AI-Driven Energy Management for Smart Grids',
    slug: 'ai-driven-energy-management-smart-grids',
    type: 'journal-article',
    authors: [
      { name: 'D. Nelson', isSelf: false },
      { name: 'F. Olane', isSelf: false },
    ],
    venue: 'International Journal of Engineering Research',
    year: 2025,
    volume: '11',
    issue: '4',
    pages: '240-258',
    doi: '10.1234/acp.2025.011',
    abstract:
      'Reinforcement learning frameworks for decentralized battery storage dispatch and frequency stabilization across high-penetration renewable microgrids.',
    coverGradient: 'gradient-cs',
    views: '521',
    citationsCount: '4',
    keywordsList: [
      'Artificial Intelligence',
      'Smart Grids',
      'Energy Management',
      'Reinforcement Learning',
      'Battery Dispatch',
    ],
    updatedAt: '2025-11-03T11:00:00.000Z',
    createdAt: '2025-11-03T11:00:00.000Z',
    _status: 'published',
  },
}

export function getBenchmarkPublication(slug: string): ExtendedBenchmarkPublication | null {
  return benchmarkPublications[slug] ?? null
}

export function getBenchmarkRelatedPublications(
  currentSlug?: string,
  limit = 3,
): Array<{
  id: string | number
  title: string
  slug: string
  date: string
  coverGradient: string
}> {
  const all = Object.values(benchmarkPublications).filter((p) => p.slug !== currentSlug)
  return all.slice(0, limit).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug ?? '',
    date: `Nov ${p.year}`,
    coverGradient: p.coverGradient,
  }))
}

