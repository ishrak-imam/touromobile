
export default {
  LoginScreen: {
    username: 'Username',
    password: 'Password',
    login: 'Log in',
    forgotPass: 'I forgot my password',
    loginFail: 'Invalid username and password',
    passResetSucs: 'Check your email for a new password',
    passResetFail: 'Password reset failed'
  },
  DrawerScreen: {
    logout: 'Log out',
    currentTrip: 'Current trip',
    futureTrips: 'Future trips',
    pastTrips: 'Past trips',
    pendingSms: 'Pending SMS'
  },
  CurrentTripScreen: {
    title: 'Current trip',
    currentTrips: 'Current Trips',
    pendingStats: 'pending statistics upload',
    pax: 'Passengers',
    departureTime: 'Departure time',
    bus: 'Bus',
    platform: 'Platform',
    drivers: 'Drivers',
    lunchRestaurants: 'Lunch restaurants',
    textAllPax: 'Text message all passengers',
    home: 'Home',
    out: 'Out',
    hotels: 'Hotels',
    rollCall: 'Roll call',
    myOrders: 'My Orders',
    show: 'Show'
  },
  PassengersScreen: {
    paxTitle: 'Passengers',
    bookingTitle: 'Bookings',
    search: 'Search',
    noMatch: 'No match found.'
  },
  ExcursionsScreen: {
    title: 'Excursions',
    textAllParticipants: 'Text message all participants',
    noExcursions: 'No excursions found for this trip.'
  },
  FutureTripsScreen: {
    title: 'Future trips',
    acceptSucs: 'Assignment accepted successfully',
    acceptFail: 'Assignment accept failed',
    acceptedAt: 'Assignment accepted at',
    accept: 'Accept assignment',
    boardingLoc: 'Boarding location',
    alightingLoc: 'Alighting location',
    transfer: 'Transfer',
    transferCity: 'Transfer city',
    accommodation: 'Accommodation',
    bagPick: 'Bag pickup',
    bagDrop: 'Bag dropoff',
    noFutureTrips: 'No more future trips.',
    tripDisabled: 'Saving is disabled! It\'s less than 10 days to departure. Please contact the office if you need to maje any changes.'
  },
  OutHomeTab: {
    home: 'Home',
    out: 'Out'
  },
  PastTripsScreen: {
    title: 'Past trips',
    uploadReport: 'Upload report',
    participantShare: 'Participant share',
    uploadedAt: 'Report uploaded at',
    noPastTrips: 'No more past trips.'
  },
  ReportsScreen: {
    title: 'Reports',
    statsSucs: 'Reports uploaded successfully',
    statsFail: 'Reports upload failed',
    totalPax: 'Total passengers',
    excursion: 'Excursion',
    excursions: 'Excursions',
    orders: 'Orders',
    orderSummary: 'Order summary',
    meals: 'Meals',
    adult: 'Adult',
    child: 'Child',
    total: 'Total',
    beverages: 'Beverages',
    participants: 'Participants',
    sale: 'Sale',
    share: 'Share',
    totals: 'Totals',
    upload: 'Upload',
    noExcursions: 'No excursions found for this trip.'
  },
  RestaurantScreen: {
    address: 'Address',
    routeDirections: 'Route Directions',
    bookedTime: 'Booked time',
    meals: 'Meals',
    meal: 'Meal',
    adult: 'Adult',
    adults: 'Adults',
    child: 'Child',
    children: 'Children',
    orders: 'Orders',
    amount: 'Amount',
    beverages: 'Beverages',
    noMealData: 'No meals found.'
  },
  PaxDetailsScreen: {
    phone: 'Phone',
    booking: 'Booking',
    excursionPack: 'Excursion pack',
    travelsWith: 'Travels with',
    comment: 'Comment',
    adult: 'Adult'
  },
  ExcursionDetailsScreen: {
    search: 'Search',
    participating: 'Participating',
    all: 'All'
  },
  ProfileScreen: {
    details: 'Details',
    firstName: 'First name',
    lastName: 'Last name',
    address: 'Address',
    city: 'City',
    zip: 'Zip',
    phone: 'Phone',
    email: 'Email',
    backAccount: 'Bank account',
    tabLabels: 'Tab labels',
    showHideTabLabels: 'Show/hide tab labels',
    lunchOrderMode: 'Lunch order mode',
    modeText: 'Once at least one order is placed, mode switching will be disabled.',
    individualMode: 'Individual mode. Place order for each passengers individually.',
    summaryMode: 'Summary mode. Place order for all passengers in a booking.',
    dataSyncSucs: 'Data sync successful.',
    dataSyncFail: 'Data sync failed.',
    appData: 'App data',
    dataSyncText: 'The app periodically synchronizes local data like meal and excursion orders to Touro, If your phone is lost or you for any reason need to continue your work on another phone, you can do so without losing any saved data.',
    syncNow: 'Synchronize now'
  },
  RollCallScreen: {
    title: 'Roll call',
    search: 'Search',
    resetWarning: 'Are you sure you want to clear the reference list?'
  },
  OrdersScreen: {
    title: 'Orders',
    lunchOrders: 'Lunch orders',
    excursionOrders: 'Excursion orders',
    extraOrders: 'Extra orders',
    meals: 'Meals',
    child: 'Child',
    beverages: 'Beverages',
    invoicee: 'Invoicee',
    selectInvoicee: 'Select invoicee',
    invoiceeSelection: 'Invoicee selection',
    noMealData: 'No meals found.',
    noExcursions: 'No excursions found for this trip.',
    ssnHeader: 'Get address details from the passenger',
    ssn: 'SSN',
    address: 'Address',
    city: 'City',
    zip: 'zip',
    sucsMsg: 'Information saved successfully'
  },
  NoData: {
    fetchingData: 'Fetching data from Touro ...',
    fetchingDataSucs: 'Fetching data completed.',
    noCurrentTrip: 'No current trip.',
    flightTripNoOrder: 'Flight trip doesn\'t have meal orders.',
    noBeverageData: 'No beverages found.',
    noOptionsFound: 'No options found.'
  },
  FooterButtons: {
    cancel: 'Cancel',
    save: 'Save'
  },
  ContextMenu: {
    sortOrder: 'Sort order',
    name: 'Name',
    firstName: 'First name',
    lastName: 'Last name',
    hotel: 'Hotel',
    airport: 'Airport',
    booking: 'Booking'
  },
  WithoutOrder: {
    paxWithoutOrder: 'Passengers without order',
    bookingsWithoutOrder: 'Bookings without order',
    paxInThisHotel: 'Passengers in this hotel',
    clickToExpand: 'Click the header to show the full list of passengers',
    booking: 'Booking'
  },
  NoTripsScreen: {
    title: 'No Trips',
    text: 'You have no current, past, or future trips. Please contact Pier or IT if you believe this is wrong.'
  },
  SMSScreen: {
    title: 'SMS',
    subject: 'Subject',
    message: 'Message',
    enterText: 'Enter text...',
    enterSub: 'Enter subject...',
    send: 'Send',
    sucsMsg: 'Sending message successful.',
    failMsg: 'Sending message failed.',
    header: 'Internet connection is not available.',
    body: 'The group SMS could not be sent. The SMS message is stored under "Pending SMS". When the internet connection is back you can go to the "Pending SMS" view and send any stored message.'
  },
  PendingSmsScreen: {
    title: 'Pending SMS',
    sucsMsg: 'Sending message successful.',
    failMsg: 'Sending message failed.',
    send: 'Send',
    subject: 'Subject',
    message: 'Message',
    enterText: 'Enter text...',
    enterSub: 'Enter subject...',
    warning: 'Are you sure you want to delete the SMS?',
    noMoreSms: 'No more SMS',
    createdAt: 'Created at'
  }
}
