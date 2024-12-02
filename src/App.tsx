import React from 'react'
import SafeComponent from './components/SafeComponent'

const App: React.FC = () => {
  const handleExternalDelete = () => {
    const element = document.querySelector('.safe-component')
    if (element) element.remove()
  }

  return (
    <div>
      <h1>React组件安全清理演示</h1>
      <button onClick={handleExternalDelete}>
        从外部删除组件
      </button>
      <SafeComponent />
    </div>
  )
}

export default App
