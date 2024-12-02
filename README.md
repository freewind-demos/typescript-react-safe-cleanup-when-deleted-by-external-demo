# React组件安全清理演示

这个项目演示了如何确保React组件在被外部强制删除DOM节点时，仍然能够正确执行清理代码。

## 问题背景

在React应用中，当组件正常卸载时（如通过条件渲染或路由切换），React会自动执行 `useEffect` 中的清理函数。但是，如果组件的DOM节点被外部代码强制删除（如 `element.remove()`），React的生命周期钩子将不会被触发，导致清理代码无法执行。这可能会造成：

- 内存泄漏
- 定时器继续运行
- 网络连接未断开
- 事件监听器未移除
- 等其他资源未能正确释放的问题

## 解决方案

本项目展示了一个优雅的解决方案：

1. 使用 `MutationObserver` 监听DOM变化
2. 当检测到组件节点被移除时，手动执行清理代码
3. 使用 `useRef` 保存清理函数，确保能在任何时候访问到最新的清理函数

## 关键代码

```typescript
const cleanupRef = useRef<(() => void) | null>(null)

// 保存清理函数
cleanupRef.current = () => {
  clearInterval(intervalId)
}

// 监听组件是否被从DOM中移除
const observer = new MutationObserver(() => {
  if (!document.contains(componentRef.current)) {
    cleanupRef.current?.()
    observer.disconnect()
  }
})
```

## 运行项目

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run start
   ```

3. 打开浏览器，访问 http://localhost:5173

## 使用说明

1. 打开浏览器控制台，观察日志输出
2. 页面上会显示一个计数器，每秒递增
3. 点击"从外部删除组件"按钮，模拟外部代码强制删除DOM节点
4. 观察控制台日志，可以看到：
   - 清理函数被正确执行
   - 定时器被清除
   - MutationObserver 被断开连接

## 结论

通过这个演示，我们可以看到：

1. React的生命周期钩子在组件被外部删除时是不可靠的
2. 使用 MutationObserver 可以可靠地检测到DOM节点的移除
3. 通过这种方式，我们可以确保组件的资源总是被正确清理，避免内存泄漏

这个解决方案适用于任何需要在组件卸载时进行清理的场景，特别是在不能完全控制DOM操作的复杂应用中。
