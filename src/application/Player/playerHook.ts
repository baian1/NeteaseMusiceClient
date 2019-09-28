import { useRef, useEffect, useMemo, useState } from "react"
import { Howl } from "howler"
import { playMode } from "./interface/Player.interface"

export function usePlayer(
  src: string,
  mode: 0 | 1 | 2,
  changePlaying: (playing: boolean) => void,
  nextSong: () => void
) {
  const [id, setId] = useState(0)
  const initPlay = useMemo(() => {
    return new Howl({
      src: ["xxx.mp3"],
      html5: true,
    })
  }, [])
  const sound = useRef<Howl>(initPlay)

  const loopRef = useRef(mode === playMode.loop)
  useEffect(() => {
    loopRef.current = mode === playMode.loop
  }, [mode])
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
      let now = 0
      let duration = 0
      try {
        duration = sound.current.duration()
        now = sound.current.seek()
      } catch (e) {
        setTimeout(() => {
          listenrs.current.forEach(item => {
            item(0, 0)
          })
        }, 520)
      }
      listenrs.current.forEach(item => {
        item(now, duration)
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
      if (id === 0 || !id) {
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
    return {
      play,
      pause,
      seek,
      volume,
    }
  }, [changePlaying, id])

  useEffect(() => {
    if (src === "") {
      sound.current = initPlay
    } else {
      sound.current = new Howl({
        src: [src],
        html5: true,
      })
    }
    if (!sound.current) {
      return
    }
    const nowSound = sound.current
    nowSound.once("load", () => {
      let id = nowSound.play()
      setId(id)
      step()
    })
    nowSound.on("play", () => {
      step()
      changePlaying(true)
    })
    nowSound.on("seek", () => {
      step()
    })
    nowSound.on("end", () => {
      if (loopRef.current === true) {
        let id = nowSound.play()
        setId(id)
        return
      }
      nextSong()
    })
    return () => {
      if (sound.current) {
        sound.current.unload()
      }
    }
  }, [changePlaying, initPlay, nextSong, src, step])

  return [soundAction, sound.current, listen] as const
}
