import React from "react"
import { useProcess as useProgress } from "./hook"
import "./style/index.less"

interface P {
  mousedown?: (progress: number) => void
  mouseUp?: (progress: number) => void
  mouseMove?: (progress: number) => void
}

const prefix = "ProgressBar"
const ProgressBar: React.FC<P> = ({
  mouseMove = () => {},
  mouseUp = () => {},
  mousedown = () => {},
}) => {
  const progress = useProgress({
    mouseMove,
    mouseUp,
    mousedown,
  })
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
