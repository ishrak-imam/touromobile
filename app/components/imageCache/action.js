
import { createAction } from '../../utils/reduxHelpers'

export const DOWNLOAD_IMAGE = 'DOWNLOAD_IMAGE'
export const DOWNLOAD_IMAGE_SUCS = 'DOWNLOAD_IMAGE_SUCS'
export const DOWNLOAD_IMAGE_FAIL = 'DOWNLOAD_IMAGE_FAIL'

export const CREATE_CACHE_DIR = 'CREATE_CACHE_DIR'

export const CLEAR_IMAGE_CACHE = 'CLEAR_IMAGE_CACHE'

export const downloadImage = createAction(DOWNLOAD_IMAGE)
export const downloadImageSucs = createAction(DOWNLOAD_IMAGE_SUCS)
export const downloadImageFail = createAction(DOWNLOAD_IMAGE_FAIL)

export const createCacheDir = createAction(CREATE_CACHE_DIR)

export const clearImageCache = createAction(CLEAR_IMAGE_CACHE)
