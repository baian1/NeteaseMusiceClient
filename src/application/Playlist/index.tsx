import "./style/index.less"
import React, { useState, useEffect, useMemo } from "react"
import {
  CategoryInterface,
  getCategorylists,
  PlayListInterface,
  getPlayLists,
} from "@/api/request"
import SelectCat from "@/components/SelectCat"

const prefix = "PlayList"
const MaxPlayList = 6

const PlayList: React.FunctionComponent<{}> = () => {
  //当前歌单种类和所有歌单种类
  const [categoryLists, setCategoryLists] = useState<CategoryInterface[]>([])
  const [cat, setCat] = useState<string>("全部歌单")

  //种类选择模拟弹窗组件控制
  const [selectCatPosition, setPosition] = useState<[number, number]>([0, 0])
  const [selectCatShowState, setselectCatShowState] = useState<boolean>(false)

  //根据种类列表
  useEffect(() => {
    getCategorylists()
      .then(res => res.data)
      .then(data => {
        setCategoryLists(data.sub)
      })
  }, [cat])

  //热门歌单种类导航
  const hotCatLists = []
  let hotCatCount = 0
  for (let item of categoryLists) {
    if (item.hot === true) {
      hotCatLists.push(
        <li key={item.name} data-cat={item.name}>
          {item.name}
        </li>
      )
      hotCatCount++
    }
    if (hotCatCount === MaxPlayList) {
      break
    }
  }

  //初始化歌单
  const initPlayListsCount = 40
  const [playList, setPlayList] = useState<PlayListInterface[]>([])
  useEffect(() => {
    getPlayLists(0, initPlayListsCount, cat)
      .then(res => res.data)
      .then(data => {
        setPlayList(data.playlists)
      })
  }, [cat, setPlayList])

  //图片大小自适应
  const [lineLength, setLineLength] = useState<number>(5)
  const scrollref = React.createRef<HTMLDivElement>()
  useEffect(() => {
    const resizeObserver = new window.ResizeObserver(entries => {
      let ele = entries[0].target as HTMLDivElement
      let width = ele.clientWidth
      if (width <= 700) {
        setLineLength(3)
      } else if (width <= 875) {
        setLineLength(4)
      } else {
        setLineLength(5)
      }
    })

    resizeObserver.observe(scrollref.current as Element)
    return () => {
      resizeObserver.disconnect()
    }
  }, [scrollref])

  const placeHolderElement = useMemo<JSX.Element[]>(() => {
    let count =
      playList.length % lineLength === 0
        ? 0
        : lineLength - (playList.length % lineLength)
    console.log(playList.length, lineLength, count)
    const ele: JSX.Element[] = []
    for (let i = 0; i < count; i++) {
      ele.push(
        <div key={"placeHolderElement" + i} className={"song"}>
          <div className={"img-cover"}></div>
        </div>
      )
    }
    return ele
  }, [lineLength, playList.length])
  const palyList = useMemo(() => {
    return playList.map((item, index) => {
      return (
        <div key={cat + index} className={"song"}>
          <div className={"img-cover"}>
            <img src={item.coverImgUrl} />
          </div>
          <div>
            <div className={"name"}>{item.name}</div>
            <div className={"creator"}>by {item.creator.nickname}</div>
          </div>
        </div>
      )
    })
  }, [cat, playList])

  const loadmoreRef = React.useRef<HTMLDivElement>(null)
  const loadMoreEle = useMemo(() => {
    return <div ref={loadmoreRef} className={"loadmoreFoot"}></div>
  }, [])

  const loadMore = useMemo(() => {
    let isLoading = false
    let playListLength = initPlayListsCount
    let onceLoadCount = 22
    return () => {
      if (isLoading) {
        return
      }
      getPlayLists(playListLength, onceLoadCount, cat)
        .then(res => res.data)
        .then(data => {
          setPlayList(oldData => {
            playListLength = playListLength + onceLoadCount
            return [...oldData, ...data.playlists]
          })
        })
        .then(() => {
          isLoading = false
        })
    }
  }, [cat])

  useEffect(() => {
    let observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      {
        root: document.querySelector(".content-wrap"),
        rootMargin: "10px 100px 0px 0px",
        threshold: 0.5,
      }
    )
    if (loadmoreRef.current) {
      observer.observe(loadmoreRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [cat, loadMore, loadmoreRef])

  return (
    <>
      <nav className={`${prefix}-nav`}>
        <div
          className={`${prefix}-cat`}
          onClick={event => {
            setselectCatShowState(item => !item)
            let ele = event.target as HTMLDivElement
            const ClientRect = ele.getBoundingClientRect()
            setPosition([ClientRect.right, ClientRect.bottom])
          }}>
          {cat}
          {"\u2B9F"}
        </div>
        <ul
          className={`${prefix}-ul`}
          onClick={event => {
            const ele = event.target as HTMLDivElement
            if (ele.dataset.cat) {
              setCat(ele.dataset.cat)
            }
          }}>
          {hotCatLists}
        </ul>
      </nav>
      <div className={`${prefix}-songlist`} ref={scrollref}>
        {palyList}
        {placeHolderElement}
        {loadMoreEle}
      </div>

      <SelectCat
        setCatgory={setCat}
        categoryLists={categoryLists}
        selectCat={cat}
        show={selectCatShowState}
        changeView={setselectCatShowState}
        selectCatPosition={selectCatPosition}
      />
    </>
  )
}

export default PlayList
