
class Cache {
  constructor (resolver) {
    this.resolver = resolver
    this.prev = null
    this.computed = null
  }

  _shouldHitCache = value => {
    return value.equals(this.prev) && !!this.computed
  }

  getData = value => {
    if (this._shouldHitCache(value)) {
      console.log('cache hit')
      return this.computed
    }
    this.prev = value
    this.computed = this.resolver(value)
    return this.computed
  }
}

export default Cache
