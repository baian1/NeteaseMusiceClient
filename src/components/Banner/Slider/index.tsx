import React, { useEffect, useState } from "react"
import "swiper/dist/css/swiper.min.css"
import "./style/index.less"
import Swiper from "swiper"

interface ImgList {
  imageUrl: string
}

interface P {
  bannerList: ImgList[]
}

const Slider: React.FunctionComponent<P> = props => {
  const [sliderSwiper, setSliderSwiper] = useState<Swiper | null>(null)
  const { bannerList } = props

  useEffect(() => {
    if (bannerList.length && !sliderSwiper) {
      let sliderSwiper = new Swiper(".slider-container", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        },
        loop: true,
        autoplay: true,
        // navigation: {
        //   nextEl: ".swiper-button-next",
        //   prevEl: ".swiper-button-prev",
        // },
        pagination: {
          el: ".swiper-pagination",
        },
      })
      setSliderSwiper(sliderSwiper)
    }
  }, [bannerList.length, sliderSwiper])

  return (
    <div className="slider-container">
      <div className="swiper-wrapper">
        {bannerList.map((slider, index) => {
          return (
            <div className="swiper-slide" key={index}>
              <img
                src={slider.imageUrl}
                width="100%"
                height="100%"
                alt="推荐"
              />
            </div>
          )
        })}
      </div>
      <div className="swiper-pagination"></div>
      {/* <div className="swiper-button-next"></div>
      <div className="swiper-button-prev"></div> */}
    </div>
  )
}

export default React.memo(Slider)
