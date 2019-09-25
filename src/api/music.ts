import { axiosInstance } from "./config"

interface Song {
  data: [
    {
      id: number
      url: string
      br: number
      size: number
      md5: string
      code: number
      expi: number
      type: string
      gain: number
      fee: number
      uf: null
      payed: number
      flag: number
      canExtend: boolean
      freeTrialInfo: null
      level: string
      encodeType: string
    }
  ]
  code: number
}

export const getSongSrc = (id: number) => {
  return axiosInstance.get<Song>("/song/url", {
    params: {
      id,
    },
  })
}
