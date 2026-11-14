import type { Publication } from '@/payload-types'

/**
 * Transcribed from joskotroselj.wordpress.com/publications on 2026-11-14, titles and author
 * strings as printed there (including "Troselj" without diacritics in older entries and the
 * "Reproducebility" spelling in one title). Conference papers are only partly listed on the old
 * site; the rest live on Google Scholar. To be proofread by the professor.
 */
export type SeedPublication = Pick<Publication, 'title' | 'type' | 'year'> &
  Partial<Pick<Publication, 'venue' | 'volume' | 'issue' | 'pages' | 'doi' | 'url'>> & {
    authors: string[]
  }

const B2 = 'Journal of Japan Society of Civil Engineers, Ser. B2 (Coastal Engineering)'
const B3 = 'Journal of Japan Society of Civil Engineers, Ser. B3 (Ocean Engineering)'

export const seedPublications: SeedPublication[] = [
  {
    title: 'Simulating the Tone River eastward diversion project in Japan carried out 4 centuries ago',
    type: 'journal-article',
    authors: ['Trošelj J.', 'Hanasaki N.'],
    venue: 'Hydrology and Earth System Sciences',
    volume: '29',
    issue: '3',
    pages: '753-766',
    doi: '10.5194/hess-29-753-2025',
    url: 'https://hess.copernicus.org/articles/29/753/2025/',
    year: 2025,
  },
  {
    title:
      'Exploring the Underlying Patterns and Relationships Between Temperature and Heavy Rainfall Events over Western Japan',
    type: 'book-chapter',
    authors: ['Nayak S.', 'Trošelj J.', 'Pattnayak KC.', 'Bharambe KP.'],
    venue: 'Computing, Communication and Intelligence',
    pages: '300-304',
    doi: '10.1201/9781003581215',
    url: 'https://www.taylorfrancis.com/chapters/edit/10.1201/9781003581215-62/exploring-underlying-patterns-relationships-temperature-heavy-rainfall-events-western-japan-sridhara-nayak-jo%C5%A1ko-tro%C5%A1elj-kanhu-charan-pattnayak-khagendra-bharambe',
    year: 2025,
  },
  {
    title:
      'Real-time Flash Flood Forecasting Approach for Development of Early Warning Systems: Integrated Hydrological and Meteorological Application',
    type: 'journal-article',
    authors: ['Trošelj J.', 'Nayak S.', 'Hobohm L.', 'Takemi T.'],
    venue: 'Geomatics, Natural Hazards and Risk',
    volume: '14',
    issue: '1',
    pages: '2269295',
    doi: '10.1080/19475705.2023.2269295',
    year: 2023,
  },
  {
    title:
      'Enhancing a Real-Time Flash Flood Predictive Accuracy Approach for the Development of Early Warning Systems: Hydrological Ensemble Hindcasts and Parameterizations',
    type: 'journal-article',
    authors: ['Trošelj J.', 'Lee HS.', 'Hobohm L.'],
    venue: 'Sustainability',
    volume: '15',
    issue: '18',
    pages: '13897',
    doi: '10.3390/su151813897',
    url: 'https://www.mdpi.com/2071-1050/15/18/13897',
    year: 2023,
  },
  {
    title: 'Modelling Typhoon-Induced Extreme River Discharges: A Case Study of Typhoon Hagibis in Japan',
    type: 'journal-article',
    authors: ['Trošelj J.', 'Lee HS.'],
    venue: 'Journal of Hydrology: Regional Studies',
    volume: '34',
    pages: '100776',
    doi: '10.1016/j.ejrh.2021.100776',
    url: 'https://www.sciencedirect.com/science/article/pii/S2214581821000057',
    year: 2021,
  },
  {
    title: 'Dynamical Downscaling of Coastal Dynamics for Two Extreme Storm Surge Events in Japan',
    type: 'journal-article',
    authors: ['Trošelj J.', 'Ninomiya J.', 'Takewaka S.', 'Mori N.'],
    venue: 'Frontiers in Marine Science',
    volume: '7',
    pages: '566277',
    doi: '10.3389/fmars.2020.566277',
    url: 'https://www.frontiersin.org/articles/10.3389/fmars.2020.566277/full',
    year: 2021,
  },
  {
    title: 'Seasonal Variabilities of Sea Surface Temperature and Salinity on Ibaraki Coast',
    type: 'journal-article',
    authors: ['Troselj J.', 'Imai Y.', 'Ninomiya J.', 'Mori N.'],
    venue: B2,
    volume: '75',
    issue: '2',
    pages: '1213-1218',
    doi: '10.2208/kaigan.75.I_1213',
    url: 'https://www.jstage.jst.go.jp/article/kaigan/75/2/75_I_1213/_article/-char/ja',
    year: 2019,
  },
  {
    title:
      'Analysis of Polar Front and Thermal Environment in the Sea of Japan using Long-Term Ocean Reanalysis Data',
    type: 'journal-article',
    authors: ['Hamano R.', 'Ninomiya J.', 'Troselj J.', 'Mori N.'],
    venue: B2,
    volume: '75',
    issue: '2',
    pages: '1201-1206',
    doi: '10.2208/kaigan.75.I_1201',
    url: 'https://www.jstage.jst.go.jp/article/kaigan/75/2/75_I_1201/_article/-char/ja/',
    year: 2019,
  },
  {
    title: 'Coastal Current Downscaling Emphasizing Freshwater Impact on Ibaraki Coast',
    type: 'journal-article',
    authors: ['Troselj J.', 'Imai Y.', 'Ninomiya J.', 'Mori N.'],
    venue: B2,
    volume: '74',
    issue: '2',
    pages: '1357-1362',
    doi: '10.2208/kaigan.74.I_1357',
    url: 'https://www.jstage.jst.go.jp/article/kaigan/74/2/74_I_1357/_article/-char/ja/',
    year: 2018,
  },
  {
    title:
      'Evaluation of Reproducebility and Water Flux Analyses at Straits of Japan Sea using Long-term Ocean Reanalysis Data',
    type: 'journal-article',
    authors: ['Ninomiya J.', 'Hamano R.', 'Mori N.', 'Troselj J.', 'Ishikawa Y.', 'Nishikawa S.'],
    venue: B3,
    volume: '74',
    issue: '2',
    pages: '988-993',
    doi: '10.2208/jscejoe.74.I_988',
    url: 'https://www.jstage.jst.go.jp/article/jscejoe/74/2/74_I_988/_article/-char/ja/',
    year: 2018,
  },
  {
    title:
      'Modeling of extreme freshwater outflow from the north-eastern Japanese river basins to western Pacific Ocean',
    type: 'journal-article',
    authors: [
      'Troselj J.',
      'Sayama T.',
      'Varlamov SM.',
      'Sasaki T.',
      'Racault M-F.',
      'Takara K.',
      'Miyazawa Y.',
      'Kuroki R.',
      'Yamagata T.',
      'Yamashiki Y.',
    ],
    venue: 'Journal of Hydrology',
    volume: '555',
    pages: '956-970',
    doi: '10.1016/j.jhydrol.2017.10.042',
    url: 'https://www.sciencedirect.com/science/article/pii/S0022169417307175',
    year: 2017,
  },
  {
    title:
      'Influence of Planned Reservoir Zoretici to Possibilities of Using Water Resources of Rjecina River',
    type: 'proceedings-paper',
    authors: ['Troselj J.', 'Ozanic N.'],
    venue: 'Proceedings of the University of Rijeka, Faculty of Civil Engineering',
    volume: '15',
    pages: '59-83',
    url: 'https://www.bib.irb.hr/641734',
    year: 2013,
  },
  {
    title: 'Ocean Circulation Response to Inflow from Abukuma River Outlet',
    type: 'bulletin-article',
    authors: ['Troselj J.', 'Yamashiki Y.', 'Takara K.'],
    venue: 'Disaster Prevention Research Institute Annuals',
    volume: '56 B',
    pages: '87-95',
    url: 'https://repository.kulib.kyoto-u.ac.jp/dspace/handle/2433/181560',
    year: 2013,
  },
  {
    title:
      'Great steps forward can be made for improving quality of life with small human engineering waterworks and small destructions of natural flows',
    type: 'conference-paper',
    authors: ['Trošelj J.', 'Hanasaki N.'],
    venue: 'EGU General Assembly 2025',
    url: 'https://meetingorganizer.copernicus.org/EGU25/EGU25-19448.html',
    year: 2025,
  },
  {
    title: 'Simulating the historical human engineering waterworks in Tone River',
    type: 'conference-paper',
    authors: ['Hanasaki N.', 'Trošelj J.'],
    venue: 'Japan Geoscience Union Meeting 2025 (oral, session A-HW24-12)',
    url: 'https://www.jpgu.org/meeting_e2025/sessionlist_en/detail/A-HW24.html',
    year: 2025,
  },
  {
    title:
      'On underlying water circulation physical mechanisms and interactions in the water column layers of marine lake “Zmajevo oko” near Rogoznica',
    type: 'conference-paper',
    authors: ['Trošelj J.', 'Dominović I.', 'Pečar Ilić J.', 'Ciglenečki I.', 'Kirillin G.'],
    venue:
      'Knjiga sažetaka V. znanstveno-stručnog skupa Prilagodbe na klimatske promjene i očuvanje morskih ekosustava Jadranskog mora s međunarodnim sudjelovanjem, Zadar',
    url: 'https://www.croris.hr/crosbi/publikacija/prilog-skup/857206',
    year: 2024,
  },
  {
    title:
      'Long-Term Historical Climate Trends and Natural Variabilites of ISIMIP2b and Observed Precipitation Data in Japan Since 1891',
    type: 'conference-paper',
    authors: ['Trošelj J.', 'Hanasaki N.'],
    venue:
      'Japan Society of Hydrology and Water Resources / Japan Society of Hydrological Sciences 2022 Research Proceedings (oral)',
    pages: '117',
    doi: '10.11520/jshwr.35.0_117',
    url: 'https://www.jstage.jst.go.jp/article/jshwr/35/0/35_117/_article/-char/ja/',
    year: 2022,
  },
  {
    title: 'Hydrological Ensemble Approach for Flash Flood Early Warning System Development',
    type: 'conference-paper',
    authors: ['Trošelj J.'],
    venue: 'American Geophysical Union Fall Meeting 2022, Chicago, United States (poster)',
    pages: 'H52I-0570',
    url: 'https://ui.adsabs.harvard.edu/abs/2022AGUFM.H52I0570T/abstract',
    year: 2022,
  },
  {
    title:
      'Hydrometeorological Real-Time Forecasting Framework for Flash Flood Early Warning System Development',
    type: 'conference-paper',
    authors: ['Trošelj J.', 'Nayak S.', 'Hobohm L.', 'Takemi T.'],
    venue: 'American Geophysical Union Fall Meeting 2022, Chicago, United States (oral)',
    pages: 'A45F-12',
    url: 'https://ui.adsabs.harvard.edu/abs/2022AGUFM.A45F..12T/abstract',
    year: 2022,
  },
  {
    title:
      'A Method to Forecast Extreme River Discharges from Typhoon Hagibis 2019 and Western Japan Floods 2018',
    type: 'conference-paper',
    authors: ['Trošelj J.', 'Lee HS.'],
    venue:
      'Japan Geoscience Union – American Geophysical Union Joint Meeting 2020, Tokyo, Japan (iPoster with short oral talk)',
    pages: 'AOS25-P04',
    url: 'https://confit.atlas.jp/guide/event/jpgu2020/subject/AOS25-P04/detail',
    year: 2020,
  },
  {
    title: 'Future Projection and Assessment of Natural Variabilities of the Ibaraki Coastal Current System',
    type: 'conference-paper',
    authors: ['Trošelj J.', 'Ninomiya J.', 'Mori N.'],
    venue: 'Japan Geoscience Union – American Geophysical Union Joint Meeting 2020, Tokyo, Japan (iPoster)',
    pages: 'ACG60-04',
    url: 'https://confit.atlas.jp/guide/event/jpgu2020/subject/ACG60-04/detail',
    year: 2020,
  },
  {
    title:
      'Downscaling of Coastal Current to 200 m Scale in the Ibaraki Prefecture with Included Freshwater Outflow Impact',
    type: 'invited-talk',
    authors: ['Troselj J.', 'Imai Y.', 'Ninomiya J.', 'Mori N.'],
    venue: 'Japan Geoscience Annual Meeting, Tokyo, Japan',
    year: 2018,
  },
  {
    title:
      'Modeling of Extreme Freshwater Outflow from the North-Eastern Japanese River Basins to Western Pacific Ocean',
    type: 'invited-lecture',
    authors: ['Troselj J.'],
    venue: '12th Scientific Colloquium of the University of Rijeka, Rijeka, Croatia',
    year: 2017,
  },
]
