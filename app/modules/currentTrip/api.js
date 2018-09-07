
export const getCurrentTrip = () => {
  return Promise.resolve({
    ok: true,
    data: require('../../data/currentTrip.json')
  })
}
