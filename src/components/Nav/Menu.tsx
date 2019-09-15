import React from "react"
import { NavData } from "./hook"
import { NavLink } from "react-router-dom"

interface P {
  mode?: "details" | "thumbnails"
  data: NavData[]
  show: JSX.Element
}

const Menu: React.FunctionComponent<P> = ({
  mode = "details",
  data = [],
  show,
}) => {
  return (
    <ul className="nav-ul">
      {data.length === 0
        ? null
        : data.map(item => {
            const element = (
              <NavLink to={item.path} style={{ color: "black" }}>
                <li key={item.name} className={item.active ? "li-active" : ""}>
                  <div className={"item"}>
                    <i className={`${item.icon}`}></i>
                    {mode === "thumbnails" ? null : item.name}
                  </div>
                </li>
              </NavLink>
            )
            return element
          })}
      {mode === "thumbnails" ? show : null}
    </ul>
  )
}

export default Menu
