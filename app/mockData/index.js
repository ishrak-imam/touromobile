
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

export const mockUser = () => new Promise(resolve => {
  setTimeout(() => {
    return resolve({
      'id': 52,
      'email': 'ishrak@cefalo.com',
      'lastName': 'Ibne Imam',
      'firstName': 'Ishrak',
      'hash': '',
      'salt': '',
      'activeDirectoryName': null,
      'phone': '',
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

export const mockUserDetails = () => new Promise(resolve => {
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
      {
        departure: 47777,
        out: {
          location: 'OT',
          transfer: 'D',
          transferCity: '201',
          accommodation: 'SR',
          hotel: 'Out hotel',
          bag: 'OT'
        },
        home: {
          location: 'OT',
          transfer: 'D',
          transferCity: '201',
          accommodation: 'SR',
          hotel: 'Home hotel',
          bag: 'OT'
        }
      }
    ])
  }, 2000)
})
