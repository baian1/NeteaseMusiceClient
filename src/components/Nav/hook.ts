import React from "react"

export interface NavData {
  icon: string
  name: string
  path: string
  active: boolean
}

interface NavState {
  menuNav: NavData[]
  myMusicNav: NavData[]
  songListsNav: NavData[]
}
interface NavAction {
  type: "SET_NAV_ACTIVE"
  payload: {
    path: string
  }
}

function navReducer(prevState: NavState, action: NavAction) {
  let isChange = false
  switch (action.type) {
    case "SET_NAV_ACTIVE":
      for (let i of Reflect.ownKeys(prevState)) {
        switch (i) {
          case "menuNav":
          case "myMusicNav":
          case "songListsNav":
            prevState[i].forEach(item => {
              if (item.path === action.payload.path) {
                if (item.active !== true) {
                  isChange = true
                }
                item.active = true
              } else {
                item.active = false
              }
            })
            break
          default:
        }
      }
      break
    default:
  }
  return isChange ? { ...prevState } : prevState
}

//Menu Nav
const menuNav: NavData[] = [
  {
    icon: "iconfont icon-41",
    name: "搜索",
    path: "/home/search",
    active: false,
  },
  {
    icon: "iconfont icon-icon-",
    name: "发现音乐",
    path: "/home/findmusic",
    active: false,
  },
  {
    icon: "iconfont icon-shipinbofangyingpian",
    name: "MV",
    path: "/home/mv",
    active: false,
  },
  {
    icon: "iconfont2 icon-team",
    name: "朋友",
    path: "/home/frends",
    active: false,
  },
]

//My music Nav
const myMusicNav: NavData[] = [
  {
    icon: "iconfont icon-zuijinbofang",
    name: "最近播放",
    path: "/mymusic/frends",
    active: false,
  },
  {
    icon: "iconfont2 icon-cloud",
    name: "我的音乐云盘",
    path: "/mymusic/frends",
    active: false,
  },
  {
    icon: "iconfont icon-shipinbofangyingpian",
    name: "我的电台",
    path: "/mymusic/frends",
    active: false,
  },
  {
    icon: "iconfont2 icon-folder-add",
    name: "我的收藏",
    path: "/mymusic/frends",
    active: false,
  },
]

//Song List
const songListsNav: NavData[] = [
  {
    icon: "iconfont icon-liebiao",
    name: "歌单1",
    path: "/mymusic/frends",
    active: false,
  },
  {
    icon: "iconfont icon-liebiao",
    name: "歌单2",
    path: "/mymusic/frends",
    active: false,
  },
  {
    icon: "iconfont icon-liebiao",
    name: "歌单3",
    path: "/mymusic/frends",
    active: false,
  },
]

export function useNav() {
  const [nav, navDispatch] = React.useReducer(navReducer, {
    menuNav,
    myMusicNav,
    songListsNav,
  })
  const setActive = React.useMemo(() => {
    return (path: string) => {
      navDispatch({
        type: "SET_NAV_ACTIVE",
        payload: {
          path: path,
        },
      })
    }
  }, [navDispatch])
  return { nav, setActive }
}
