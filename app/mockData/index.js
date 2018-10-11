
export const mockToken = () => Promise.resolve({
  'access_token': 'some_token',
  'expires_in': 315360000,
  'id': 52,
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

export const mockForgetPass = () => Promise.resolve({
  msg: 'Check your email for a new password'
})

export const mockTrips = () => Promise.resolve(require('./trip.json'))

export const mockUploadStats = () => Promise.resolve({ ok: true })
