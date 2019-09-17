import { useState, useRef } from "react"
import PlayList from "../Playlist"
import Personalized from "../Personalized"
import Blank from "@/components/Blank"

interface NavType {
  name: string
  active: boolean
  component?: React.FunctionComponent
}
const navs: NavType[] = [
  {
    name: "个性推荐",
    component: Personalized,
    active: true,
  },
  {
    name: "歌单",
    component: PlayList,
    active: false,
  },
  {
    name: "最新音乐",
    active: false,
  },
  {
    name: "歌手",
    active: false,
  },
]

export function useNav() {
  const [nav, setNav] = useState(navs)
  const content = useRef<React.FunctionComponent>(Personalized)

  const setActive = function(name: string) {
    setNav((nav): NavType[] => {
      nav.forEach(item => {
        if (item.name !== name) {
          item.active = false
        } else {
          item.active = true
          content.current = item.component ? item.component : Blank
        }
      })
      return [...nav]
    })
  }

  return [nav, content.current, setActive] as const
}
