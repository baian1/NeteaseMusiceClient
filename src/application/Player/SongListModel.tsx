import React, { useState, useMemo } from "react"
import { Play } from "@/api/request"
import { formatTime } from "@/utils/time"
import "./style/SongListModel.less"

interface P {
  songs: Play[]
  currentIndex: number
}

const prefix = "SongListModel"
const SongListModel: React.FC<P> = ({ songs, currentIndex }) => {
  //选中歌曲
  const [selectedIndex, setSelectIndex] = useState(-1)
  const changeSelectIndex = useMemo(() => {
    return (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      let ele = event.target as HTMLDivElement
      let data = ele.dataset.index
      let count = 0
      while (!data && count < 10 && ele.parentElement) {
        data = ele.parentElement.dataset.index
        ele = ele.parentElement as HTMLDivElement
        count++
      }
      if (data) {
        setSelectIndex(parseInt(data))
        console.log(data)
      }
    }
  }, [])

  //虚拟列表
  const [scrollTop, setScrollTop] = useState(0)
  const ele = useMemo(() => {
    const max = 15
    const starIndex =
      Math.floor(scrollTop / 50) - 3 < 0 ? 0 : Math.floor(scrollTop / 50) - 3

    let resEles = []
    for (let i = starIndex; i < starIndex + max; i++) {
      const isOdd = i % 2 === 0 ? true : false
      const song = songs[i]
      if (song === undefined) {
        break
      }
      resEles.push(
        <div className={`Row`} key={song.id}>
          <div
            click-animation={selectedIndex === i ? "false" : "true"}
            className={`Row-row isActive ${
              i === currentIndex ? "current-song" : ""
            } ${isOdd ? "odd" : ""}`}
            style={{
              position: "absolute",
              top: `${i * 50}px`,
              width: "100%",
            }}
            data-index={i}>
            {currentIndex === i ? <div className={`xiaosanjiao`}></div> : null}
            <div className={"name"}>
              <div className={"text"}>{song.name}</div>
              {selectedIndex === i ? (
                <div className={"taber"}>
                  <i className={`iconfont icon-bofang`}></i>
                </div>
              ) : null}
            </div>
            <div className={"author"}>{song.ar[0].name}</div>
            <div className={"duration-time"}>
              {formatTime(Math.floor(song.dt / 1000))}
              {selectedIndex === i ? (
                <div>
                  <i className={`iconfont icon-message-close`}></i>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )
    }
    return (
      <div
        style={{
          flexShrink: 0,
          height: `${50 * songs.length}px`,
          position: "relative",
        }}>
        {resEles}
      </div>
    )
  }, [currentIndex, scrollTop, selectedIndex, songs])

  return (
    <div className={`${prefix}-backgroud`}>
      <div className={`${prefix}-wrap`}>
        <div className={"header"}>
          <div>播放列表</div> <i className={`iconfont icon-message-close`}></i>
        </div>
        <div
          className={"list-body"}
          onClick={changeSelectIndex}
          onScroll={event => {
            let ele = event.target as HTMLDivElement
            let scrollTop = ele.scrollTop
            setScrollTop(scrollTop)
          }}>
          {ele}
        </div>
      </div>
    </div>
  )
}

export default SongListModel
