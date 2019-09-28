import React, { useEffect, useState, useRef } from "react"
import "./style/index.less"
import { useSelectorTs } from "@/stroe/hook"
import { getPlayListsDetail } from "@/api/request"
import { useDispatch } from "react-redux"
import { addSong } from "./store/actionCreators"
import SongListModel from "./SongListModel"
import { formatTime } from "@/utils/time"
import { usePlayer } from "./playerHook"
import VolumeModel from "./VolumeModel"
import ProgressBar from "@/components/ProgressBar"
import { useForceUpdate, useDispatchAction, useProgress } from "./hook"
import throttle from "lodash/throttle"

const prefix = "Player"

const Player: React.FunctionComponent<{}> = () => {
  const State = useSelectorTs(state => {
    return {
      ...state.palyer,
    }
  })
  const forceUpdate = useForceUpdate()
  const actions = useDispatchAction()

  const [isSongListModelShow, setSongListModelShow] = useState(false)
  const [isVolumeModelShow, setVolumeModelShow] = useState(false)

  //播放器对象
  const [playerAction, sound, listen] = usePlayer(
    State.songStatus.src,
    State.mode,
    actions.changePlaying,
    actions.nextSong
  )
  const progress = useProgress(
    State.songStatus.duration,
    forceUpdate,
    playerAction.seek
  )
  //进度条对外暴露控制接口
  const controllerProgressRef = useRef<(offset: number) => void>(() => {})

  useEffect(() => {
    const un1 = listen(actions.setTimer)

    const un2 = listen(
      throttle((current, duration) => {
        if (controllerProgressRef.current) {
          if (duration === 0) {
            controllerProgressRef.current(0)
          }
          controllerProgressRef.current(current / duration)
        }
      }, 1000)
    )
    return () => {
      un1(), un2()
    }
  }, [actions.setTimer, listen])

  useEffect(() => {
    actions.freshSongSrc(State.currentIndex)
  }, [State.currentIndex, actions])
  //测试数据加载
  const dispatch = useDispatch()
  useEffect(() => {
    getPlayListsDetail(347230)
      .then(res => res.data)
      .then(data => dispatch(addSong(data.songs)))
    return () => {}
  }, [dispatch])

  return (
    <div className={`${prefix}-wrap`}>
      <div className={`${prefix}-left`}>
        <div className={`cover`}>
          <img src={State.songStatus.picUrl} />
        </div>
        <div className={`play-control`}>
          <div
            className={"prev-next"}
            onClick={() => {
              actions.nextSong("pre")
            }}>
            <i className={"iconfont icon-shangyiqu101"}></i>
          </div>
          <div
            className={"pause-play"}
            onClick={() => {
              if (State.songStatus.playing) {
                playerAction.pause()
              } else {
                playerAction.play()
              }
            }}>
            {State.songStatus.playing ? (
              <i className={"iconfont icon-stop"}></i>
            ) : (
              <i className={"iconfont icon-zanting1"}></i>
            )}
          </div>
          <div
            className={"prev-next"}
            onClick={() => {
              actions.nextSong("next")
            }}>
            <i className={"iconfont icon-xiayiqu101"}></i>
          </div>
        </div>
      </div>

      <div className={`${prefix}-center`}>
        <div className={`song-information`}>
          <div className={`title`}>
            {State.songStatus.name === "" ? (
              ""
            ) : (
              <>
                {State.songStatus.name}
                <div className={`author`}> - {State.songStatus.author}</div>
              </>
            )}
          </div>
          <div className={`time`}>
            {progress.isActive.current
              ? formatTime(progress.time)
              : formatTime(State.songStatus.current)}
            /{formatTime(State.songStatus.duration)}
          </div>
        </div>
        <ProgressBar
          mouseDown={progress.actions.mouseDown}
          mouseMove={progress.actions.mouseMove}
          mouseUp={progress.actions.mouseUp}
          controlerRef={controllerProgressRef}
        />
      </div>

      <div className={`${prefix}-right`}>
        <div
          className={"bofanfanshi"}
          onClick={() => {
            actions.setPlayMode(State.mode)
          }}>
          {State.mode === 0 ? (
            <i className={"iconfont icon-shunxubofang"}></i>
          ) : State.mode === 1 ? (
            <i className={"iconfont icon-danquxunhuan1"}></i>
          ) : (
            <i className={"iconfont icon-suiji"}></i>
          )}
        </div>
        <div
          className={"volume"}
          onClick={() => {
            setVolumeModelShow(status => {
              return !status
            })
          }}>
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

        <VolumeModel
          changeStatus={setVolumeModelShow}
          show={isVolumeModelShow}
        />

        {isSongListModelShow ? (
          <SongListModel
            songs={State.songList}
            currentIndex={State.currentIndex}
            setIndex={actions.setIndex}
            changeStatus={setSongListModelShow}
          />
        ) : null}
      </div>
    </div>
  )
}

export default React.memo(Player)
