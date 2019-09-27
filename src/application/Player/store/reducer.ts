import * as actionTypes from "./constants"
import * as actionCreators from "./actionCreators"
import { produce } from "immer"
import { playMode } from "../interface/Player.interface"
import { getActionReturnType } from "@/utils/type"
import { Play } from "@/api/request"

export type Actions = getActionReturnType<typeof actionCreators>

interface Timer {
  current: number
  duration: number
}

export interface Data {
  songList: Play[]
  currentIndex: number
  mode: playMode
  songStatus: {
    name: string
    author: string
    src: string
    playing: boolean
    picUrl: string
    volume: number
  } & Timer
}

const defaultState: Data = {
  songList: [],
  songStatus: {
    current: 0,
    duration: 0,
    name: "",
    author: "",
    src: "",
    playing: false,
    picUrl: "",
    volume: 0.5,
  },
  currentIndex: -1,
  mode: playMode.sequence,
}

export default produce((dragft: Data = defaultState, action: Actions) => {
  switch (action.type) {
    case actionTypes.ADD_SONG: {
      let data = action.data
      dragft.songList = data
      break
    }
    case actionTypes.DELETE_SONG: {
      let data = action.data.id
      data.forEach(id => {
        delete dragft.songList[id]
      })
      break
    }
    case actionTypes.DELETE_SONG_BY_INDEX: {
      dragft.songList.splice(action.data.index, 1)
      break
    }
    case actionTypes.SET_INDEX: {
      let { index } = action.data
      dragft.currentIndex = index
      break
    }
    case actionTypes.SET_SONG_SRC: {
      const { song, src } = action.data
      dragft.songStatus.src = src
      dragft.songStatus.picUrl = song.al.picUrl
      dragft.songStatus.name = song.name
      dragft.songStatus.author = song.ar[0].name
      break
    }
    case actionTypes.SET_TIMER: {
      dragft.songStatus.current = action.data.current
      dragft.songStatus.duration = action.data.duration
      break
    }
    case actionTypes.CHANGE_SONG_PLAYING: {
      if (action.data.playing) {
        dragft.songStatus.playing = action.data.playing
      } else {
        dragft.songStatus.playing = !dragft.songStatus.playing
      }
      break
    }
    case actionTypes.SET_VOLUME: {
      const volume = action.data.volume
      dragft.songStatus.volume = volume
      break
    }
    default: {
      return dragft
    }
  }
})
