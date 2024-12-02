import React, { useEffect, useRef, useState } from 'react'

const SafeComponent: React.FC = () => {
  const componentRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('设置定时器...')
    const intervalId = setInterval(() => {
      console.log('定时器执行中...')
      setCount(c => c + 1)
    }, 1000)

    // 保存清理函数
    cleanupRef.current = () => {
      console.log('执行清理工作：清除定时器')
      clearInterval(intervalId)
    }

    // 监听组件是否被从DOM中移除
    const observer = new MutationObserver(() => {
      if (!document.contains(componentRef.current)) {
        console.log('检测到组件被移除，执行清理工作')
        cleanupRef.current?.()
        observer.disconnect()
      }
    })

    // 观察整个document
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      cleanupRef.current?.()
      observer.disconnect()
    }
  }, [])

  return (
    <div className="safe-component" ref={componentRef}>
      <h2>计数器：{count}</h2>
      <p>这是一个带有定时器的组件</p>
      <p>即使被外部强制删除DOM，也能正确清理定时器</p>
      <p>请打开控制台查看日志</p>
    </div>
  )
}

export default SafeComponent
