import React from "react"
import { renderRoutes, RouteConfigComponentProps } from "react-router-config"

const Layout: React.FunctionComponent<RouteConfigComponentProps<{}>> = ({
  // eslint-disable-next-line react/prop-types
  route = null,
}): JSX.Element => {
  if (route === null) {
    return <></>
  }
  let render = renderRoutes(route.routes)
  return <>{render}</>
}

export default Layout
