import React, { Component } from 'react'
import { Image, View } from 'react-native'
import { connect } from 'react-redux'
import { getImageCache } from '../../selectors'
import { downloadImage } from './action'
import { getHash, getExtension } from '../../utils/stringHelpers'

import { IMAGE_CACHE_DIR } from './service'

class ImageCache extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gotImageOnce: false
    }
  }

  _resolveProps = props => {
    const { uri, style, imageCache } = props
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

  shouldComponentUpdate (nextProps) {
    const { isInCache } = this._resolveProps(nextProps)
    const { gotImageOnce } = this.state
    return (isInCache && !gotImageOnce)
  }

  componentDidMount () {
    const { uri, isInCache } = this._resolveProps(this.props)
    if (!isInCache) {
      this.props.dispatch(downloadImage({ uri }))
    }
  }

  render () {
    const { style, imagePath } = this._resolveProps(this.props)
    this.state.gotImageOnce = !!imagePath
    return imagePath
      ? <Image source={{ uri: imagePath }} style={style} />
      : <View style={style} />
  }
}

const stateToProps = state => ({
  imageCache: getImageCache(state)
})

export default connect(stateToProps, dispatch => ({ dispatch }))(ImageCache)
