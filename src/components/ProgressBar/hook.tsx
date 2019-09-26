import { useRef, useEffect, useMemo, useState } from "react"

interface handle {
  (progress: number): void
}

export function useProcess({
  mouseMove: onMouseMove,
  mouseUp: onMouseUp,
  mousedown: onMousedown,
}: {
  mouseMove: handle
  mouseUp: handle
  mousedown: handle
}) {
  const [isActive, setActive] = useState(false)

  const pointRef = useRef<HTMLDivElement>(null)
  const progressCurrentRef = useRef<HTMLDivElement>(null)
  const progressWrapRef = useRef<HTMLDivElement>(null)

  const max = useRef(0)
  const left = useRef(0)
  const setMaxAndLeft = useMemo(
    () => () => {
      const processCurrentEle = progressCurrentRef.current
      if (!processCurrentEle || !processCurrentEle.parentElement) {
        return
      }
      max.current = processCurrentEle.parentElement.clientWidth
      left.current = processCurrentEle.getBoundingClientRect().left
    },
    []
  )

  /**
   * 通过百分比来设置进度条
   */
  const setProgress = useMemo(() => {
    return (offsetX: number) => {
      const processCurrentEle = progressCurrentRef.current
      if (!processCurrentEle || !processCurrentEle.parentElement) {
        return
      }
      processCurrentEle.style.width = offsetX * 100 + "%"
      ;(pointRef.current as HTMLDivElement).style.left = offsetX * 100 + "%"
    }
  }, [])

  /**
   * 获得进度百分比
   */
  const getProgress = useMemo(
    () =>
      function getX(x: number) {
        let offsetX = (x - left.current) / max.current
        if (offsetX > 1) {
          offsetX = 1
        } else if (offsetX < 0) {
          offsetX = 0
        }
        return offsetX
      },
    []
  )

  useEffect(() => {
    if (!progressWrapRef.current) {
      return
    }
    let ele = progressWrapRef.current
    ele.addEventListener("mousedown", event => {
      let offsetX = getProgress(event.x)
      setProgress(offsetX)
      setActive(true)
    })
  }, [getProgress, setProgress])

  useEffect(() => {
    window.addEventListener("resize", setMaxAndLeft)
    return () => {
      window.removeEventListener("resize", setMaxAndLeft)
    }
  }, [setMaxAndLeft])
  useEffect(() => {
    setMaxAndLeft()
  }, [setMaxAndLeft])

  //滑块的拖动状态
  useEffect(() => {
    if (pointRef.current === null || progressCurrentRef.current === null) {
      return
    }
    const pointEle = pointRef.current
    //进度条拖动状态
    const changeAvticeStatus = (event: MouseEvent) => {
      switch (event.type) {
        case "mousedown": {
          setActive(true)
          setMaxAndLeft()
          event.stopPropagation()
          break
        }
        case "mouseup": {
          setActive(false)
          onMouseUp(getProgress(event.x))
          break
        }
      }
    }
    pointEle.addEventListener("mousedown", changeAvticeStatus)
    document.addEventListener("mouseup", changeAvticeStatus)
    return () => {
      pointEle.removeEventListener("mousedown", changeAvticeStatus)
      document.removeEventListener("mouseup", changeAvticeStatus)
    }
  }, [getProgress, onMouseUp, setMaxAndLeft])

  //滑块拖动进行时
  useEffect(() => {
    const mouseRangeEle = document
    const mouseMove = (event: MouseEvent) => {
      let offsetX = getProgress(event.x)
      if (!isActive) {
        return
      }
      onMouseMove(offsetX)
      setProgress(offsetX)
    }

    mouseRangeEle.addEventListener("mousemove", mouseMove)
    return () => {
      mouseRangeEle.removeEventListener("mousemove", mouseMove)
    }
  }, [getProgress, isActive, onMouseMove, setProgress])

  return {
    pointRef,
    progressCurrentRef,
    progressWrapRef,
  }
}
