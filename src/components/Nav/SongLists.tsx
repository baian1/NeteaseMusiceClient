import React from "react"
import { NavData } from "./hook"
import { NavLink } from "react-router-dom"

interface P {
  data: NavData[]
}
const SongLists: React.FunctionComponent<P> = ({ data = [] }) => {
  return (
    <ul className="nav-ul">
      <div className="title">收藏的歌单</div>
      {data.map(item => {
        return (
          <NavLink key={item.name} to={item.path} style={{ color: "black" }}>
            <li className={item.active ? "li-active" : ""}>
              <div className={"item"}>
                <i className={"iconfont icon-liebiao"}></i>
                {item.name}
              </div>
            </li>
          </NavLink>
        )
      })}
    </ul>
  )
}

export default SongLists
