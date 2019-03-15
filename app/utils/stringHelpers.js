
export const getHash = string => {
  for (var i = 0, h = 0; i < string.length; i++) { h = Math.imul(31, h) + string.charCodeAt(i) | 0 }
  return String(h)
}

export const getExtension = fileUri => {
  const re = /(?:\.([^.]+))?$/
  return re.exec(fileUri)[0]
}

export const checkEmail = email => {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const getImageName = url => {
  // const split = url.split('/')
  // return `${split[split.length - 2]}.jpg`
  const hash = getHash(url)
  return `${hash}.jpg`
}

export const stringShorten = (str, limit) => {
  return `${str.substring(0, limit)} ...`
}

export const tripNameFormatter = (str, limit) => {
  const splitted = str.split(' ')
  let title = ''
  let subtitle = ''
  let count = 0

  for (let i = 0; i < splitted.length; i++) {
    const temp = `${title}${splitted[i]} `
    if (temp.length > limit) break
    count = i
    title = temp
  }

  for (let i = count + 1; i < splitted.length; i++) {
    subtitle = `${subtitle}${splitted[i]} `
  }

  return {
    title: title.replace('/', ''),
    subtitle: subtitle
  }
}

export const checkSSN = ssn => {
  const re = /^(19|20)?(\d{6}(-|\s)\d{4}|(?!19|20)\d{10})$/
  return re.test(String(ssn))
}
