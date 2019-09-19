import React, { useEffect } from "react"
import "./style/index.less"
import { CategoryInterface } from "@/api/request"

const prefix = "selectCat"

interface P {
  categoryLists: CategoryInterface[]
  selectCat: string
  show: boolean
  setCatgory: (name: string) => void
  changeView: (isShow: boolean) => void
  selectCatPosition: [number, number]
}

const categoryMap = ["语种", "风格", "场景", "情感", "主题"] as const

const SelectCat: React.FunctionComponent<P> = ({
  categoryLists,
  selectCat,
  show,
  setCatgory,
  changeView,
  selectCatPosition,
}) => {
  let lists: {
    [P in typeof categoryMap[number]]: CategoryInterface[]
  } = { 语种: [], 风格: [], 场景: [], 情感: [], 主题: [] }
  for (let i of categoryLists) {
    let theme = categoryMap[i.category]
    lists[theme].push(i)
  }
  let ele = []
  for (let i of categoryMap) {
    ele.push(
      <div className={`${prefix}-item`} key={i}>
        <div className={`${prefix}-item-leibie`}>{i}</div>
        <div className={`${prefix}-item-cats`}>
          {lists[i].map(item => {
            return (
              <div
                className={`${item.hot ? "hot" : ""}`}
                key={item.name}
                data-categor={item.name}>
                {selectCat === item.name ? (
                  <i className={`${prefix}-active`}></i>
                ) : null}
                {item.name}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const ref = React.createRef<HTMLDivElement>()
  useEffect(() => {
    if (!ref.current) {
      return
    }
    const ele = ref.current as HTMLDivElement
    ele.style.transform = `translate(${selectCatPosition[0] - 105}px,${
      selectCatPosition[1]
    }px)`
    ele.classList.add(`${prefix}-animetion-show`)
    return () => {
      ele.style.transform = `translate(${selectCatPosition[0] - 105 + 30}px,${
        selectCatPosition[1]
      }px)`
      ele.classList.remove(`${prefix}-animetion-show`)
    }
  }, [show, ref, selectCatPosition])

  return !show ? null : (
    <div
      className={`${prefix}-position`}
      onClick={() => {
        changeView(false)
      }}>
      <div
        ref={ref}
        className={`${prefix}-content ${prefix}-animetion`}
        style={{
          transform: `translate(${selectCatPosition[0] - 105 + 30}px,${
            selectCatPosition[1]
          }px)`,
        }}
        onClick={event => {
          event.stopPropagation()
          let ele = event.target as HTMLDivElement
          if (ele.dataset.categor) {
            setCatgory(ele.dataset.categor)
            changeView(false)
          }
        }}>
        <div className={`${prefix}-wrap`}>
          <div className={`${prefix}-wrap-header`}>
            <div className={`all`} data-categor={"全部歌单"}>
              {selectCat === "全部歌单" ? (
                <i className={`${prefix}-active`}></i>
              ) : null}
              全部歌单
            </div>
          </div>
          {ele}
        </div>
      </div>
    </div>
  )
}
export default SelectCat
