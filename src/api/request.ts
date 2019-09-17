import { axiosInstance } from "./config"

export interface BannerInterface {
  imageUrl: string
}

interface BannerRes {
  banners: BannerInterface[]
  code: number
}

export const getBannerRequest = () => {
  return axiosInstance.get<BannerRes>("/banner")
}

export interface RecommendInterface {
  id: number
  type: number
  name: string
  copywriter: string
  picUrl: string
  canDislike: boolean
  playCount: number
  trackCount: number
  highQuality: boolean
  alg: string
}

interface RecommendRes {
  hasTaste: boolean
  code: number
  category: number
  result: RecommendInterface[]
}

export const getRecommendListRequest = () => {
  return axiosInstance.get<RecommendRes>("/personalized?limit=10")
}
