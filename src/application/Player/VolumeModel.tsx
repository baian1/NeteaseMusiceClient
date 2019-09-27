import React, { useRef, useLayoutEffect, useMemo } from "react"
import "./style/VolumeModel.less"
import ProgressBar from "@/components/ProgressBar"
import { useSelectorTs, useDispatchTs } from "@/stroe/hook"
import { Howler } from "howler"
import { actionCreators } from "./store"

interface P {
  changeStatus: (statu: boolean) => void
  show: boolean
}

function useVolume() {
  const dispatch = useDispatchTs()

  const set = useMemo(
    () => (volume: number) => {
      dispatch(actionCreators.setVolume(volume))
      Howler.volume(volume)
    },
    [dispatch]
  )

  return set
}

const prefix = "VolumeModel"
const VolumeModel: React.FC<P> = ({ changeStatus, show }) => {
  const volume = useSelectorTs(state => {
    let volume = state.palyer.songStatus.volume
    return volume
  })
  const setVolume = useVolume()
  const progressRef = useRef<(pre: number) => void>(() => {})
  useLayoutEffect(() => {
    progressRef.current(volume)
    Howler.volume(volume)
  }, [volume])
  return (
    <>
      <div
        className={`${prefix}-backgroud ${
          show === false ? prefix + "-backgroud-hidden" : ""
        }`}
        onClick={() => {
          changeStatus(false)
        }}></div>
      <div
        className={`${prefix}-wrap ${
          show === true ? prefix + "-wrap-jinru" : ""
        } ${show === false ? prefix + "-wrap-tuichu" : ""}`}
        onClick={event => {
          event.stopPropagation()
        }}>
        <i className={`iconfont icon-yinliang`}></i>
        <div className={`progress`}>
          <ProgressBar
            controlerRef={progressRef}
            mouseMove={setVolume}
            mouseDown={setVolume}
          />
        </div>
      </div>
    </>
  )
}
export default VolumeModel
