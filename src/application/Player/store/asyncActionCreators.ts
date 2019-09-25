import { AsyncAction } from "@/stroe/hook"
import { getSongSrc } from "@/api/music"
import { setSong } from "./actionCreators"

export function freshSongSrc(id: number): AsyncAction {
  return async dispatch => {
    let src = await getSongSrc(id).then(res => res.data.data[0].url)
    dispatch(setSong(id, src))
  }
}
