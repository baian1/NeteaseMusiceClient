import React from "react"
import "./style/index.less"
import "../../assets/iconfont/iconfont.less"
import "../../assets/iconfont2/iconfont2.less"
import { NavLink, withRouter } from "react-router-dom"
import { useNav } from "./hook"
import { History } from "history"
import Menu from "./Menu"
import Mymusic from "./Mymusic"
import SongLists from "./SongLists"

const Nav: React.FunctionComponent<{
  history: History
}> = ({ history }) => {
  //略缩/详情
  const [isListHidden, setListHidden] = React.useState(false)
  const changeListMode = React.useMemo(() => {
    return () => {
      setListHidden(mode => {
        return !mode
      })
    }
  }, [setListHidden])

  const { nav, setActive } = useNav()
  React.useEffect(() => {
    let remove = history.listen(location => {
      setActive(location.pathname)
    })
    return () => {
      remove()
    }
  }, [])
  React.useEffect(() => {
    setActive(location.pathname)
  }, [])

  return (
    <nav className={`nav-wrap ${isListHidden ? "nav-wrap-hidden" : ""}`}>
      <div className="show-hidden" onClick={changeListMode}>
        <i className={"iconfont icon-caidan"}></i>
      </div>
      <div className={"nav"}>
        <Menu
          mode={isListHidden ? "thumbnails" : "details"}
          data={nav.menuNav}
          show={
            <li onClick={changeListMode}>
              <div className={"item"}>
                <i className={"iconfont icon-doubleright"}></i>
              </div>
            </li>
          }
        />
        {isListHidden ? null : (
          <>
            <Mymusic data={nav.myMusicNav} />
            <SongLists data={nav.songListsNav} />
          </>
        )}
      </div>
      <div className={"user-information"}></div>
    </nav>
  )
}

export default withRouter(Nav)
