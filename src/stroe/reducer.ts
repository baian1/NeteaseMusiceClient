import { combineReducers } from "redux"
import { reducer } from "src/application/Player/store"
import { getStoreTypeFromReducers } from "@/utils/type"

const mergeReducers = {
  palyer: reducer,
}

export type Store = getStoreTypeFromReducers<typeof mergeReducers>

export default combineReducers(mergeReducers)
