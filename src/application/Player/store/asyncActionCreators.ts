import { AsyncAction } from "@/stroe/hook"
import { getSongSrc, checkMusic } from "@/api/music"
import { setSong } from "./actionCreators"

export function freshSongSrc(index: number): AsyncAction {
  return async (dispatch, store) => {
    let data = store().palyer
    if (index < 0) {
      index = data.songList.length - 1
    } else if (index === data.songList.length) {
      index = 0
    }
    const song = data.songList[index]
    //检测歌曲可用性
    let isOk = false
    await checkMusic(song.id)
      .then(res => {
        return res.data
      })
      .then(data => {
        if (data.success === true) {
          isOk = true
        } else {
          alert(data.message)
        }
      })
    //待处理:版权问题
    //1. 选择否跳转到歌曲,不播放
    //2. 提示,不跳转到歌曲
    if (isOk === false) {
      // dispatch(setSong(song, ""))
      return
    }
    //获取歌曲地址
    let src = await getSongSrc(song.id).then(res => {
      const code = res.data.data[0].code
      if (code !== 200) {
        return ""
      }
      return res.data.data[0].url
    })
    dispatch(setSong(song, src))
  }
}
