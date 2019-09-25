/**
 * Format the time from seconds to M:SS.
 * @param  {Number} secs Seconds to format.
 * @return {String}      Formatted time.
 */
export function formatTime(secs: number) {
  var minutes = Math.floor(secs / 60) || 0
  var seconds = secs - minutes * 60 || 0

  return minutes + ":" + (seconds < 10 ? "0" : "") + Math.floor(seconds)
}
