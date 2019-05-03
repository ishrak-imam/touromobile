
// class Cache {
//   constructor (resolver) {
//     this.resolver = resolver
//     this.prev = null
//     this.computed = null
//   }

//   _shouldHitCache = value => {
//     return value.equals(this.prev) && !!this.computed
//   }

//   getData = value => {
//     if (this._shouldHitCache(value)) {
//       return this.computed
//     }
//     this.prev = value
//     this.computed = this.resolver(value)
//     return this.computed
//   }
// }

// export default Cache

const Cache = resolver => {
  let prevExtraVal = null
  let prev = null
  let computed = null

  const isSameExtraValue = extra => {
    return prevExtraVal === extra
  }

  const _shouldHitCache = (value, extra) => {
    return isSameExtraValue(extra) && (value.equals(prev) && !!computed)
  }

  return (value, extra = null) => {
    if (_shouldHitCache(value, extra)) {
      return computed
    }

    prevExtraVal = extra
    prev = value
    computed = resolver(value, extra)
    return computed
  }
}

export default Cache
