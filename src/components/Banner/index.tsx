import React from "react"
import Slider from "./Slider"
import { BannerInterface } from "@/api/request"

const prefix = "Banner"

interface P {
  bannerList: BannerInterface[]
}

function Banner({ bannerList }: P) {
  return (
    <div style={{ overflow: "hidden", flex: "0 0 auto" }}>
      <div style={{ width: "50%", margin: "0 auto" }}>
        <Slider bannerList={bannerList}></Slider>
      </div>
    </div>
  )
}

export default React.memo(Banner)
