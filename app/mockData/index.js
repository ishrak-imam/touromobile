
export const mockToken = () => Promise.resolve({
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

export const mockUser = () => Promise.resolve({
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

export const mockUserDetails = () => Promise.resolve({
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

export const mockForgetPass = () => Promise.resolve({
  msg: 'Check your email for a new password'
})

export const mockTrips = () => Promise.resolve(require('./trips.json'))

export const mockUploadStats = () => Promise.resolve({ ok: true })

export const mockUpdateProfile = () => Promise.resolve({ ok: true })

export const mockAcceptFutureTrip = () => Promise.resolve({ ok: true })
