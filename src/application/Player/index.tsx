import React, { useEffect, useState, useMemo } from "react"
import "./style/index.less"
import { useSelectorTs, useDispatchTs } from "@/stroe/hook"
import { getPlayListsDetail, Play } from "@/api/request"
import { useDispatch } from "react-redux"
import { addSong } from "./store/actionCreators"
import SongListModel from "./SongListModel"
import { actionCreators, asyncActionCreators } from "./store"
import { formatTime } from "@/utils/time"
import { useProcess } from "./processHook"
import { usePlayer } from "./playerHook"
import VolumeModel from "./VolumeModel"

const prefix = "Player"

function useDispatchAction() {
  const dispatch = useDispatchTs()

  const action = useMemo(() => {
    return {
      setIndex: (index: number) =>
        dispatch(asyncActionCreators.freshSongSrc(index)),
      setTimer: (current: number, duration: number) => {
        dispatch(actionCreators.setTimer({ current, duration }))
      },
      changePlaying: (playing?: boolean) => {
        dispatch(actionCreators.changeSongPlaying(playing))
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

  const [playerAction, sound] = usePlayer(
    State.songStatus.src,
    actions.setTimer,
    actions.changePlaying
  )

  //测试数据加载
  const dispatch = useDispatch()
  useEffect(() => {
    getPlayListsDetail(347230)
      .then(res => res.data)
      .then(data => dispatch(addSong(data.songs)))
    return () => {}
  }, [dispatch])

  const process = useProcess()

  return (
    <div className={`${prefix}-wrap`} ref={process.mouseRangeRef}>
      <div className={`${prefix}-left`}>
        <div className={`cover`}>
          <img src={State.songStatus.picUrl} />
        </div>
        <div className={`play-control`}>
          <div
            className={"prev-next"}
            onClick={() => {
              actions.setIndex(State.currentIndex - 1)
            }}>
            <i className={"iconfont icon-shangyiqu101"}></i>
          </div>
          <div
            className={"pause-play"}
            onClick={() => {
              if (sound.playing()) {
                playerAction.pause()
              } else {
                playerAction.play()
              }
            }}>
            {sound.playing() ? (
              <i className={"iconfont icon-stop"}></i>
            ) : (
              <i className={"iconfont icon-zanting1"}></i>
            )}
          </div>
          <div
            className={"prev-next"}
            onClick={() => {
              actions.setIndex(State.currentIndex + 1)
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
            {formatTime(State.songStatus.current)}/
            {formatTime(State.songStatus.duration)}
          </div>
        </div>
        <div className={`process`}>
          <div className={`current-time`} ref={process.processCurrentRef}>
            <div className={`point-slider`} ref={process.pointRef}>
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
        <VolumeModel />
        {isSongListModelShow ? (
          <SongListModel
            songs={State.songList as Play[]}
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
