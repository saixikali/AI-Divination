import { useEffect, useRef } from 'react'
import FortuneForm from './FortuneForm'
import { BlockCard } from './blocks'

function ResultView({ data, onReset }) {
  const ref = useRef(null)

  useEffect(() => {
    const cards = ref.current.querySelectorAll('.result-card')
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.style.transitionDelay = i * 0.08 + 's'
        card.classList.add('visible')
      }, 30)
    })
  }, [])

  return (
    <div className="result show" ref={ref}>
      {data.blocks.map((b, i) => (
        <BlockCard key={i} block={b} />
      ))}
      <button className="btn btn-secondary" style={{ marginBottom: '20px' }} onClick={onReset}>
        再 占 一 次
      </button>
    </div>
  )
}

export default function ViewPanel({ typeConfig, cls, style, result, onSubmit, onReset }) {
  return (
    <div className={cls} style={style} data-type={typeConfig.id}>
      {result ? (
        <ResultView data={result} onReset={onReset} />
      ) : (
        <FortuneForm typeConfig={typeConfig} onSubmit={onSubmit} />
      )}
    </div>
  )
}
