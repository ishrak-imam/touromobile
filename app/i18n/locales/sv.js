
export default {
  LoginScreen: {
    username: 'Användare',
    password: 'Lösenord',
    login: 'Logga in',
    forgotPass: 'Jag har glömt mitt lösenord',
    loginFail: 'Ogiltigt användarnamn eller lösenord',
    passResetSucs: 'Kontrollera din email för ett nytt lösenord',
    passResetFail: 'Lösenordsåterställning misslyckades'
  },
  DrawerScreen: {
    logout: 'Logga ut',
    currentTrip: 'Pågående resa',
    futureTrips: 'Framtida resor',
    pastTrips: 'Tidigare resor'
  },
  CurrentTripScreen: {
    title: 'Pågående resa',
    pendingStats: 'väntar på statistikuppladdning',
    pax: 'Passagerare',
    departureTime: 'Avgångstid',
    bus: 'Buss',
    platform: 'Plattform',
    drivers: 'Chaufförer',
    lunchRestaurants: 'Lunchrestauranger',
    textAllPax: 'SMS till alla passagerare',
    home: 'Hem',
    out: 'Ut',
    hotels: 'Hotell',
    rollCall: 'Upprop'
  },
  PassengersScreen: {
    paxTitle: 'Passagerare',
    bookingTitle: 'Bokningar',
    paxSearch: 'Sök passagerare',
    bookingSearch: 'Sök bokningar'
  },
  ExcursionsScreen: {
    title: 'Utflykter',
    textAllParticipants: 'SMS till alla deltagare'
  },
  FutureTripsScreen: {
    title: 'Framtida resor',
    acceptSucs: 'Accepterande av uppdrag lyckades',
    acceptFail: 'Accepterande av uppdrag misslyckades',
    acceptedAt: 'Uppdrag accepterat',
    accept: 'Acceptera uppdrag',
    boardingLoc: 'Påstigningsort',
    alightingLoc: 'Avstigningsort',
    transfer: 'Anslutning',
    transferCity: 'Anslutningsort',
    accommodation: 'Övernattning',
    bagPick: 'Väskhämtning',
    bagDrop: 'Väskavlämning',
    noFutureTrips: 'Inga fler framtida resor.',
    tripDisabled: 'Ändringar är låsta eftersom det är mindre än 10 dagar till avgång. Vänligen kontakta kontoret om du måste göra någon ändring.'
  },
  OutHomeTab: {
    home: 'Hem',
    out: 'Ut'
  },
  PastTripsScreen: {
    title: 'Tidigare resor',
    uploadReport: 'Ladda upp rapport',
    participantShare: 'Deltagarandel',
    uploadedAt: 'Rapport uppladdad',
    noPastTrips: 'Inga fler tidigare resor.'
  },
  ReportsScreen: {
    title: 'Rapporter',
    statsSucs: 'Rapportuppladdning klar',
    statsFail: 'Rapportuppladdning misslyckades',
    totalPax: 'Total passagerare',
    excursion: 'Utflykt',
    excursions: 'Utflykter',
    orders: 'Beställningar',
    orderSummary: 'Ordersammanfattning',
    meals: 'Måltider',
    adult: 'Vuxen',
    child: 'Barn',
    total: 'Total',
    beverages: 'Drycker',
    booking: 'Bokning',
    participants: 'Deltagare',
    sale: 'Försäljning',
    share: 'Andel',
    totals: 'Total',
    upload: 'Ladda upp'
  },
  RestaurantScreen: {
    address: 'Adress',
    routeDirections: 'Vägbeskrivning',
    bookedTime: 'Bokad tid',
    meals: 'Måltider',
    meal: 'Måltid',
    adult: 'Vuxen',
    adults: 'Vuxna',
    child: 'Barn',
    children: 'Barn',
    orders: 'Beställningar',
    amount: 'Antal',
    beverages: 'Drycker'
  },
  PaxDetailsScreen: {
    phone: 'Telefon',
    booking: 'Bokning',
    excursionPack: 'Utflyktspaket',
    travelsWith: 'Åker med',
    comment: 'Kommentar',
    adult: 'Vuxen'
  },
  ExcursionDetailsScreen: {
    paxSearch: 'Sök passagerare',
    participating: 'Deltagare',
    all: 'Alla'
  },
  ProfileScreen: {
    details: 'Detaljer',
    firstName: 'Förnamn',
    lastName: 'Efternamn',
    address: 'Adress',
    city: 'Stad',
    zip: 'Postnummer',
    phone: 'Telefon',
    email: 'E-post',
    backAccount: 'Bankkonto',
    tabLabels: 'Fliketiketter',
    showHideTabLabels: 'Visa/dölja fliketiketter',
    lunchOrderMode: 'Lunchbeställningar',
    modeText: 'När minst en beställning har gorts, kan inställningen inte ändras för den pågående resan.',
    individualMode: 'Passagerare. Beställningar skapas för varje passagerare.',
    summaryMode: 'Bokning. Beställningar är gemensamma för alla passagerare på samma bokning.'
  },
  RollCallScreen: {
    title: 'Upprop',
    paxSearch: 'Sök passagerare'
  },
  OrdersScreen: {
    title: 'Order',
    header: 'Lunch order',
    meals: 'Måltider',
    child: 'Barn',
    beverages: 'Drycker',
    invoicee: 'Fakturamottagare',
    selectInvoicee: 'Välj fakturamottagare',
    invoiceeSelection: 'Fakturaval'
  },
  NoData: {
    noMatch: 'Ingen matchning hittad.',
    fetchingData: 'Hämtar data från Touro ...',
    fetchingDataSucs: 'Hämtning av data slutförd.',
    noCurrentTrip: 'Ingen pågående resa.',
    noExcursions: 'Inga utflykter hittades för den här resan.',
    flightTripNoOrder: 'Flygresor har inga måltidsbeställningar.',
    noMealData: 'Inga måltider hittades.',
    noBeverageData: 'Inga drycker hittades.',
    noOptionsFound: 'Inga alternativ hittades.'
  },
  FooterButtons: {
    cancel: 'Avbryt',
    save: 'Spara'
  },
  ContextMenu: {
    sortOrder: 'Sorteringsordning',
    name: 'Namn',
    firstName: 'Förnamn',
    lastName: 'Efternamn',
    hotel: 'Hotel',
    airport: 'Flygplats',
    booking: 'Bokning'
  },
  WithoutOrder: {
    paxWithoutOrder: 'Passagerare utan order',
    bookingsWithoutOrder: 'Bokningar utan order',
    paxInThisHotel: 'Passagerare på detta hotell',
    clickToExpand: 'Klicka på rubriken för att visa alla passagerare',
    booking: 'Bokning'
  },
  NoTripsScreen: {
    title: 'Inga resor',
    text: 'Du har ingen pågående, genomförd, eller framtida resa. Vänligen kontakta Pier eller IT om du tror att detta är fel.'
  }
}
