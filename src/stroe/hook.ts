import { AnyAction, Action } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux"
import { Store } from "./reducer"

export type AsyncAction<R = void> = ThunkAction<
  Promise<R>,
  Store,
  undefined,
  AnyAction
>
export type DispatchAction<T extends AnyAction = Action> = ThunkDispatch<
  Store,
  undefined,
  T
>
export const useSelectorTs: TypedUseSelectorHook<Store> = useSelector
export const useDispatchTs: () => DispatchAction = useDispatch

// export function getHelp(): AsyncAction<{ name: 1 }> {
//   return async (dispatch, getState) => {
//     const response = await asyncRequest({
//       path: "api/help",
//       method: "GET",
//       body: null,
//     })
//     return response // MyReturnObject
//   }
// }

// async function(){
//   const dispatch = useDispatchTs()
//   var a = await dispatch(getHelp())
//   a.blabla
// }
