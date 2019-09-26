import "./style/index.less"
import "./style/content.less"
import React from "react"
import { useNav, isNavName } from "./hook"

const prefix = "FindMusic"
const prefixContent = "content"

const FindMusic: React.FunctionComponent<{}> = () => {
  const [nav, Content, changeNav] = useNav()
  return (
    <div className={`${prefix}-wrap`}>
      <div className={`${prefix}-title`}>发现音乐</div>
      <div className={`${prefix}-nav`}>
        <ul
          onClickCapture={event => {
            const ele = event.target as HTMLElement
            const name = ele.innerText
            if (isNavName(name)) {
              changeNav(name)
            }
            return
          }}>
          {nav.map((item, index) => {
            return (
              <li
                key={index}
                className={`item ${item.active ? "item-active" : ""}`}>
                {item.name}
              </li>
            )
          })}
        </ul>
      </div>
      <div className={`${prefixContent}-wrap`}>
        <div className={`${prefixContent}-content`}>
          <Content />
        </div>
      </div>
    </div>
  )
}

export default FindMusic
