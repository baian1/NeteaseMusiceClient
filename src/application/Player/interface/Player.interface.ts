interface Artist {
  id: number
  name: string
  picUrl: null | string
  alias: string[]
  albumSize: number
  picId: number
  img1v1Url: string
  img1v1: number
  trans: null
}

interface Album {
  id: number
  name: string
  artist: Artist
  publishTime: number
  size: number
  copyrightId: number
  status: number
  picId: number
  mark: number
}

export interface Song {
  id: number
  name: string
  artists: Artist[]
  album: Album
  duration: number
  copyrightId: number
  status: number
  alias: string[]
  rtype: number
  ftype: number
  mvid: number
  fee: number
  rUrl: null | string
  mark: number
}

export enum playMode {
  sequence = 0,
  loop,
  random,
}
