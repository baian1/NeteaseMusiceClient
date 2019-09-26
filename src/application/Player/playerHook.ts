import { useRef, useEffect, useMemo, useState } from "react"
import { Howl } from "howler"
import { batch } from "react-redux"

export function usePlayer(
  src: string,
  setTimer: (current: number, duration: number) => void,
  changePlaying: (playing: boolean) => void
) {
  const [id, setId] = useState(0)
  const initPlay = useMemo(() => {
    return new Howl({
      src: ["xxx.mp3"],
      html5: true,
    })
  }, [])
  const sound = useRef<Howl>(initPlay)

  const step = useMemo(() => {
    function step() {
      setTimer(sound.current.seek(), sound.current.duration())
      if (sound.current.playing()) {
        requestAnimationFrame(step)
      }
    }
    return step
  }, [setTimer])

  const soundAction = useMemo(() => {
    return {
      play: () => {
        sound.current.play(id)
        changePlaying(true)
      },
      pause: () => {
        sound.current.pause(id)
        changePlaying(false)
      },
      continue: () => {
        sound.current.seek(
          sound.current.seek() / sound.current.duration(id),
          id
        )
      },
      seek: (per: number) => {
        let nowTime = sound.current.seek()
        let goToTime = per * sound.current.duration(id)
        if (Math.abs(nowTime - goToTime) > 3) {
          sound.current.seek(goToTime)
        }
      },
      volume: (tt: number) => {
        sound.current.volume(tt, id)
      },
    }
  }, [changePlaying, id])

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
      batch(() => {
        setTimer(0, nowSound.duration())
        changePlaying(true)
      })
    })
    nowSound.on("play", () => {
      step()
    })
    nowSound.on("seek", () => {
      step()
    })
    return () => {
      if (sound.current) {
        sound.current.unload()
      }
    }
  }, [src, setTimer, changePlaying, step])

  return [soundAction, sound.current] as const
}
