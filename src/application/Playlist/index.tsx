import "./style/index.less"
import React, { useState, useEffect } from "react"
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
  const [categoryLists, setCategoryLists] = useState<CategoryInterface[]>([])
  const [cat, setCat] = useState<string>("全部歌单")

  useEffect(() => {
    getCategorylists()
      .then(res => res.data)
      .then(data => {
        setCategoryLists(data.sub)
      })
  }, [cat])

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

  const [playList, setPlayList] = useState<PlayListInterface[]>([])
  useEffect(() => {
    getPlayLists(0, 40, cat)
      .then(res => res.data)
      .then(data => {
        setPlayList(data.playlists)
      })
  }, [cat, setPlayList])

  const [selectCatPosition, setPosition] = useState<[number, number]>([0, 0])
  const [selectCatShowState, setselectCatShowState] = useState<boolean>(false)

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

  const loadmoreRef = React.createRef<HTMLDivElement>()
  useEffect(() => {
    let isLoad = false
    let observer = new IntersectionObserver(
      entries => {
        console.log(entries[0])
        if (entries[0].isIntersecting && isLoad === false) {
          isLoad = true
          getPlayLists(playList.length, 20, cat)
            .then(res => res.data)
            .then(data => {
              setPlayList(oldData => {
                return [...oldData, ...data.playlists]
              })
            })
            .then(() => {
              isLoad = false
            })
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
  }, [cat, loadmoreRef, playList.length])

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
        {playList.map((item, index) => {
          if (
            playList.length - Math.floor(index / lineLength) * lineLength <
            lineLength
          ) {
            return null
          }
          return (
            <div key={cat + index} className={"song"}>
              <div className={"img-cover"}>
                <img src={item.coverImgUrl} />
              </div>
              <div className={"name"}>{item.name}</div>
              <div className={"creator"}>by {item.creator.nickname}</div>
            </div>
          )
        })}
        <div ref={loadmoreRef} className={"loadmoreFoot"}></div>
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
