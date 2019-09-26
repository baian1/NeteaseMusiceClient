import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react"
import { Play } from "@/api/request"
import { formatTime } from "@/utils/time"
import "./style/SongListModel.less"
import { useDispatchTs } from "@/stroe/hook"
import { actionCreators } from "./store"
import Row from "./Row"

interface P {
  songs: Play[]
  currentIndex: number
  setIndex(index: number): void
  changeStatus(status: boolean): void
}

const prefix = "SongListModel"
const SongListModel: React.FC<P> = ({
  songs,
  currentIndex,
  setIndex,
  changeStatus,
}) => {
  const dispatch = useDispatchTs()
  const actions = useMemo(() => {
    return {
      removeSongByIndex: (index: number) =>
        dispatch(actionCreators.deleteSongByIndex({ index })),
    }
  }, [dispatch])

  //选中歌曲事件
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
      }
    }
  }, [])

  /**
   * 列表控制
   * 只渲染窗口范围内的dom
   * 使用绝对定位
   * 根据外层wrap的滚动条高度计算出需要的元素
   */
  //滚动条位置记录
  const [scrollTop, setScrollTop] = useState(0)

  //初始化滚动条位置
  const scrollRef = useRef<HTMLDivElement>(null)
  //渲染前操作,防止抖动
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, currentIndex * 50)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //row点击的相关事件：删除，播放等
  const handleClickRow = useMemo(() => {
    return (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      //事件代理,处理子元素的事件
      //如果点击了里面的元素，往外找到设置的data
      let ele = event.target as HTMLElement
      if (!ele.dataset.action) {
        if (!ele.parentElement) {
          return
        }
        ele = ele.parentElement
      }

      if (ele.dataset.action) {
        switch (ele.dataset.action) {
          case "setIndex":
            if (ele.dataset.index) {
              setIndex(parseInt(ele.dataset.index))
            }
            break
          case "deleteByIndex":
            if (ele.dataset.index) {
              actions.removeSongByIndex(parseInt(ele.dataset.index))
            }
            break
        }
      }
    }
  }, [actions, setIndex])

  //多个row元素
  const rows = useMemo(() => {
    //最大显示row数量
    const max = 15
    //滚动后，开始的index
    const starIndex =
      Math.floor(scrollTop / 50) - 3 < 0 ? 0 : Math.floor(scrollTop / 50) - 3

    //返回需要的15个row
    let resEles = []
    for (let i = starIndex; i < starIndex + max; i++) {
      const isOdd = i % 2 === 0 ? true : false
      const song = songs[i]
      //不够就少返回点
      if (song === undefined) {
        break
      }
      //row元素的编写
      resEles.push(
        <Row
          isCurrentIndex={currentIndex === i}
          isSelectedIndex={selectedIndex === i}
          index={i}
          name={song.name}
          author={song.ar[0].name}
          time={song.dt}
          isOdd={isOdd}
          key={song.id}
        />
      )
    }
    return (
      <div
        style={{
          flexShrink: 0,
          height: `${50 * songs.length}px`,
          position: "relative",
        }}
        onClick={handleClickRow}>
        {resEles}
      </div>
    )
  }, [scrollTop, songs, handleClickRow, currentIndex, selectedIndex])

  return (
    <div
      className={`${prefix}-backgroud`}
      onClick={() => {
        changeStatus(false)
      }}>
      <div
        className={`${prefix}-wrap`}
        onClick={event => {
          event.stopPropagation()
        }}>
        <div className={"header"}>
          <div>播放列表</div>{" "}
          <i
            className={`iconfont icon-message-close`}
            onClick={() => {
              changeStatus(false)
            }}></i>
        </div>
        <div
          ref={scrollRef}
          className={"list-body"}
          onClick={changeSelectIndex}
          onScroll={event => {
            let ele = event.target as HTMLDivElement
            let scrollTop = ele.scrollTop
            setScrollTop(scrollTop)
          }}>
          {rows}
        </div>
      </div>
    </div>
  )
}

export default React.memo(SongListModel)
