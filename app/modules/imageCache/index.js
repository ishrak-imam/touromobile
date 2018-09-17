import React, { Component } from 'react'
import { Image } from 'react-native'
import { connect } from 'react-redux'
import { getImageCache } from '../../selectors'
import { downloadImage } from './action'
import { getHash, getExtension } from '../../utils/stringHelpers'

import { IMAGE_CACHE_DIR } from './service'

class ImageCache extends Component {
  _resolveProps = () => {
    const { uri, style, imageCache } = this.props
    const imageName = `${getHash(uri)}.${getExtension(uri)}`
    const isInCache = imageCache.get('data').has(imageName)
    let imagePath = ''
    if (isInCache) {
      imagePath = `${IMAGE_CACHE_DIR}${imageName}`
    }
    return {
      uri, style, isInCache, imagePath
    }
  }

  // shouldComponentUpdate (nextProps) {
  //   const { isInCache } = this._resolveProps()
  //   return !isInCache
  // }

  componentDidMount () {
    const { uri, isInCache } = this._resolveProps()
    if (!isInCache) {
      this.props.dispatch(downloadImage({ uri }))
    }
  }

  render () {
    const { style, imagePath } = this._resolveProps()
    return (
      <Image
        source={{ uri: imagePath }}
        style={style}
      />
    )
  }
}

const stateToProps = state => ({
  imageCache: getImageCache(state)
})

export default connect(stateToProps, dispatch => ({ dispatch }))(ImageCache)
