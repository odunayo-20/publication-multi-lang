import type { Locale } from '@/i18n/config'

/**
 * Built-in policy copy. It is a reasonable starting point, not legal advice: the editorial office
 * should review every page (Terms & Privacy especially) before launch. A published page in the
 * Payload "pages" collection with the same slug replaces the built-in text.
 */
export const policySlugs = [
  'author-guidelines',
  'peer-review',
  'open-access',
  'publication-ethics',
  'editorial-board',
  'preservation',
  'contact',
  'terms-privacy',
] as const

export type PolicySlug = (typeof policySlugs)[number]

export const isPolicySlug = (value: string): value is PolicySlug =>
  (policySlugs as readonly string[]).includes(value)

export type PolicySection = { heading: string; body?: string[]; list?: string[] }
export type Policy = { title: string; summary: string; sections: PolicySection[] }

const en: Record<PolicySlug, Policy> = {
  'author-guidelines': {
    title: 'Author guidelines',
    summary: 'What to prepare before you submit, and how we expect a manuscript to be formatted.',
    sections: [
      {
        heading: 'Before you submit',
        list: [
          'The work is original, has not been published elsewhere and is not under review at another venue.',
          'Every listed author has contributed substantially and has approved the final version.',
          'Data, code and materials needed to evaluate the claims are available or their absence is explained.',
          'Funding sources and competing interests are declared.',
        ],
      },
      {
        heading: 'Manuscript format',
        body: ['Submit a single PDF. A source file (Word or LaTeX) may be requested after acceptance.'],
        list: [
          'Title, full author list with affiliations and an ORCID iD for the corresponding author.',
          'An abstract of up to 250 words and three to eight keywords.',
          'Numbered sections, figures and tables with captions, and references in a consistent style.',
          'Figures must be legible at print size and have alternative text or a descriptive caption.',
        ],
      },
      {
        heading: 'Submission steps',
        list: [
          'Create an account or sign in.',
          'Choose the manuscript type and enter the title, authors and abstract.',
          'Upload the PDF and submit. You can follow its status in your account.',
        ],
      },
      {
        heading: 'Licence',
        body: ['Accepted work is published under Creative Commons Attribution 4.0 (CC BY 4.0). Authors keep copyright.'],
      },
    ],
  },
  'peer-review': {
    title: 'Peer review process',
    summary: 'How a submission moves from receipt to a decision.',
    sections: [
      {
        heading: 'Stages',
        list: [
          'Submitted: the editorial office checks scope, completeness and basic integrity.',
          'Under review: an editor invites independent reviewers with relevant expertise.',
          'Decision: accept, minor or major revision, or reject, with the reviewers’ comments.',
          'Revision: authors respond point by point; the editor may return it to reviewers.',
          'Accepted and published: the work receives a permanent identifier and is archived.',
        ],
      },
      {
        heading: 'Reviewers',
        body: [
          'Reviewers are asked to assess soundness, clarity and significance, to decline when they have a conflict of interest, and to keep the manuscript confidential.',
        ],
      },
      {
        heading: 'Confidentiality',
        body: [
          'Reviewer identities are not disclosed to authors unless a reviewer chooses to sign. Manuscripts are never shared outside the review.',
        ],
      },
      {
        heading: 'Appeals',
        body: ['Authors who believe a decision rests on a factual error may appeal to the editorial office, which will involve an editor who was not part of the original decision.'],
      },
    ],
  },
  'open-access': {
    title: 'Open access policy',
    summary: 'Everything we publish is free to read, reuse and share with attribution.',
    sections: [
      {
        heading: 'Licence',
        body: [
          'All published content is available under Creative Commons Attribution 4.0 International (CC BY 4.0). Anyone may copy, redistribute and adapt the work, including commercially, provided the original authors are credited.',
        ],
      },
      {
        heading: 'Copyright',
        body: ['Authors retain copyright and grant the right of first publication under the licence above.'],
      },
      {
        heading: 'Reading and archiving',
        body: ['No registration or fee is needed to read or download published articles. Authors may deposit their own version in any repository.'],
      },
      {
        heading: 'Fees',
        body: ['The editorial office will state any publication charges on this page before they apply. Submission and peer review are not charged.'],
      },
    ],
  },
  'publication-ethics': {
    title: 'Publication ethics',
    summary: 'The standards we hold authors, reviewers and editors to.',
    sections: [
      {
        heading: 'Authors',
        list: [
          'Report results honestly. Fabrication, falsification and image manipulation are grounds for rejection or retraction.',
          'Do not plagiarise, including your own earlier work without citation. Submissions may be screened for text overlap.',
          'Credit everyone who contributed and obtain consent of all listed authors.',
          'Obtain ethical approval and informed consent for research involving people or animals.',
        ],
      },
      {
        heading: 'Editors and reviewers',
        list: [
          'Decisions are based on scholarly merit, not the authors’ identity, nationality or institution.',
          'Conflicts of interest are declared and the person steps aside.',
          'Unpublished material is never used for personal advantage.',
        ],
      },
      {
        heading: 'Corrections and retractions',
        body: ['Errors are corrected openly with a notice linked to the original article. A serious breach leads to retraction, also with a public notice.'],
      },
      {
        heading: 'Concerns',
        body: ['Raise a concern with the editorial office using the details on the contact page. Reports are handled confidentially.'],
      },
    ],
  },
  'editorial-board': {
    title: 'Editorial board',
    summary: 'Who is responsible for the scholarly decisions of the press.',
    sections: [
      {
        heading: 'Roles',
        list: [
          'Editor-in-chief: sets scientific direction and makes final decisions.',
          'Associate editors: manage review of manuscripts in their field.',
          'Editorial office: handles submissions, production and correspondence.',
          'Reviewers: independent experts invited per manuscript.',
        ],
      },
      {
        heading: 'Members',
        body: ['The board is being appointed. Members and their affiliations will be listed here once confirmed.'],
      },
      {
        heading: 'Join us',
        body: ['Researchers who would like to review or serve as editors can write to the editorial office.'],
      },
    ],
  },
  preservation: {
    title: 'Repository preservation policy',
    summary: 'How published work stays available over the long term.',
    sections: [
      {
        heading: 'Persistent identifiers',
        body: ['Each article is assigned a stable URL and, where registered, a DOI that always resolves to the current version.'],
      },
      {
        heading: 'Backups',
        body: ['Content and files are stored on managed infrastructure with regular backups.'],
      },
      {
        heading: 'Versions',
        body: ['The published version is never silently changed. Corrections are issued as visible notices.'],
      },
      {
        heading: 'Continuity',
        body: ['If publishing ever ceases, we will make reasonable efforts to transfer content to a public archive so links keep working.'],
      },
    ],
  },
  contact: {
    title: 'Contact the editorial office',
    summary: 'Questions about a submission, a published article or the press.',
    sections: [
      {
        heading: 'What we can help with',
        list: ['Status of a submission', 'Corrections and ethics concerns', 'Reviewer and editor enquiries', 'Permissions and press'],
      },
      { heading: 'Response time', body: ['We aim to reply within five working days.'] },
    ],
  },
  'terms-privacy': {
    title: 'Terms & privacy',
    summary: 'The rules for using this site and how we handle your data.',
    sections: [
      {
        heading: 'Using the site',
        body: [
          'Published articles are licensed under CC BY 4.0. Other site content, design and software are protected unless stated. Do not misuse the service, attempt to disrupt it or access accounts that are not yours.',
        ],
      },
      {
        heading: 'Your account',
        body: ['You are responsible for keeping your password secure. You may delete your account by contacting the editorial office.'],
      },
      {
        heading: 'Data we collect',
        list: [
          'Account details: name, email address and a securely hashed password.',
          'Submissions: manuscripts and metadata you upload, visible to you and the editorial team.',
          'Technical data: standard server logs and a session cookie used to keep you signed in.',
        ],
      },
      {
        heading: 'How we use it',
        body: ['To run your account, process submissions and keep the site secure. We do not sell personal data or use it for advertising.'],
      },
      {
        heading: 'Your rights',
        body: ['You can ask to access, correct or delete your personal data. Contact the editorial office.'],
      },
      {
        heading: 'Liability',
        body: ['The site is provided as is. Published views are those of the authors.'],
      },
    ],
  },
}

