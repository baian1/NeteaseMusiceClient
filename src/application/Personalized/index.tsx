import React, { ReactNode } from "react"
import Banner from "../../components/Banner"
import "./style/index.less"
import Recommend from "../../components/Recommend"
import {
  getBannerRequest,
  BannerInterface,
  getRecommendListRequest,
  RecommendInterface,
} from "@/api/request"

const Personalized: React.FunctionComponent<{}> = () => {
  const [bannerList, setBannerList] = React.useState<BannerInterface[]>([])
  const [recommendList, setRecommendList] = React.useState<
    RecommendInterface[]
  >([])

  React.useEffect(() => {
    getBannerRequest()
      .then(res => res.data.banners)
      .then(data => {
        setBannerList(data)
      })

    getRecommendListRequest()
      .then(res => {
        return res.data.result
      })
      .then(data => {
        setRecommendList(data)
      })
  }, [])

  return (
    <>
      <Banner bannerList={bannerList} />
      <Recommend recommendList={recommendList} />
    </>
  )
}

export default Personalized
