import { useState, useMemo, useRef } from "react"
import { useDispatchTs } from "@/stroe/hook"
import { asyncActionCreators, actionCreators } from "./store"
import { throttle } from "lodash"

export function useForceUpdate() {
  const [count, setCount] = useState(0)
  function update() {
    setCount(count => {
      return count + 1
    })
  }
  return update
}

export function useDispatchAction() {
  const dispatch = useDispatchTs()

  const actions = useMemo(() => {
    return {
      setIndex: (index: number) =>
        dispatch(asyncActionCreators.freshSongSrc(index)),
      setTimer: throttle((current: number, duration: number) => {
        dispatch(actionCreators.setTimer({ current, duration }))
      }, 100),
      changePlaying: (playing?: boolean) => {
        dispatch(actionCreators.changeSongPlaying(playing))
      },
    }
  }, [dispatch])
  return actions
}

export function useProgress(
  duration: number,
  forceUpdate: () => void,
  seek: (pre: number) => void
) {
  //进度条的激活状态,用来选择显示的时间
  const isProgressActive = useRef(false)

  //进度条激活的时候的时间
  const [progressTime, setProgressTime] = useState(0)
  const progressActions = useMemo(() => {
    //设置一个进度条
    let oldProgressActive = new Proxy(isProgressActive, {
      set: function(target, key: "current", value: boolean): boolean {
        let oldValue = Reflect.get(target, key)
        Reflect.set(target, key, value)
        if (oldValue === false) {
          Reflect.set(target, key, value)
          forceUpdate()
        }
        return true
      },
      get: function(target, key: "current") {
        return target[key]
      },
    })

    function mouseDown(pre: number) {
      seek(pre)
      setProgressTime(pre * duration)
      oldProgressActive.current = true
    }
    function mouseMove(pre: number) {
      setProgressTime(pre * duration)
      oldProgressActive.current = true
    }
    function mouseUp(pre: number) {
      seek(pre)
      oldProgressActive.current = false
    }
    return {
      mouseUp,
      mouseMove,
      mouseDown,
    }
  }, [duration, forceUpdate, seek])
  return {
    actions: progressActions,
    time: progressTime,
    isActive: isProgressActive,
  }
}
