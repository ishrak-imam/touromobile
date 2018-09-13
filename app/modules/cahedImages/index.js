import React, { Component } from 'react'
import { Image } from 'react-native'
import { connect } from 'react-redux'
import { getImageCache } from '../../selectors'
import { createB64Image } from './action'
import { getHash } from '../../utils/stringHelpers'

class CachedImage extends Component {
  _resolveProps = props => {
    const { uri, style, imageCache } = this.props
    const uriHash = getHash(uri)
    const b64uri = imageCache.get('data').get(uriHash)
    return {
      uri, style, uriHash, b64uri
    }
  }

  shouldComponentUpdate (nextProps) {
    const { b64uri } = this._resolveProps(this.props)
    return !b64uri
  }

  componentDidMount () {
    const { uri, b64uri } = this._resolveProps(this.props)
    if (!b64uri) {
      this.props.dispatch(createB64Image({ uri }))
    }
  }

  render () {
    const { style, b64uri } = this._resolveProps(this.props)
    return (
      <Image
        source={{ uri: b64uri }}
        style={style}
      />
    )
  }
}

const stateToProps = state => ({
  imageCache: getImageCache(state)
})

export default connect(stateToProps, dispatch => ({ dispatch }))(CachedImage)
