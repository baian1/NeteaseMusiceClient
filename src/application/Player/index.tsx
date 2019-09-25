import React, { useRef, useEffect, useState, useMemo } from "react"
import { Howl } from "howler"
import "./style/index.less"
import { useSelectorTs, useDispatchTs } from "@/stroe/hook"
import { getPlayListsDetail, Play, getSongDetail } from "@/api/request"
import { useDispatch } from "react-redux"
import { addSong } from "./store/actionCreators"
import SongListModel from "./SongListModel"
import { actionCreators, asyncActionCreators } from "./store"
import { getSongSrc } from "@/api/music"
import { formatTime } from "@/utils/time"

const prefix = "Player"

function useDispatchAction() {
  const dispatch = useDispatchTs()

  const action = useMemo(() => {
    return {
      setIndex: (index: number) =>
        dispatch(asyncActionCreators.freshSongSrc(index)),
      setSongSrc: (id: number) =>
        dispatch(asyncActionCreators.freshSongSrc(id)),
      removeSongByIndex: (index: number) =>
        dispatch(actionCreators.deleteSongByIndex({ index })),
      setTimer: (current: number, duration: number) => {
        dispatch(actionCreators.setTimer({ current, duration }))
      },
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

  const [isSongListModelShow, setSongListModelShow] = useState(false)

  const sound = useRef<Howl>(
    new Howl({
      src: [""],
      html5: true,
    })
  )

  const soundAction = useMemo(() => {
    return {
      play: () => {
        sound.current.play()
      },
      pause: () => {
        sound.current.pause()
      },
      seek: (per: number) => {
        sound.current.seek(per)
      },
    }
  }, [sound])

  useEffect(() => {
    sound.current = new Howl({
      src: [State.currentSongSrc],
      html5: true,
    })
    if (!sound.current) {
      return
    }
    const nowSound = sound.current
    nowSound.once("load", () => {
      nowSound.play()
      actions.setTimer(0, nowSound.duration())
    })
    nowSound.on("seek", () => {
      console.log("seek")
      actions.setTimer(nowSound.seek() as number, nowSound.duration())
    })
    return () => {
      if (sound.current) {
        sound.current.unload()
      }
    }
  }, [State.currentSongSrc, actions])

  const dispatch = useDispatch()

  useEffect(() => {
    getPlayListsDetail(347230)
      .then(res => res.data)
      .then(data => dispatch(addSong(data.songs)))
    return () => {}
  }, [dispatch])

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
          <div
            className={"pause-play"}
            onClick={() => {
              console.log(sound.current.playing())
              if (sound.current.playing()) {
                soundAction.pause()
              } else {
                soundAction.play()
              }
            }}>
            {sound.current.playing() ? (
              <i className={"iconfont icon-stop"}></i>
            ) : (
              <i className={"iconfont icon-zanting1"}></i>
            )}
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
            {formatTime(State.time.current)}/{formatTime(State.time.duration)}
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
        <div
          className={"liebiao"}
          onClick={() => {
            setSongListModelShow(true)
          }}>
          <i className={"iconfont icon-liebiao"}></i>
          <div className={"song-count"}>
            {Reflect.ownKeys(State.songList).length}
          </div>
        </div>
        {isSongListModelShow ? (
          <SongListModel
            songs={State.songList as Play[]}
            currentIndex={State.currentIndex}
            setIndex={actions.setIndex}
            removeSongByIndex={actions.removeSongByIndex}
            changeStatus={setSongListModelShow}
          />
        ) : null}
      </div>
    </div>
  )
}

export default React.memo(Player)
