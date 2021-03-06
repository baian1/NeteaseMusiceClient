import React from "react"
import BlankLayout from "../layouts/BlankLayout"
import HomeLayout from "../layouts/HomeLayout"
import { RouteConfig, RouteConfigComponentProps } from "react-router-config"
import Search from "../application/Search"
import FindMusic from "../application/FindMusic"

const routes: RouteConfig[] = [
  {
    path: "/",
    component: BlankLayout,
    routes: [
      {
        path: "/home",
        component: HomeLayout,
        routes: [
          {
            path: "/home/search",
            component: Search,
          },
          {
            path: "/home/findmusic",
            component: FindMusic,
          },
        ],
      },
      {
        path: "/songList",
        component: HomeLayout,
        routes: [
          {
            path: "/songList/:id",
          },
        ],
      },
    ],
  },
]

export default routes
