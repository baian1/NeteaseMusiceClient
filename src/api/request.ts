import { axiosInstance } from "./config"
import { Song } from "@/application/Player/interface/Player.interface"

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

export interface CategoryInterface {
  name: string
  resourceCount: number
  imgId: number
  imgUrl: string | null
  type: number
  category: number
  resourceType: number
  hot: boolean
  activity: boolean
}
interface GetCategorylistsRes {
  all: CategoryInterface
  sub: CategoryInterface[]
}
export const getCategorylists = () => {
  return axiosInstance.get<GetCategorylistsRes>("/playlist/catlist")
}

interface UserInformation {
  defaultAvatar: boolean
  province: number
  authStatus: number
  followed: boolean
  avatarUrl: string
  accountStatus: number
  gender: number
  city: number
  birthday: number
  userId: number
  userType: number
  nickname: string
  signature: string
  description: string
  detailDescription: string
  avatarImgId: number
  backgroundImgId: number
  backgroundUrl: string
  authority: number
  mutual: boolean
  expertTags: string[] | null
  experts: null
  djStatus: number
  vipType: number
  remarkName: null
  avatarImgIdStr: string
  backgroundImgIdStr: string
  avatarImgId_str: string
}

export interface PlayListInterface {
  name: string
  id: number
  trackNumberUpdateTime: number
  status: number
  userId: number
  createTime: number
  updateTime: number
  subscribedCount: number
  trackCount: number
  cloudTrackCount: number
  coverImgUrl: string
  coverImgId: number
  description: string
  tags: string[]
  playCount: number
  trackUpdateTime: number
  specialType: number
  totalDuration: number
  creator: UserInformation
  tracks: null
  subscribers: UserInformation[]
  subscribed: null
  commentThreadId: string
  newImported: boolean
  adType: number
  highQuality: boolean
  privacy: number
  ordered: boolean
  anonimous: boolean
  coverStatus: number
  shareCount: number
  coverImgId_str: string
  commentCount: number
  copywriter: string
  tag: string
}

interface GetPlayListsRes {
  playlists: PlayListInterface[]
  code: number
  more: boolean
  lasttime: number
  total: number
}
/**
 * 根据类别获得歌单
 * @param offset
 * @param limit
 * @param cat
 */
export const getPlayListsFromCat = (
  offset: number,
  limit: number,
  cat?: string
) => {
  return axiosInstance.get<GetPlayListsRes>(`/top/playlist`, {
    params: {
      offset,
      limit,
      cat: cat ? cat : "",
    },
  })
}

interface Size {
  br: number
  fid: number
  size: number
  vd: number
}
export interface Play {
  name: string
  id: number
  pst: number
  t: number
  ar: [
    {
      id: number
      name: string
      tns: []
      alias: []
    }
  ]
  alia: []
  pop: number
  st: number
  rt: null
  fee: number
  v: number
  crbt: null
  cf: string
  al: {
    id: number
    name: string
    picUrl: string
    tns: []
    pic_str: string
    pic: number
  }
  dt: number
  h: Size
  m: Size
  l: Size
  a: null
  cd: string
  no: number
  rtUrl: null
  ftype: number
  rtUrls: []
  djId: number
  copyright: number
  s_id: number
  mark: number
  rtype: number
  rurl: null
  mst: number
  cp: number
  mv: number
  publishTime: number
}
interface PlayListDetailInterface {
  code: number
  relatedVideos: null
  playlist: {
    subscribers: []
    subscribed: boolean
    creator: UserInformation
    tracks: Play[]
    trackIds: {
      id: number
      v: number
      alg: null | string
    }[]
  }
}
/**
 * 根据id获取歌曲详情
 * @param ids
 */
export const getSongDetail = (ids: number[]) => {
  return axiosInstance.get<{
    code: number
    songs: Play[]
  }>("/song/detail", {
    params: {
      ids: ids.join(","),
    },
  })
}

/**
 * 根据歌单id获取歌单详情
 * @param id
 */
export const getPlayListsDetail = async (id: number) => {
  let res = await axiosInstance.get<PlayListDetailInterface>(
    "/playlist/detail",
    {
      params: {
        id,
      },
    }
  )
  let ids = res.data.playlist.trackIds.map(item => item.id)
  return getSongDetail(ids)
}
