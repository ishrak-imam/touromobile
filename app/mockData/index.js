
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
          'locations': [
            {
              'name': 'Narvik',
              'eta': '2019-06-21 09:30',
              'passengers': [
                {
                  'id': 923132,
                  'firstName': 'Vidkun',
                  'lastName': 'Quisling',
                  'overnight': false,
                  'hotel': null
                }
              ],
              'connectTo': []
            }
          ]
        },
        {
          'name': '445',
          'type': 'bus',
          'locations': [
            {
              'name': 'Göteborg',
              'eta': '2019-06-20 23:30',
              'passengers': [
                {
                  'id': 823132,
                  'firstName': 'Glenn',
                  'lastName': 'Strömberg',
                  'overnight': false,
                  'hotel': null
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
          'locations': [
            {
              'name': 'Oslo',
              'eta': '2019-06-21 07:00',
              'passengers': [
                {
                  'id': 723132,
                  'firstName': 'Ole',
                  'lastName': 'Haugen',
                  'overnight': false,
                  'hotel': null
                }
              ],
              'connectTo': []
            },
            {
              'name': 'Trondheim',
              'eta': '2019-06-21 08:15',
              'passengers': [
                {
                  'id': 723166,
                  'firstName': 'Thor',
                  'lastName': 'Heyerdal',
                  'overnight': false,
                  'hotel': null
                }
              ],
              'connectTo': [
                '160'
              ]
            }
          ]
        },
        {
          'name': '242',
          'type': 'taxi',
          'locations': [
            {
              'name': 'Gislaved',
              'eta': '2019-06-21 02:45',
              'passengers': [
                {
                  'id': 523132,
                  'firstName': 'Anne',
                  'lastName': 'Smith',
                  'overnight': false,
                  'hotel': null
                }
              ],
              'connectTo': []
            },
            {
              'name': 'Gurmahurma',
              'eta': '2019-06-21 03:15',
              'passengers': [
                {
                  'id': 523166,
                  'firstName': 'Henrik',
                  'lastName': 'Gasslander',
                  'overnight': false,
                  'hotel': null
                }
              ],
              'connectTo': []
            }
          ]
        },
        {
          'name': '140',
          'type': 'bus',
          'locations': [
            {
              'name': 'Landskrona',
              'eta': '2019-06-20 20:45',
              'passengers': [
                {
                  'id': 123132,
                  'firstName': 'Anders',
                  'lastName': 'Eriksson',
                  'overnight': false,
                  'hotel': null
                }
              ],
              'connectTo': []
            },
            {
              'name': 'Helsingborg',
              'eta': '2019-06-20 21:45',
              'passengers': [
                {
                  'id': 123133,
                  'firstName': 'Lena',
                  'lastName': 'Eriksson',
                  'overnight': false,
                  'hotel': null
                }
              ],
              'connectTo': []
            },
            {
              'name': 'Markaryd',
              'eta': '2019-06-20 22:45',
              'passengers': [
                {
                  'id': 123134,
                  'firstName': 'Kurt',
                  'lastName': 'Eriksson',
                  'overnight': false,
                  'hotel': null
                }
              ],
              'connectTo': []
            },
            {
              'name': 'Ljungby',
              'eta': '2019-06-20 23:45',
              'passengers': [
                {
                  'id': 123135,
                  'firstName': 'Lotta',
                  'lastName': 'Eriksson',
                  'overnight': false,
                  'hotel': null
                }
              ],
              'connectTo': []
            },
            {
              'name': 'Värnamo',
              'eta': '2019-06-21 00:45',
              'passengers': [
                {
                  'id': 123142,
                  'firstName': 'John',
                  'lastName': 'Doe',
                  'overnight': false,
                  'hotel': null
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
                  'id': 123332,
                  'firstName': 'Last',
                  'lastName': 'Person',
                  'overnight': false,
                  'hotel': null
                }
              ],
              'connectTo': []
            }
          ]
        }
      ]
    })
  })
})
