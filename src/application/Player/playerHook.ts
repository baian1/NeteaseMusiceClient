import { useRef, useEffect, useMemo, useState } from "react"
import { Howl } from "howler"

export function usePlayer(
  src: string,
  changePlaying: (playing: boolean) => void,
  setIndex: (index: number) => void
) {
  const [id, setId] = useState(0)
  const initPlay = useMemo(() => {
    return new Howl({
      src: ["xxx.mp3"],
      html5: true,
    })
  }, [])
  const sound = useRef<Howl>(initPlay)

  //订阅器
  const listenrs = useRef<Function[]>([])
  const listen = useMemo(() => {
    return (fn: (current: number, duration: number) => void) => {
      listenrs.current.push(fn)
      return () => {
        let index = listenrs.current.indexOf(fn)
        if (index !== -1) {
          listenrs.current.splice(index, 1)
        }
      }
    }
  }, [])

  const step = useMemo(() => {
    function step() {
      listenrs.current.forEach(item => {
        item(sound.current.seek(), sound.current.duration())
      })
      if (sound.current.playing()) {
        requestAnimationFrame(step)
      }
    }
    return step
  }, [])

  const soundAction = useMemo(() => {
    function play() {
      sound.current.play(id)
      changePlaying(true)
    }
    function pause() {
      sound.current.pause(id)
      changePlaying(false)
    }
    function seek(per: number) {
      if (id === 0) {
        return
      }
      let nowTime = sound.current.seek()
      let goToTime = per * sound.current.duration(id)
      if (Math.abs(nowTime - goToTime) > 3) {
        sound.current.seek(goToTime)
      }
    }
    function volume(tt: number) {
      sound.current.volume(tt, id)
    }
    function skipTo(index: number) {
      setIndex(index)
    }
    return {
      play,
      pause,
      seek,
      volume,
      skipTo,
    }
  }, [changePlaying, id, setIndex])

  useEffect(() => {
    sound.current = new Howl({
      src: [src],
      html5: true,
    })
    if (!sound.current) {
      return
    }
    const nowSound = sound.current
    nowSound.once("load", () => {
      let id = nowSound.play()
      setId(id)
    })
    nowSound.on("play", () => {
      step()
      changePlaying(true)
    })
    nowSound.on("seek", () => {
      step()
    })
    return () => {
      if (sound.current) {
        sound.current.unload()
      }
    }
  }, [changePlaying, src, step])

  return [soundAction, sound.current, listen] as const
}
