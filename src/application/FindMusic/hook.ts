import { useState, useRef, useMemo, useEffect } from "react"
import PlayList from "../Playlist"
import Personalized from "../Personalized"
import Blank from "@/components/Blank"

export const navNameArr = ["个性推荐", "歌单", "最新音乐", "歌手"] as const
export type navName = typeof navNameArr[number]
interface NavType {
  name: navName
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

const navMap = {
  个性推荐: 0,
  歌单: 1,
  最新音乐: 2,
  歌手: 3,
} as const

export function isNavName(str: string): str is navName {
  let is = false
  for (let i of navNameArr) {
    if (i === str) {
      is = true
      break
    }
  }
  return is
}

export function useNav() {
  const [nav, setNav] = useState(navs)
  const content = useRef<React.FunctionComponent>(Personalized)
  const isActive = useRef(navs[0])

  const setActive = useMemo(
    () =>
      function(name: navName) {
        setNav((nav): NavType[] => {
          isActive.current.active = false
          isActive.current = nav[navMap[name]]
          isActive.current.active = true

          content.current = isActive.current.component
            ? isActive.current.component
            : Blank

          return [...nav]
        })
      },
    []
  )
  useEffect(() => {
    return () => {
      for (let i of navs) {
        i.active = false
      }
      navs[0].active = true
    }
  }, [])

  return [nav, content.current, setActive] as const
}
