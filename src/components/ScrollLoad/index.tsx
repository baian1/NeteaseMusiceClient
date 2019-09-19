import React, { useState, useEffect, useMemo } from "react"

const prefix = "scrollLoad"

interface Item {
  img: HTMLImageElement
  descript: HTMLDivElement
}

interface P {
  flag: string
  items: Item[]
  loadMore: () => void
}

const ScrollLoad: React.FunctionComponent<P> = ({ items, flag, loadMore }) => {
  //图片大小自适应
  const [lineLength, setLineLength] = useState<number>(5)
  const scrollref = React.createRef<HTMLDivElement>()
  //监听宽度变化确定每行个数
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

  //占位空元素,用以控制最后一行图片大小
  const placeHolderElement = useMemo<JSX.Element[]>(() => {
    let count =
      items.length % lineLength === 0
        ? 0
        : lineLength - (items.length % lineLength)
    const ele: JSX.Element[] = []
    for (let i = 0; i < count; i++) {
      ele.push(
        <div key={"placeHolderElement" + i} className={"song"}>
          <div className={"img-cover"}></div>
        </div>
      )
    }
    return ele
  }, [lineLength, items.length])
  //每一个有效元素
  const palyList = useMemo(() => {
    return items.map((item, index) => {
      return (
        <div key={flag + index} className={"song"}>
          <div className={"img-cover"}>{item.img}</div>
          <div>{item.descript}</div>
        </div>
      )
    })
  }, [flag, items])

  //加载更多函数
  const loadmoreRef = React.useRef<HTMLDivElement>(null)
  const loadMoreEle = useMemo(() => {
    return <div ref={loadmoreRef} className={"loadmoreFoot"}></div>
  }, [])

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
  }, [flag, loadMore, loadmoreRef])
  return (
    <div className={`${prefix}-songlist`} ref={scrollref}>
      {palyList}
      {placeHolderElement}
      {loadMoreEle}
    </div>
  )
}

export default ScrollLoad
