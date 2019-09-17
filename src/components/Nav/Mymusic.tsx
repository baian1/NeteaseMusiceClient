import React from "react"
import { NavData } from "./hook"
import { NavLink } from "react-router-dom"

interface P {
  data: NavData[]
}

const Mymusic: React.FunctionComponent<P> = ({ data = [] }) => {
  return (
    <ul className="nav-ul">
      <div className="title">我的音乐</div>
      {data.map(item => {
        const element = (
          <NavLink key={item.name} to={item.path} style={{ color: "black" }}>
            <li className={item.active ? "li-active" : ""}>
              <div className={"item"}>
                <i className={`${item.icon}`}></i>
                {item.name}
              </div>
            </li>
          </NavLink>
        )
        return element
      })}
    </ul>
  )
}

export default Mymusic