const hr: Record<PolicySlug, Policy> = {
  'author-guidelines': {
    title: 'Upute za autore',
    summary: 'Što pripremiti prije slanja i kako očekujemo da rukopis bude oblikovan.',
    sections: [
      {
        heading: 'Prije slanja',
        list: [
          'Rad je izvoran, nije objavljen drugdje niti je u recenziji u drugom izdanju.',
          'Svi navedeni autori bitno su doprinijeli radu i odobrili su konačnu verziju.',
          'Podaci, kod i materijali potrebni za provjeru tvrdnji dostupni su ili je objašnjeno zašto nisu.',
          'Izvori financiranja i sukobi interesa su navedeni.',
        ],
      },
      {
        heading: 'Oblik rukopisa',
        body: ['Pošaljite jedan PDF. Izvornu datoteku (Word ili LaTeX) možemo zatražiti nakon prihvaćanja.'],
        list: [
          'Naslov, popis svih autora s ustanovama i ORCID iD dopisnog autora.',
          'Sažetak do 250 riječi i tri do osam ključnih riječi.',
          'Numerirana poglavlja, slike i tablice s opisima te dosljedan stil literature.',
          'Slike moraju biti čitljive u tisku i imati alternativni tekst ili opis.',
        ],
      },
      {
        heading: 'Koraci slanja',
        list: [
          'Izradite račun ili se prijavite.',
          'Odaberite vrstu rukopisa i unesite naslov, autore i sažetak.',
          'Učitajte PDF i pošaljite. Status pratite u svojem računu.',
        ],
      },
      {
        heading: 'Licenca',
        body: ['Prihvaćeni radovi objavljuju se pod licencom Creative Commons Imenovanje 4.0 (CC BY 4.0). Autori zadržavaju autorska prava.'],
      },
    ],
  },
  'peer-review': {
    title: 'Postupak recenzije',
    summary: 'Kako rad putuje od zaprimanja do odluke.',
    sections: [
      {
        heading: 'Faze',
        list: [
          'Poslano: uredništvo provjerava tematsku prikladnost, cjelovitost i osnovni integritet.',
          'U recenziji: urednik poziva neovisne recenzente s odgovarajućom stručnošću.',
          'Odluka: prihvaćanje, manje ili veće izmjene ili odbijanje, uz komentare recenzenata.',
          'Izmjene: autori odgovaraju točku po točku; urednik može rad vratiti recenzentima.',
          'Prihvaćeno i objavljeno: rad dobiva trajni identifikator i arhivira se.',
        ],
      },
      {
        heading: 'Recenzenti',
        body: ['Od recenzenata se traži procjena utemeljenosti, jasnoće i značaja, da odbiju recenziju ako imaju sukob interesa i da rukopis čuvaju povjerljivim.'],
      },
      {
        heading: 'Povjerljivost',
        body: ['Identitet recenzenata ne otkriva se autorima osim ako se recenzent sam ne potpiše. Rukopisi se nikada ne dijele izvan recenzije.'],
      },
      {
        heading: 'Žalbe',
        body: ['Autori koji smatraju da odluka počiva na činjeničnoj pogrešci mogu uložiti žalbu uredništvu, koje će uključiti urednika koji nije sudjelovao u izvornoj odluci.'],
      },
    ],
  },
  'open-access': {
    title: 'Politika otvorenog pristupa',
    summary: 'Sve što objavljujemo slobodno je za čitanje, ponovnu uporabu i dijeljenje uz navođenje autora.',
    sections: [
      {
        heading: 'Licenca',
        body: ['Sav objavljeni sadržaj dostupan je pod licencom Creative Commons Imenovanje 4.0 (CC BY 4.0). Svatko smije kopirati, dijeliti i prerađivati djelo, uključujući komercijalno, uz navođenje izvornih autora.'],
      },
      {
        heading: 'Autorska prava',
        body: ['Autori zadržavaju autorska prava i daju pravo prve objave pod gornjom licencom.'],
      },
      {
        heading: 'Čitanje i arhiviranje',
        body: ['Za čitanje i preuzimanje objavljenih članaka nije potrebna registracija ni naknada. Autori mogu svoju verziju pohraniti u bilo koji repozitorij.'],
      },
      {
        heading: 'Naknade',
        body: ['Uredništvo će sve naknade za objavu navesti na ovoj stranici prije nego što se primijene. Slanje i recenzija se ne naplaćuju.'],
      },
    ],
  },
  'publication-ethics': {
    title: 'Etika objavljivanja',
    summary: 'Standardi kojih se drže autori, recenzenti i urednici.',
    sections: [
      {
        heading: 'Autori',
        list: [
          'Rezultate iznosite pošteno. Izmišljanje, krivotvorenje i manipulacija slikama razlog su za odbijanje ili povlačenje.',
          'Ne plagirajte, uključujući vlastite ranije radove bez citiranja. Prijave se mogu provjeravati na preklapanje teksta.',
          'Navedite sve koji su doprinijeli i pribavite suglasnost svih autora.',
          'Pribavite etičko odobrenje i informirani pristanak za istraživanja na ljudima ili životinjama.',
        ],
      },
      {
        heading: 'Urednici i recenzenti',
        list: [
          'Odluke se temelje na znanstvenoj vrijednosti, a ne na identitetu, državljanstvu ili ustanovi autora.',
          'Sukobi interesa se prijavljuju i osoba se povlači.',
          'Neobjavljeni materijal nikada se ne koristi za osobnu korist.',
        ],
      },
      {
        heading: 'Ispravci i povlačenja',
        body: ['Pogreške se javno ispravljaju obavijesti povezanom s izvornim člankom. Ozbiljno kršenje dovodi do povlačenja, također uz javnu obavijest.'],
      },
      {
        heading: 'Prigovori',
        body: ['Prigovor uputite uredništvu putem podataka na stranici za kontakt. Prijave se obrađuju povjerljivo.'],
      },
    ],
  },
  'editorial-board': {
    title: 'Uređivački odbor',
    summary: 'Tko je odgovoran za znanstvene odluke izdavača.',
    sections: [
      {
        heading: 'Uloge',
        list: [
          'Glavni urednik: određuje znanstveni smjer i donosi konačne odluke.',
          'Urednici suradnici: vode recenziju rukopisa iz svojeg područja.',
          'Uredništvo: bavi se zaprimanjem, produkcijom i korespondencijom.',
          'Recenzenti: neovisni stručnjaci pozvani za pojedini rukopis.',
        ],
      },
      {
        heading: 'Članovi',
        body: ['Odbor je u postupku imenovanja. Članovi i njihove ustanove bit će navedeni ovdje nakon potvrde.'],
      },
      {
        heading: 'Pridružite nam se',
        body: ['Istraživači koji žele recenzirati ili biti urednici mogu pisati uredništvu.'],
      },
    ],
  },
  preservation: {
    title: 'Politika očuvanja repozitorija',
    summary: 'Kako objavljeni radovi ostaju dostupni dugoročno.',
    sections: [
      {
        heading: 'Trajni identifikatori',
        body: ['Svaki članak dobiva stabilan URL i, gdje je registriran, DOI koji uvijek vodi na aktualnu verziju.'],
      },
      {
        heading: 'Sigurnosne kopije',
        body: ['Sadržaj i datoteke pohranjeni su na upravljanoj infrastrukturi uz redovite sigurnosne kopije.'],
      },
      {
        heading: 'Verzije',
        body: ['Objavljena verzija nikada se ne mijenja neprimjetno. Ispravci se izdaju kao vidljive obavijesti.'],
      },
      {
        heading: 'Kontinuitet',
        body: ['Ako se objavljivanje ikada prekine, razumno ćemo nastojati prenijeti sadržaj u javni arhiv kako bi poveznice i dalje radile.'],
      },
    ],
  },
  contact: {
    title: 'Kontakt uredništva',
    summary: 'Pitanja o prijavi, objavljenom članku ili izdavaču.',
    sections: [
      {
        heading: 'S čime možemo pomoći',
        list: ['Status prijave', 'Ispravci i etički prigovori', 'Upiti recenzenata i urednika', 'Dopuštenja i mediji'],
      },
      { heading: 'Vrijeme odgovora', body: ['Nastojimo odgovoriti u roku od pet radnih dana.'] },
    ],
  },
  'terms-privacy': {
    title: 'Uvjeti i privatnost',
    summary: 'Pravila korištenja ove stranice i način na koji postupamo s vašim podacima.',
    sections: [
      {
        heading: 'Korištenje stranice',
        body: ['Objavljeni članci licencirani su pod CC BY 4.0. Ostali sadržaj, dizajn i softver zaštićeni su osim ako je navedeno drukčije. Ne zlorabite uslugu, ne pokušavajte je ometati niti pristupati tuđim računima.'],
      },
      {
        heading: 'Vaš račun',
        body: ['Odgovorni ste za sigurnost svoje lozinke. Račun možete obrisati kontaktiranjem uredništva.'],
      },
      {
        heading: 'Podaci koje prikupljamo',
        list: [
          'Podaci o računu: ime, adresa e-pošte i sigurno pohranjena (hashirana) lozinka.',
          'Prijave: rukopisi i metapodaci koje učitate, vidljivi vama i uredničkom timu.',
          'Tehnički podaci: standardni poslužiteljski zapisi i kolačić sesije koji vas drži prijavljenima.',
        ],
      },
      {
        heading: 'Kako ih koristimo',
        body: ['Za vođenje vašeg računa, obradu prijava i sigurnost stranice. Osobne podatke ne prodajemo niti koristimo za oglašavanje.'],
      },
      {
        heading: 'Vaša prava',
        body: ['Možete zatražiti pristup, ispravak ili brisanje svojih osobnih podataka. Obratite se uredništvu.'],
      },
      {
        heading: 'Odgovornost',
        body: ['Stranica se pruža „kakva jest”. Objavljena stajališta su stajališta autora.'],
      },
    ],
  },
}

export const policies: Record<Locale, Record<PolicySlug, Policy>> = { en, hr }

/** Footer and navigation labels for the policy pages. */
export const policyNavGroups = {
  authors: ['author-guidelines', 'peer-review', 'open-access'],
  governance: ['publication-ethics', 'editorial-board', 'preservation', 'contact', 'terms-privacy'],
} satisfies Record<string, PolicySlug[]>
