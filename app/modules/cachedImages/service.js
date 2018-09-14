/* eslint-disable */

export const getB64Image = uri => {
  return new Promise((resolve, reject) => {
    fetch(uri).then(res => res.blob()).then(blob => {
      let reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target.result)
      }
      reader.readAsDataURL(blob)
    }).catch(e => {
      resolve('network error')
    })
  })
}
