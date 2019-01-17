
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
  let prev = null
  let computed = null

  const _shouldHitCache = value => {
    return value.equals(prev) && !!computed
  }

  return value => {
    if (_shouldHitCache(value)) {
      return computed
    }

    prev = value
    computed = resolver(value)
    return computed
  }
}

export default Cache
