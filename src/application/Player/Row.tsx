import React from "react"
import { formatTime } from "@/utils/time"
import "./style/Row.less"
interface P {
  isCurrentIndex: boolean
  isSelectedIndex: boolean
  isOdd: boolean
  index: number

  name: string
  author: string
  time: number
}

const Row: React.FC<P> = ({
  isCurrentIndex,
  isSelectedIndex,
  isOdd,
  index: i,

  name,
  author,
  time,
}) => {
  return (
    <>
      <div className={`Row`}>
        <div
          click-animation={isSelectedIndex ? "false" : "true"}
          className={`Row-row isActive ${
            isCurrentIndex ? "current-song" : ""
          } ${isOdd ? "odd" : ""}`}
          style={{
            position: "absolute",
            top: `${i * 50}px`,
            width: "100%",
          }}
          data-index={i}>
          {isCurrentIndex ? <div className={`xiaosanjiao`}></div> : null}
          <div className={"name"}>
            <div className={"text"}>{name}</div>
            {isSelectedIndex ? (
              <div className={"taber"} data-action="setIndex" data-index={i}>
                <i className={`iconfont icon-bofang`}></i>
              </div>
            ) : null}
          </div>
          <div className={"author"}>{author}</div>
          <div className={"duration-time"}>
            {formatTime(time / 1000)}
            {isSelectedIndex ? (
              <div data-action="deleteByIndex" data-index={i}>
                <i className={`iconfont icon-message-close`}></i>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export default Row
