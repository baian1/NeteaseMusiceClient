import React, { useRef, useEffect, useState } from "react"
import { Howl } from "howler"
import "./style/index.less"

const prefix = "Player"

const Player: React.FunctionComponent<{}> = () => {
  let sound = new Howl({
    src: [
      "http://m7.music.126.net/20190921175325/76e83df815889925a86ddce83e8d52f9/ymusic/b1c4/b5de/74d0/9158ae4873e10b743790320db9ef9b29.mp3",
    ],
  })

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
          <div className={"song-count"}>12</div>
        </div>
      </div>
    </div>
  )
}

export default Player
