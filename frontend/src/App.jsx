import { useState, useEffect } from 'react'
import { getTypes, postFortune } from './api'
import SiteHeader from './components/SiteHeader'
import TypeSelector from './components/TypeSelector'
import ViewPanel from './components/ViewPanel'

export default function App() {
  const [types, setTypes] = useState([])
  const [currentViewId, setCurrentViewId] = useState(null)
  const [exitingId, setExitingId] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getTypes()
      .then((ts) => {
        setTypes(ts)
        setCurrentViewId(ts[0].id)
      })
      .catch(() => setError('无法连接本地服务，请先运行 python app.py'))
  }, [])

  useEffect(() => {
    document.body.dataset.theme = currentViewId || 'zhouyi'
  }, [currentViewId])

  function switchView(typeId) {
    if (isAnimating || currentViewId === typeId) return
    setIsAnimating(true)
    setExitingId(currentViewId)
    setTimeout(() => {
      setExitingId(null)
      setCurrentViewId(typeId)
      setIsAnimating(false)
    }, 220)
  }

  async function handleSubmit(typeId, values) {
    setError('')
    setLoading(true)
    try {
      const data = await postFortune({ type: typeId, ...values })
      setResults((prev) => ({ ...prev, [typeId]: data }))
    } catch (err) {
      setError(err.message || '网络错误，请检查本地服务是否运行')
    } finally {
      setLoading(false)
    }
  }

  function handleReset(typeId) {
    setResults((prev) => {
      const next = { ...prev }
      delete next[typeId]
      return next
    })
  }

  return (
    <div className={'container theme-' + (currentViewId || 'zhouyi')}>
      <SiteHeader />
      <TypeSelector types={types} currentId={currentViewId} onSwitch={switchView} />

      <div className="views-wrapper">
        {types.map((t) => {
          let cls = 'view'
          let style
          if (t.id === currentViewId) {
            cls = 'view active'
          } else if (t.id === exitingId) {
            cls = 'view exiting'
            style = { display: 'block' }
          }
          return (
            <ViewPanel
              key={t.id}
              typeConfig={t}
              cls={cls}
              style={style}
              result={results[t.id] || null}
              onSubmit={(values) => handleSubmit(t.id, values)}
              onReset={() => handleReset(t.id)}
            />
          )
        })}
      </div>

      <div className={'loading' + (loading ? ' show' : '')}>
        <div className="loading-bagua">
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="center-dot"></div>
        </div>
        <p className="loading-text">大师正在为您推演</p>
        <p className="loading-sub">静候片刻，天机将现…</p>
      </div>

      <div className={'error' + (error ? ' show' : '')}>{error}</div>

      <div className="site-footer">
        <div className="footer-ornament">── ✦ ──</div>
        <p>基于周易六十四卦 · 梅花易数 · DeepSeek AI</p>
        <p>本系统仅供娱乐参考</p>
      </div>
    </div>
  )
}
