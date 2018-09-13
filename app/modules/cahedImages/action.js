
import { createAction } from '../../utils/reduxHelpers'
export const CREATE_B64_IMAGE = 'CREATE_B64_IMAGE'
export const CREATE_B64_IMAGE_SUCS = 'CREATE_B64_IMAGE_SUCS'

export const createB64Image = createAction(CREATE_B64_IMAGE)
export const createB64ImageSucs = createAction(CREATE_B64_IMAGE_SUCS)
