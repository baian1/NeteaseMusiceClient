import { AsyncAction } from "@/stroe/hook"
import { getSongSrc } from "@/api/music"
import { setSong, setIndex } from "./actionCreators"
import { batch } from "react-redux"

export function freshSongSrc(index: number): AsyncAction {
  return async (dispatch, store) => {
    let data = store().palyer
    const id = data.songList[index].id
    let src = await getSongSrc(id).then(res => res.data.data[0].url)
    console.log(src)
    batch(() => {
      dispatch(setSong(id, src))
      dispatch(setIndex({ index }))
    })
  }
}
