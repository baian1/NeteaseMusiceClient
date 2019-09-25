import { Howl, Howler } from "howler"
import { Song } from "./interface/Player.interface"

interface PlayerInterface {
  play(index?: number): void
  pause(): void
  skip(derection: "next" | "prev"): void
  skipTo(index: number): void
  volume(val: number): void
  seek(per: number): void
}

interface HowlSong extends Song {
  howl: Howl
  src: string
}

export class Player implements PlayerInterface {
  private playlist: HowlSong[]
  private index: number
  public constructor(playlist: HowlSong[]) {
    this.playlist = playlist
    this.index = -1
  }

  /**
   * Play a song in the playlist.
   * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
   */
  public play(index?: number) {
    const self = this
    let sound: Howl

    index = typeof index === "number" ? index : self.index
    const data = self.playlist[index]

    if (data.howl) {
      sound = data.howl
    } else {
      sound = data.howl = new Howl({
        src: [data.src],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
      })
    }

    sound.play()

    self.index = index
  }

  /**
   * Pause the currently playing track.
   */
  public pause() {
    var self = this

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl

    // Puase the sound.
    sound.pause()
  }

  /**
   * Skip to the next or previous track.
   * @param  {String} direction 'next' or 'prev'.
   */
  public skip(direction: "next" | "prev") {
    const self = this
    // Get the next track based on the direction of the track.
    let index = 0
    if (direction === "prev") {
      index = self.index - 1
      if (index < 0) {
        index = self.playlist.length - 1
      }
    } else {
      index = self.index + 1
      if (index >= self.playlist.length) {
        index = 0
      }
    }

    self.skipTo(index)
  }

  /**
   * Skip to a specific track based on its playlist index.
   * @param  {Number} index Index in the playlist.
   */
  public skipTo(index: number) {
    var self = this

    // Stop the current track.
    if (self.playlist[self.index].howl) {
      self.playlist[self.index].howl.stop()
    }

    // Play the new track.
    self.play(index)
  }

  /**
   * Set the volume and update the volume slider display.
   * @param  {Number} val Volume between 0 and 1.
   */
  public volume(val: number) {
    // Update the global volume (affecting all Howls).
    Howler.volume(val)
  }

  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} per Percentage through the song to skip.
   */
  public seek(per: number) {
    const self = this

    // Get the Howl we want to manipulate.
    const sound = self.playlist[self.index].howl

    // Convert the percent into a seek position.
    if (sound.playing()) {
      sound.seek(sound.duration() * per)
    }
  }
}

export class Instance {
  private static instance: Player | null
  public static getInstance() {
    if (this.instance === null) {
      this.instance = new Player([])
    }
    return this.instance
  }
}
