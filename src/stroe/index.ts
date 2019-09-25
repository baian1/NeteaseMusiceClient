import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import reducer from "./reducer"

const store = createStore(reducer, applyMiddleware(thunk))
let fff = store.getState
export type MyAppStore = ReturnType<typeof fff>

export default store
