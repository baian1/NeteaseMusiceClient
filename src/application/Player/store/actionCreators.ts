import {
  ADD_SONG,
  SET_INDEX,
  DELETE_SONG,
  SET_SONG_SRC,
  DELETE_SONG_BY_INDEX,
  SET_TIMER,
  CHANGE_SONG_PLAYING,
  SET_VOLUME,
  SET_PLAY_MODE,
  NXET_SONG,
} from "./constants"
import { Play } from "@/api/request"

/**
 * 列表函数
 * @param data
 */
export const addSong = (data: Play[] | Play) => {
  let temp: Play[] = []
  if (Array.isArray(data)) {
    temp = data
  } else {
    temp = [data]
  }
  return {
    type: ADD_SONG,
    data: temp,
  } as const
}

export const deleteSong = (data: { id: number[] | number }) => {
  let id: number[] = []
  if (Array.isArray(data.id)) {
    id = data.id
  } else {
    id = [data.id]
  }
  return {
    type: DELETE_SONG,
    data: { id },
  } as const
}

export const deleteSongByIndex = (data: { index: number }) => {
  return {
    type: DELETE_SONG_BY_INDEX,
    data,
  } as const
}

/**
 * 播放歌曲控制
 * @param data
 */
export const setIndex = (data: { index: number }) =>
  ({
    type: SET_INDEX,
    data,
  } as const)

export const nextSong = (direction: "pre" | "next") =>
  ({
    type: NXET_SONG,
    data: {
      direction,
    },
  } as const)

export const setPlayMode = (mode: 0 | 1 | 2) =>
  ({
    type: SET_PLAY_MODE,
    data: {
      mode,
    },
  } as const)

/**
 * 当前歌曲状态控制
 * @param song
 * @param src
 */
export const setSong = (song: Play, src: string) =>
  ({
    type: SET_SONG_SRC,
    data: {
      song,
      src,
    },
  } as const)

export const setTimer = ({
  current,
  duration,
}: {
  current: number
  duration: number
}) =>
  ({
    type: SET_TIMER,
    data: {
      current,
      duration,
    },
  } as const)

export const changeSongPlaying = (playing?: boolean) =>
  ({
    type: CHANGE_SONG_PLAYING,
    data: {
      playing,
    },
  } as const)

export const setVolume = (volume: number) =>
  ({
    type: SET_VOLUME,
    data: {
      volume,
    },
  } as const)
