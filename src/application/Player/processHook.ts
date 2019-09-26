import { useRef, useEffect } from "react"

export function useProcess() {
  const pointRef = useRef<HTMLDivElement>(null)
  const mouseRangeRef = useRef<HTMLDivElement>(null)
  const processCurrentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (pointRef.current === null || mouseRangeRef.current === null) {
      return
    }

    const pointEle = pointRef.current
    const mouseRangeEle = mouseRangeRef.current

    //进度条拖动状态
    let isActive = false
    const changeAvticeStatus = (event: MouseEvent) => {
      switch (event.type) {
        case "mousedown": {
          isActive = true
          break
        }
        case "mouseup": {
          isActive = false
          break
        }
      }
    }
    pointEle.addEventListener("mousedown", changeAvticeStatus)
    document.addEventListener("mouseup", changeAvticeStatus)

    const mouseMove = (event: MouseEvent) => {
      const processCurrentEle = processCurrentRef.current
      if (!processCurrentEle || !processCurrentEle.parentElement) {
        return
      }
      const max = processCurrentEle.parentElement.clientWidth
      if (isActive) {
        let offsetX = (event.x - 247) / max
        if (offsetX > 1) {
          offsetX = 1
        } else if (offsetX < 0) {
          offsetX = 0
        }

        processCurrentEle.style.width = offsetX * 100 + "%"
        ;(pointRef.current as HTMLDivElement).style.left = offsetX * 100 + "%"
      }
    }

    mouseRangeEle.addEventListener("mousemove", mouseMove)
    return () => {
      pointEle.removeEventListener("mousedown", changeAvticeStatus)
      document.removeEventListener("mouseup", changeAvticeStatus)
      mouseRangeEle.removeEventListener("mousemove", mouseMove)
    }
  }, [pointRef, mouseRangeRef])
  return {
    pointRef,
    mouseRangeRef,
    processCurrentRef,
  }
}
