import React from "react"
import "./HomeLayout.less"
import { renderRoutes, RouteConfigComponentProps } from "react-router-config"
import Nav from "../components/Nav"
import Player from "@/application/Player"

const Home: React.FunctionComponent<RouteConfigComponentProps> = props => {
  const { route } = props
  let render = null
  if (route) {
    render = renderRoutes(route.routes)
  }

  return (
    <div className={"wrap"}>
      <header className={"header"}>网易云</header>
      <div className={"contain"}>
        <Nav />
        {render}
      </div>
      <div className={"bottom"}>
        <Player />
      </div>
    </div>
  )
}

export default React.memo(Home)
