import { useRef, useEffect, useMemo } from "react"

interface Handle {
  (progress: number): void
}

export function useProgress({
  mouseMove: onMouseMove,
  mouseUp: onMouseUp,
  mouseDown: onMousedown,
}: {
  mouseMove: Handle
  mouseUp: Handle
  mouseDown: Handle
}) {
  //需要用到的dom元素
  const pointRef = useRef<HTMLDivElement>(null)
  const progressCurrentRef = useRef<HTMLDivElement>(null)
  const progressWrapRef = useRef<HTMLDivElement>(null)

  //进度条的活动状态
  const isActive = useRef(false)

  /**
   * 确定进度条位置和长度
   * 用来计算进度百分比
   * 触发情况(待改进):
   * 1. 首次加载的时候(删除)
   * 2. 在点击进度条和point时
   * 3. resize窗口的时候(删除)
   *
   * 理由：
   * 只有在我们拖动的时候才需要这个数据进行位置计算，获得进度条百分比，以此来控制进度条
   */
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

  useEffect(() => {
    setMaxAndLeft()
  }, [setMaxAndLeft])

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
  const transformEventXToProgress = useMemo(
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

  //点击进度条
  useEffect(() => {
    if (!progressWrapRef.current) {
      return
    }
    let ele = progressWrapRef.current
    function handle(event: MouseEvent) {
      setMaxAndLeft()
      const offsetX = transformEventXToProgress(event.x)
      setProgress(offsetX)
      onMousedown(offsetX)
      isActive.current = true
    }
    ele.addEventListener("mousedown", handle)
    return () => {
      ele.removeEventListener("mousedown", handle)
    }
  }, [transformEventXToProgress, onMousedown, setProgress, setMaxAndLeft])

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
          isActive.current = true
          setMaxAndLeft()
          event.stopPropagation()
          break
        }
        case "mouseup": {
          if (isActive.current) {
            onMouseUp(transformEventXToProgress(event.x))
          }
          isActive.current = false
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
  }, [transformEventXToProgress, onMouseUp, setMaxAndLeft])

  //滑块拖动进行时
  useEffect(() => {
    const mouseRangeEle = document
    const mouseMove = (event: MouseEvent) => {
      let offsetX = transformEventXToProgress(event.x)
      if (!isActive.current) {
        return
      }
      onMouseMove(offsetX)
      setProgress(offsetX)
    }

    mouseRangeEle.addEventListener("mousemove", mouseMove)
    return () => {
      mouseRangeEle.removeEventListener("mousemove", mouseMove)
    }
  }, [transformEventXToProgress, onMouseMove, setProgress])

  return {
    pointRef,
    progressCurrentRef,
    progressWrapRef,
    setProgressInidle: (offset: number) => {
      if (isActive.current === false) {
        setProgress(offset)
      }
    },
  }
}
