
export const mockToken = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({
      'access_token': 'some_token',
      'expires_in': 315360000,
      'id': 52,
      'guide_id': 14,
      'group': 'Users',
      'full_name': 'Ishrak Ibne Imam',
      'first_name': 'Ishrak',
      'last_name': 'Ibne Imam',
      'image': ''
    })
  }, 2000)
})

export const mockUserDetails = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({
      'id': 52,
      'email': 'ishrak@cefalo.com',
      'lastName': 'Ibne Imam',
      'firstName': 'Ishrak',
      'hash': '',
      'salt': '',
      'activeDirectoryName': null,
      'phone': '123456',
      'groups': [
        {
          'id': 1,
          'name': 'Users',
          'resourceName': 'group'
        },
        {
          'id': 2,
          'name': 'Administrators',
          'resourceName': 'group'
        }
      ],
      'resourceName': 'user'
    })
  }, 2000)
})

export const mockGuideDetails = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({
      'id': 52,
      'externalId': null,
      'signature': 'ishrak',
      'status': 0,
      'ssn': '730318-7608',
      'firstName': 'Ishrak Ibne',
      'lastName': 'Imam',
      'address': 'Östra Vramsvägen 22',
      'zip': '291 32',
      'city': 'TOLLARP',
      'country': '',
      'account': '0969',
      'email': 'ishrak@email.com',
      'phone': '+88012121',
      'emailAddresses': [],
      'phones': [],
      'guideCourse': '0001-01-01T00:00:00',
      'comment': null,
      'departures': null,
      'commissionType': 1,
      'createdBy': 'lwt',
      'created': '2007-06-27T11:18:56.4',
      'modifiedBy': 'ikr',
      'modified': '2010-03-01T13:41:07.65'
    })
  }, 2000)
})

export const mockForgetPass = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({
      msg: 'Check your email for a new password'
    })
  }, 2000)
})

export const mockTrips = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve(require('./trips.json'))
  }, 2000)
})

export const mockUploadStats = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({ ok: true })
  }, 2000)
})

export const mockUpdateProfile = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({ ok: true })
  }, 2000)
})

export const mockAcceptAssignment = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({ ok: true })
  }, 2000)
})

export const mockConfirmReservations = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({ ok: true })
  }, 2000)
})

export const mockConnections = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve(require('./connections.json'))
  }, 2000)
})

export const mockSyncData = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({ ok: true })
  }, 2000)
})

export const mockDownloadAppData = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({
      lastSyncedTime: new Date().getTime(),
      data: {}
    })
  }, 2000)
})

export const mockSendSms = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({ ok: true })
  }, 2000)
})

export const mockSSNData = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({
      FirstName: 'Ishrak',
      LastName: 'Ibne Imam',
      Address: '83/1 East Rajabazar, Farmgate',
      Zip: '1209',
      City: 'Dhaka',
      Email: 'ishrak@cefalo.com'
    })
  }, 2000)
})

export const mockReservationData = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve([
    ])
  }, 2000)
})

export const mockSendAppStatus = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve([
    ])
  }, 2000)
})

