import React, { useRef, useEffect, useState, useMemo } from "react"
import { Howl } from "howler"
import "./style/index.less"
import { useSelectorTs, useDispatchTs } from "@/stroe/hook"
import { getPlayListsDetail, Play } from "@/api/request"
import { useDispatch } from "react-redux"
import { addSong } from "./store/actionCreators"
import SongListModel from "./SongListModel"
import { actionCreators, asyncActionCreators } from "./store"

const prefix = "Player"

function useDispatchAction() {
  const dispatch = useDispatchTs()

  const action = useMemo(() => {
    return {
      setIndex: (index: number) => dispatch(actionCreators.setIndex({ index })),
      setSongSrc: (id: number) =>
        dispatch(asyncActionCreators.freshSongSrc(id)),
      removeSong: (id: number | number[]) =>
        dispatch(actionCreators.deleteSong({ id })),
    }
  }, [dispatch])
  return action
}

const Player: React.FunctionComponent<{}> = () => {
  const State = useSelectorTs(state => {
    return {
      ...state.palyer,
    }
  })
  const actions = useDispatchAction()

  const songs = useMemo(() => {
    let songs: Play[] = []
    let keys = Reflect.ownKeys(State.songList) as number[]
    for (let i of keys) {
      let song = State.songList[i]
      if (song === undefined) {
        continue
      }
      songs.push(song as Play)
    }

    return songs
  }, [State.songList])

  const dispatch = useDispatch()

  useEffect(() => {
    getPlayListsDetail(347230)
      .then(res => res.data)
      .then(data => dispatch(addSong(data.songs)))
    return () => {}
  }, [])

  const [time, setTime] = useState({
    current: 0,
    duration: 0,
  })

  const pointRef = useRef<HTMLDivElement>(null)
  const mouseRangeRef = useRef<HTMLDivElement>(null)
  const processCurrentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (pointRef.current === null || mouseRangeRef.current === null) {
      return
    }

    const pointEle = pointRef.current
    const mouseRangeEle = mouseRangeRef.current

    //进度条拖动状态
    let isActive = false
    const changeAvticeStatus = (event: MouseEvent) => {
      switch (event.type) {
        case "mousedown": {
          isActive = true
          break
        }
        case "mouseup": {
          isActive = false
          break
        }
      }
    }
    pointEle.addEventListener("mousedown", changeAvticeStatus)
    document.addEventListener("mouseup", changeAvticeStatus)

    const mouseMove = (event: MouseEvent) => {
      const processCurrentEle = processCurrentRef.current
      if (!processCurrentEle || !processCurrentEle.parentElement) {
        return
      }
      const max = processCurrentEle.parentElement.clientWidth
      if (isActive) {
        let offsetX = (event.x - 247) / max
        if (offsetX > 1) {
          offsetX = 1
        } else if (offsetX < 0) {
          offsetX = 0
        }

        processCurrentEle.style.width = offsetX * 100 + "%"
        ;(pointRef.current as HTMLDivElement).style.left = offsetX * 100 + "%"
      }
    }

    mouseRangeEle.addEventListener("mousemove", mouseMove)
    return () => {
      pointEle.removeEventListener("mousedown", changeAvticeStatus)
      document.removeEventListener("mouseup", changeAvticeStatus)
      mouseRangeEle.removeEventListener("mousemove", mouseMove)
    }
  }, [pointRef, mouseRangeRef])

  return (
    <div className={`${prefix}-wrap`} ref={mouseRangeRef}>
      <div className={`${prefix}-left`}>
        <div className={`cover`}>
          <img
            src={`https://p2.music.126.net/uAtY4fnsS7IvunW4Ubcbyw==/109951164340138745.jpg`}
          />
        </div>
        <div className={`play-control`}>
          <div className={"prev-next"}>
            <i className={"iconfont icon-shangyiqu101"}></i>
          </div>
          <div className={"pause-play"}>
            <i className={"iconfont icon-stop"}></i>
            {/* <i className={"iconfont icon-zanting1"}></i> */}
          </div>
          <div className={"prev-next"}>
            <i className={"iconfont icon-xiayiqu101"}></i>
          </div>
        </div>
      </div>

      <div className={`${prefix}-center`}>
        <div className={`song-information`}>
          <div className={`title`}>
            乃测 <div className={`author`}>- people</div>
          </div>
          <div className={`time`}>
            {time.current}/{time.duration}
          </div>
        </div>
        <div className={`process`}>
          <div className={`current-time`} ref={processCurrentRef}>
            <div className={`point-slider`} ref={pointRef}>
              <div></div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${prefix}-right`}>
        <div className={"bofanfanshi"}>
          {/* <i className={"iconfont icon-shunxubofang"}></i>
          <i className={"iconfont icon-danquxunhuan1"}></i> */}
          <i className={"iconfont icon-suiji"}></i>
        </div>
        <div className={"volume"}>
          <i className={"iconfont icon-yinliang"}></i>
        </div>
        <div className={"liebiao"}>
          <i className={"iconfont icon-liebiao"}></i>
          <div className={"song-count"}>
            {Reflect.ownKeys(State.songList).length}
          </div>
        </div>
        <SongListModel songs={songs} currentIndex={State.currentIndex} />
      </div>
    </div>
  )
}

export default Player
