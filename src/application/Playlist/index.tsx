import "./style/index.less"
import "./style/description.less"
import React, { useState, useEffect, useMemo } from "react"
import {
  CategoryInterface,
  getCategorylists,
  PlayListInterface,
  getPlayLists,
} from "@/api/request"
import SelectCat from "@/components/SelectCat"
import ScrollLoad from "@/components/ScrollLoad"
import { playListMockData } from "./initData"

const prefix = "PlayList"
const MaxPlayList = 8
const InitPlayListsCount = 40

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
  const [playList, setPlayList] = useState<PlayListInterface[]>(
    new Array(10).fill(playListMockData)
  )
  useEffect(() => {
    getPlayLists(0, InitPlayListsCount, cat)
      .then(res => res.data)
      .then(data => {
        setPlayList(data.playlists)
      })
  }, [cat, setPlayList])

  //无限加载的元素
  const palyList = useMemo(() => {
    return playList.map(item => {
      return {
        img: <img src={item.coverImgUrl} />,
        descript: (
          <>
            <div className={"description-name"}>{item.name}</div>
            <div className={"description-creator"}>
              by {item.creator.nickname}
            </div>
          </>
        ),
      }
    })
  }, [playList])

  //无限加载的加载函数
  const loadMore = useMemo(() => {
    let total = InitPlayListsCount + 1
    let isLoading = false
    let playListLength = InitPlayListsCount
    let onceLoadCount = 22
    return () => {
      if (isLoading) {
        return
      }
      if (total <= playListLength) {
        alert("没有更多歌单了")
        return
      }
      getPlayLists(playListLength, onceLoadCount, cat)
        .then(res => res.data)
        .then(data => {
          total = data.total
          setPlayList(oldData => {
            playListLength = playListLength + data.playlists.length
            return [...oldData, ...data.playlists]
          })
        })
        .then(() => {
          isLoading = false
        })
    }
  }, [cat])

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
      <ScrollLoad loadMore={loadMore} items={palyList} flag={cat} />

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
