import type { Locale } from '@/i18n/config'

/**
 * Draft home page copy, written from the topics of his own publications (Docs/CONTENT.md explains
 * the sources). First person, plain words, no claim that is not backed by a paper on the site.
 * For the professor to rewrite or approve; Croatian needs a native proofread.
 */
export const homeSummary: Record<Locale, string> = {
  en: 'I model how water moves from rain to river to sea, to forecast floods earlier and to understand extremes. My work covers flash-flood early warning, typhoon-driven river discharge and coastal ocean models, from Japan to the Adriatic.',
  hr: 'Modeliram kako se voda kreće od kiše preko rijeke do mora kako bi se poplave mogle prognozirati ranije, a ekstremi bolje razumjeti. Moj rad obuhvaća rano upozoravanje na bujične poplave, protoke rijeka izazvane tajfunima i modele obalnog mora, od Japana do Jadrana.',
}

/** Croatian rank equivalent to "Research Associate": confirm with the professor before launch. */
export const roleHr = 'Znanstveni suradnik'

type Focus = { title: string; description: string }

export const researchFocus: Record<Locale, Focus[]> = {
  en: [
    {
      title: 'Flash-flood forecasting and early warning',
      description:
        'Real-time systems that couple hydrological and meteorological models, tested with ensemble hindcasts, to give flash-flood warnings earlier and more reliably.',
    },
    {
      title: 'Typhoon-driven river extremes',
      description:
        'Modelling the extreme river discharge that typhoons bring, including Typhoon Hagibis in 2019 and the floods in western Japan in 2018.',
    },
    {
      title: 'Rivers, coasts and the sea',
      description:
        'How river freshwater shapes coastal currents, temperature and salinity, and how storm surges can be modelled at the local scale, from the Ibaraki coast in Japan to the marine lake Zmajevo oko near Rogoznica.',
    },
    {
      title: 'Water history and long-term change',
      description:
        'Simulating a river diversion built four centuries ago on the Tone River, and tracing how precipitation in Japan has varied since 1891.',
    },
  ],
  hr: [
    {
      title: 'Prognoza bujičnih poplava i rano upozoravanje',
      description:
        'Sustavi u stvarnom vremenu koji povezuju hidrološke i meteorološke modele, provjereni ansamblskim simulacijama prošlih događaja, kako bi upozorenja o bujičnim poplavama stizala ranije i pouzdanije.',
    },
    {
      title: 'Ekstremi rijeka izazvani tajfunima',
      description:
        'Modeliranje ekstremnih protoka rijeka koje donose tajfuni, uključujući tajfun Hagibis 2019. i poplave u zapadnom Japanu 2018. godine.',
    },
    {
      title: 'Rijeke, obale i more',
      description:
        'Kako slatka voda rijeka oblikuje obalne struje, temperaturu i slanost te kako se olujni uspori mogu modelirati na lokalnoj razini, od obale prefekture Ibaraki u Japanu do morskog jezera Zmajevo oko kraj Rogoznice.',
    },
    {
      title: 'Povijest voda i dugoročne promjene',
      description:
        'Simulacija preusmjeravanja rijeke Tone izvedenog prije četiri stoljeća te praćenje promjena oborina u Japanu od 1891. godine.',
    },
  ],
}
