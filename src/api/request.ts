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

export interface PlayListInterface {
  name: "倾听自然 · 海之遐想"
  id: 819618896
  trackNumberUpdateTime: 1500653698798
  status: 0
  userId: 74029445
  createTime: 1500645772497
  updateTime: 1501830786534
  subscribedCount: 387290
  trackCount: 163
  cloudTrackCount: 0
  coverImgUrl: "http://p1.music.126.net/gA6MMdcY7WRNm0bs3W4E7w==/18651015743968707.jpg"
  coverImgId: 18651015743968708
  description: "在夜晚，在梦中，听一曲海声，独享一份内心的平静。海水或是沙沙翻涌，或是汩汩流动，这里时而有悠闲的鸟鸣，时而有海豚的细语。无论是曾经历过大海的朋友，还是已然遗忘了大海的朋友，愿这些音乐带给你一份独特的视角，感受这颗湛蓝星球上大海的魅力。\n\n分段：\n\n第一部分：1~136：以海的声音作为背景，并配以钢琴，或是少量的吉他、提琴或竖琴构成的音乐，而鼓等节奏乐器没有被使用。在排列方式上，除了Dan Gibson收录的作品较多，按表现力度分为三个部分之外，其余曲目均按艺术家排列。总体来说是按表现张力逐渐加大排列的，第一部分的最后曲目带有少量氛围音乐的特征。\n\n第二部分：137~163：纯粹的海声，属于自然录音。大致是按从平静到喧闹排列的。\n\n封面PID=62832812，来自画师tofuvi。\n\n更新日志：\n7.1：由Dan Gibson的《Seaside Retreat》起源；\n7.2：艺术家目录收集完成，共135位。\n7.3~7.20：收听这些艺术家的全部作品。\n7.21：整理排序，发布。\n\n花絮：\n1.制作这张歌单是从Dan Gibson的部分作品起源的，而且他作为一位自然录音大师，这方面的作品也是浩如烟海，这使得这张歌单里收录的他的作品比重很大（选自31张专辑的65首作品）。\n2.在本次歌单制作考察的另一些艺术家，例如David Arkenstone或者Enigma，他们不一定喜好用这种自然音效+乐器演奏的方式制作音乐，有一些艺术家诠释自己想表达的海洋就只用钢琴独奏的方式，而没有使用任何的背景音效。这次为了使得听众更加容易找到身临其境的感觉，就没有使用这些作品了。\n3.制作这张歌单大致收听了800~1000张专辑。由于选曲的要求，使得在实际收听时出现或是一整张专辑都没有任何一首需要的，或是一整张专辑完全是符合需要的（这时我一般选择其中较好的几首，除非这张专辑的曲目非常的平衡和稳定）。\n4.第一部分时长大约14.5小时，第二部分大约10小时。\n\n祝您欣赏愉快！"
  tags: ["轻音乐", "夜晚", "放松"]
  playCount: 15891369
  trackUpdateTime: 1561784397965
  specialType: 0
  totalDuration: 0
  creator: {
    defaultAvatar: false
    province: 1000000
    authStatus: 0
    followed: false
    avatarUrl: "http://p1.music.126.net/dAnS5MyaGp9H46mr3_nKRw==/109951164232671436.jpg"
    accountStatus: 0
    gender: 0
    city: 1010000
    birthday: 888681600000
    userId: 74029445
    userType: 200
    nickname: "xept"
    signature: "最终留下的，只有清风与明月"
    description: ""
    detailDescription: ""
    avatarImgId: 109951164232671440
    backgroundImgId: 109951164370434780
    backgroundUrl: "http://p1.music.126.net/RPsYp7_ApmJX6B_Oxlvt6g==/109951164370434777.jpg"
    authority: 0
    mutual: false
    expertTags: ["日语", "轻音乐", "欧美"]
    experts: null
    djStatus: 10
    vipType: 11
    remarkName: null
    avatarImgIdStr: "109951164232671436"
    backgroundImgIdStr: "109951164370434777"
    avatarImgId_str: "109951164232671436"
  }
  tracks: null
  subscribers: [
    {
      defaultAvatar: false
      province: 320000
      authStatus: 0
      followed: false
      avatarUrl: "http://p1.music.126.net/Fkf9bDXRp85pReKh1SXT5g==/109951163619330063.jpg"
      accountStatus: 0
      gender: 1
      city: 321000
      birthday: 948643200000
      userId: 1301395390
      userType: 0
      nickname: "Snape-Always"
      signature: "白茶清欢无别事，我在等风也等你。"
      description: ""
      detailDescription: ""
      avatarImgId: 109951163619330060
      backgroundImgId: 109951164032341060
      backgroundUrl: "http://p1.music.126.net/CHxO6ybKmQsOHr9ALijCSA==/109951164032341053.jpg"
      authority: 0
      mutual: false
      expertTags: null
      experts: null
      djStatus: 0
      vipType: 0
      remarkName: null
      avatarImgIdStr: "109951163619330063"
      backgroundImgIdStr: "109951164032341053"
      avatarImgId_str: "109951163619330063"
    }
  ]
  subscribed: null
  commentThreadId: "A_PL_0_819618896"
  newImported: false
  adType: 0
  highQuality: true
  privacy: 0
  ordered: true
  anonimous: false
  coverStatus: 3
  shareCount: 8668
  coverImgId_str: "18651015743968707"
  commentCount: 1644
  copywriter: "用一曲海声换一份内心的平静"
  tag: "轻音乐"
}

interface GetPlayListsRes {
  playlists: PlayListInterface[]
  code: 200
  more: true
  lasttime: 1501830786534
  total: 290
}

export const getPlayLists = (offset: number, limit: number, cat?: string) => {
  return axiosInstance.get<GetPlayListsRes>(`/top/playlist`, {
    params: {
      offset,
      limit,
      cat: cat ? cat : "全部歌单",
    },
  })
}
