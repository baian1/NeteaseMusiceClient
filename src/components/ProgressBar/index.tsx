import React from "react"
import { useProgress } from "./hook"
import "./style/index.less"

interface P {
  mouseDown?: (progress: number) => void
  mouseUp?: (progress: number) => void
  mouseMove?: (progress: number) => void
  controlerRef?: React.MutableRefObject<(offset: number) => void>
}

const prefix = "ProgressBar"
const ProgressBar: React.FC<P> = ({
  mouseMove = () => {},
  mouseUp = () => {},
  mouseDown = () => {},
  controlerRef,
}) => {
  const progress = useProgress({
    mouseMove,
    mouseUp,
    mouseDown,
  })
  if (controlerRef) {
    controlerRef.current = progress.setProgressInidle
  }
  return (
    <div className={`${prefix}-wrap`} ref={progress.progressWrapRef}>
      <div className={`process`}>
        <div className={`current-time`} ref={progress.progressCurrentRef}>
          <div className={`point-slider`} ref={progress.pointRef}>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
