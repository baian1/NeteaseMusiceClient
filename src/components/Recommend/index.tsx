import React, { useEffect, useState } from "react"
import "./style/index.less"
import { RecommendInterface } from "@/api/request"

interface P {
  recommendList: RecommendInterface[]
}

const prefix = "recommend"

const Recommend: React.FunctionComponent<P> = ({ recommendList }) => {
  const [recommendLength, set] = useState(10)
  const ref = React.createRef<HTMLDivElement>()
  useEffect(() => {
    const resizeObserver = new window.ResizeObserver((entries, observer) => {
      let ele = entries[0].target as HTMLDivElement
      let width = ele.clientWidth
      if (width <= 700) {
        set(5)
      } else if (width <= 875) {
        set(7)
      } else {
        set(9)
      }
    })

    resizeObserver.observe(ref.current as Element)
    return () => {
      resizeObserver.disconnect()
    }
  }, [ref])
  return (
    <div className={`${prefix}-wrap`}>
      <div className={`${prefix}-header`}>
        <div className={"title"}>推荐歌单</div>
        <div className={"more"}>更多 {"\u2b9e"}</div>
      </div>
      <div ref={ref} className={`${prefix}-songlist`}>
        {recommendList.map((item, index) => {
          if (index > recommendLength) {
            return null
          }
          return (
            <div key={index} className={"song"}>
              <img src={item.picUrl} />
              <div className={"name"}>{item.name}</div>
              <div className={"play-count"}>
                <i className="iconfont play">&#xe885;</i>
                {item.playCount > 100000000
                  ? Math.floor(item.playCount / 100000000) + "亿"
                  : item.playCount > 10000
                  ? Math.floor(item.playCount / 10000) + "万"
                  : item.playCount}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default React.memo(Recommend)
