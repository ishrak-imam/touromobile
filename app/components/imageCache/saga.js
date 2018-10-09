
import { call, put, takeEvery } from 'redux-saga/effects'
import { takeFirst } from '../../utils/sagaHelpers'
import {
  downloadImage,
  downloadImageSucs,
  clearImageCache,
  createCacheDir
} from './action'
import {
  downloadFile, clearCache, checkIfExistsDir,
  checkIfExistsImage, createDirectory
} from './service'
import {
  // getHash, getExtension,
  getImageName
} from '../../utils/stringHelpers'

export function * watchDownloadImage () {
  yield takeEvery(downloadImage.getType(), workerDownloadImage)
}

function * workerDownloadImage (action) {
  try {
    const { uri } = action.payload
    // const imageName = `${getHash(uri)}.${getExtension(uri)}`
    const imageName = getImageName(uri)
    const { exists } = yield call(checkIfExistsImage, imageName)
    if (!exists) {
      yield call(downloadFile, uri, imageName)
    }
    yield put(downloadImageSucs({ imageName }))
  } catch (e) {
    console.log('DOWNLOAD_IMAGE_ERROR ::: ', e)
  }
}

export function * watchCreateCacheDir () {
  yield takeFirst(createCacheDir.getType(), workerCreateCacheDir)
}

function * workerCreateCacheDir () {
  try {
    const { exists } = yield call(checkIfExistsDir)
    if (!exists) {
      yield call(createDirectory)
    }
  } catch (e) {
    console.log('CREATE_CACHE_DIR_ERROR ::: ', e)
  }
}

export function * watchClearCache () {
  yield takeFirst(clearImageCache.getType(), workerClearImageCache)
}

function * workerClearImageCache () {
  try {
    yield call(clearCache)
  } catch (e) {
    console.log('CLEAR_CACHE_ERROR :::', e)
  }
}
