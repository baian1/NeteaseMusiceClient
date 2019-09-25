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
  time: Timer
  songList: {
    [index: number]: Play
  }
  currentIndex: number
  mode: playMode
  currentSongSrc: string
}

const defaultState: Data = {
  time: {
    current: 0,
    duration: 0,
  },
  songList: {},
  currentIndex: -1,
  currentSongSrc: "",
  mode: playMode.sequence,
}

export default produce((dragft: Data = defaultState, action: Actions) => {
  switch (action.type) {
    case actionTypes.ADD_SONG: {
      let data = action.data
      for (let i of data) {
        let id = i.id
        dragft.songList[id] = i
      }
      break
    }
    case actionTypes.DELETE_SONG: {
      let data = action.data.id
      data.forEach(id => {
        delete dragft.songList[id]
      })
      break
    }
    case actionTypes.SET_INDEX: {
      let data = action.data
      dragft.currentIndex = data.index
      break
    }
    case actionTypes.SET_SONG_SRC: {
      const { src } = action.data
      dragft.currentSongSrc = src
      break
    }
    default: {
      return dragft
    }
  }
})
