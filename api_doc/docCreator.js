
export const createDoc = (method, url, payload, type) => {
  const json = JSON.stringify({
    type,
    method,
    url,
    payload
  })

  console.log(json)
}
