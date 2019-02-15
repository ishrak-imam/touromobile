import React, { Component } from 'react'
import { Image } from 'react-native'
import { connect } from 'react-redux'
import { getImageCache } from '../../selectors'
import { downloadImage } from './action'
import { Images } from '../../theme'
import {
  // getHash, getExtension
  getImageName
} from '../../utils/stringHelpers'

import { IMAGE_CACHE_DIR } from './service'

class ImageCache extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gotImageOnce: false
    }
  }

  _resolveProps = props => {
    const { uri, style, imageCache, transportType } = props
    // const imageName = `${getHash(uri)}.${getExtension(uri)}`
    const imageName = getImageName(uri)
    const image = imageCache.get(imageName)
    let isLoading = true
    let isInCache = false
    let sucs = 'PENDING'
    let imagePath = ''
    if (image) {
      isLoading = image.get('loading')
      isInCache = true
      sucs = image.get('sucs')
      if (sucs) imagePath = `${IMAGE_CACHE_DIR}${imageName}`
    }

    return {
      transportType, uri, style, isLoading, isInCache, sucs, imagePath, imageName
    }
  }

  shouldComponentUpdate (nextProps) {
    const { isInCache } = this._resolveProps(nextProps)
    const { gotImageOnce } = this.state
    return (isInCache && !gotImageOnce)
  }

  componentDidMount () {
    const { uri, imageName, isInCache, sucs } = this._resolveProps(this.props)
    if (!isInCache || !sucs) {
      this.props.dispatch(downloadImage({ uri, imageName }))
    }
  }

  render () {
    const { style, isLoading, imagePath, transportType } = this._resolveProps(this.props)
    this.state.gotImageOnce = !!imagePath || !isLoading
    const image = isLoading ? Images.loading : imagePath ? { uri: imagePath } : Images[transportType]
    return (
      <Image source={image} style={style} resizeMode='cover' />
    )
  }
}

const stateToProps = state => ({
  imageCache: getImageCache(state)
})

export default connect(stateToProps, dispatch => ({ dispatch }))(ImageCache)