export const mockConnectionLines = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({
      'connectionLines': [
        {
          'name': '160',
          'type': 'bus',
          'overnight': false,
          'locations': [
            {
              'name': 'Narvik',
              'eta': '2019-06-21 09:30',
              'passengers': [
                {
                  'id': 740999,
                  'bookingId': 912391,
                  'firstName': 'Vidkun',
                  'lastName': 'Quisling',
                  'hotel': 1
                }
              ],
              'connectTo': []
            }
          ]
        },
        {
          'name': '445',
          'type': 'bus',
          'overnight': true,
          'locations': [
            {
              'name': 'Göteborg',
              'eta': '2019-06-20 23:30',
              'passengers': [
                {
                  'id': 741000,
                  'bookingId': 912391,
                  'firstName': 'Glenn',
                  'lastName': 'Strömberg',
                  'hotel': 2
                }
              ],
              'connectTo': [
                '442'
              ]
            }
          ]
        },
        {
          'name': '442',
          'type': 'train',
          'overnight': true,
          'locations': [
            {
              'name': 'Oslo',
              'eta': '2019-06-21 07:00',
              'passengers': [
                {
                  'id': 741210,
                  'bookingId': 912391,
                  'firstName': 'Ole',
                  'lastName': 'Haugen',
                  'hotel': 3
                }
              ],
              'connectTo': ['160']
            },
            {
              'name': 'Trondheim',
              'eta': '2019-06-21 08:15',
              'passengers': [
                {
                  'id': 741211,
                  'bookingId': 912391,
                  'firstName': 'Thor',
                  'lastName': 'Heyerdal',
                  'hotel': 1
                }
              ],
              'connectTo': []
            }
          ]
        },
        {
          'name': '242',
          'type': 'taxi',
          'overnight': false,
          'locations': [
            {
              'name': 'Gislaved',
              'eta': '2019-06-21 02:45',
              'passengers': [
                {
                  'id': 741726,
                  'bookingId': 912391,
                  'firstName': 'Anne',
                  'lastName': 'Smith',
                  'hotel': 2
                }
              ],
              'connectTo': []
            },
            {
              'name': 'Gurmahurma',
              'eta': '2019-06-21 03:15',
              'passengers': [
                {
                  'id': 741727,
                  'bookingId': 912391,
                  'firstName': 'Henrik',
                  'lastName': 'Gasslander',
                  'hotel': 3
                }
              ],
              'connectTo': []
            }
          ]
        },
        {
          'name': '140',
          'type': 'bus',
          'overnight': false,
          'locations': [
            {
              'name': 'Landskrona',
              'eta': '2019-06-20 20:45',
              'passengers': [
                {
                  'id': 741728,
                  'bookingId': 912391,
                  'firstName': 'Anders',
                  'lastName': 'Eriksson',
                  'hotel': 1
                }
              ],
              'connectTo': []
            },
            {
              'name': 'Helsingborg',
              'eta': '2019-06-20 21:45',
              'passengers': [
                {
                  'id': 741729,
                  'bookingId': 912391,
                  'firstName': 'Lena',
                  'lastName': 'Eriksson',
                  'hotel': 2
                }
              ],
              'connectTo': []
            },
            {
              'name': 'Markaryd',
              'eta': '2019-06-20 22:45',
              'passengers': [
                {
                  'id': 741955,
                  'bookingId': 912391,
                  'firstName': 'Kurt',
                  'lastName': 'Eriksson',
                  'hotel': 3
                }
              ],
              'connectTo': []
            },
            {
              'name': 'Ljungby',
              'eta': '2019-06-20 23:45',
              'passengers': [
                {
                  'id': 741956,
                  'bookingId': 912391,
                  'firstName': 'Lotta',
                  'lastName': 'Eriksson',
                  'hotel': 1
                }
              ],
              'connectTo': []
            },
            {
              'name': 'Värnamo',
              'eta': '2019-06-21 00:45',
              'passengers': [
                {
                  'id': 744993,
                  'bookingId': 912391,
                  'firstName': 'John',
                  'lastName': 'Doe',
                  'hotel': 2
                }
              ],
              'connectTo': [
                '242'
              ]
            },
            {
              'name': 'Jönköping',
              'eta': '2019-06-21 01:45',
              'passengers': [
                {
                  'id': 744994,
                  'bookingId': 912391,
                  'firstName': 'Last',
                  'lastName': 'Person',
                  'hotel': 3
                }
              ],
              'connectTo': []
            }
          ]
        }
      ],
      'overnightHotels': [
        {
          'id': 1,
          'name': 'Malmö Quality Arena'
        },
        {
          'id': 2,
          'name': 'Malmö Quality View'
        },
        {
          'id': 3,
          'name': 'Scandic Segevång'
        }
      ]
    })
  })
})
