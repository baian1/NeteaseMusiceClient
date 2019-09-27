import { AsyncAction } from "@/stroe/hook"
import { getSongSrc } from "@/api/music"
import { setSong, setIndex } from "./actionCreators"
import { batch } from "react-redux"
import { Play } from "@/api/request"

export function freshSongSrc(index: number): AsyncAction {
  return async (dispatch, store) => {
    let data = store().palyer
    if (index < 0) {
      index = data.songList.length - 1
    } else if (index === data.songList.length) {
      index = 0
    }
    const song = data.songList[index]
    let src = await getSongSrc(song.id).then(res => res.data.data[0].url)
    batch(() => {
      dispatch(setSong(song, src))
      dispatch(setIndex({ index }))
    })
  }
}
