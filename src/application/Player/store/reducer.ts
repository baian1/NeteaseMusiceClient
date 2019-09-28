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

const songStatus = (dragft: Data = defaultState, action: Actions) => {
  let isChange = true
  switch (action.type) {
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
      isChange = false
    }
  }
  return isChange
}

const songListStatus = (dragft: Data = defaultState, action: Actions) => {
  let isChange = true
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
    default: {
      isChange = false
    }
  }
  return isChange
}

const selectSong = (dragft: Data = defaultState, action: Actions) => {
  let isChange = true
  switch (action.type) {
    case actionTypes.SET_INDEX: {
      let { index } = action.data
      dragft.currentIndex = index
      break
    }
    case actionTypes.NXET_SONG: {
      let { direction } = action.data
      let nextIndex = dragft.currentIndex
      if (direction === "pre") {
        nextIndex--
      } else if (direction === "next") {
        nextIndex++
      }
      switch (dragft.mode) {
        case playMode.loop:
        case playMode.sequence: {
          if (nextIndex === -1 || nextIndex === dragft.songList.length) {
            nextIndex = dragft.currentIndex
          }
          break
        }
        case playMode.random: {
          let newIndex = Math.floor(Math.random() * dragft.songList.length)
          while (dragft.currentIndex === newIndex) {
            newIndex = Math.floor(Math.random() * dragft.songList.length)
          }
          nextIndex = newIndex
          break
        }
      }
      dragft.currentIndex = nextIndex
      break
    }
    case actionTypes.SET_PLAY_MODE: {
      let { mode } = action.data
      dragft.mode = mode
      break
    }
    default: {
      isChange = false
    }
  }
  return isChange
}

export default produce((dragft: Data = defaultState, action: Actions) => {
  if (songListStatus(dragft, action)) {
    return
  }
  if (songStatus(dragft, action)) {
    return
  }
  if (selectSong(dragft, action)) {
    return
  }
  return dragft
})
