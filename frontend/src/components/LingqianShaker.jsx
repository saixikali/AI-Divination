import { useState, useRef } from 'react'

const CN_NUMS = ['壹', '贰', '叁', '肆', '伍']

/**
 * 灵签摇签组件
 * 状态机：idle → shaking → drawing → 交由父组件展示结果
 */
export default function LingqianShaker({ typeConfig, onSubmit }) {
  const [phase, setPhase] = useState('idle') // idle | shaking | drawing
  const [name, setName] = useState('')
  const [question, setQuestion] = useState('')
  const formRef = useRef(null)

  function handleShake(e) {
    e.preventDefault()
    if (!question.trim()) return
    setPhase('shaking')

    // 摇晃 1.6s 后签飞出
    setTimeout(() => {
      setPhase('drawing')
      // 飞出动画 0.8s 后提交结果
      setTimeout(() => {
        onSubmit({ name: name.trim(), question: question.trim() })
      }, 800)
    }, 1600)
  }

  return (
    <div className="form-card lingqian-shaker">
      <div className="form-header">
        <span className="step-badge">诚 心 求 签</span>
        <h3>心有所疑，摇签决疑</h3>
        <p className="type-desc">{typeConfig.desc}</p>
      </div>

      <form className="fortune-form" ref={formRef} onSubmit={handleShake}>
        {typeConfig.fields.map((f, i) => (
          <div className="form-group" key={f.key}>
            <div className="field-header">
              <span className="field-num">{CN_NUMS[i]}</span>
              <label>
                {f.label}
                {f.required ? (
                  <span className="required-star">*</span>
                ) : (
                  <span className="optional-tag">（可选）</span>
                )}
              </label>
            </div>
            {f.type === 'textarea' ? (
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={f.placeholder || ''}
                required={f.required}
                disabled={phase !== 'idle'}
              />
            ) : (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={f.placeholder || ''}
                required={f.required}
                disabled={phase !== 'idle'}
              />
            )}
            {f.hint && <div className="field-hint">{f.hint}</div>}
          </div>
        ))}

        {/* 签筒区域 */}
        <div className={'shaker-stage phase-' + phase}>
          <div className="shaker-tube">
            {/* 签筒口 */}
            <div className="tube-rim"></div>
            {/* 筒身 */}
            <div className="tube-body">
              {/* 筒内的签 */}
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={'stick stick-' + i}
                  style={{ left: 12 + i * 9 + '%', animationDelay: i * 0.06 + 's' }}
                ></div>
              ))}
            </div>
            {/* 飞出的签 */}
            {phase === 'drawing' && <div className="stick-flying"></div>}
          </div>
          {/* 签筒底座 */}
          <div className="tube-base"></div>
        </div>

        <button
          type="submit"
          className={'btn btn-primary shake-btn' + (phase !== 'idle' ? ' disabled' : '')}
          disabled={phase !== 'idle'}
        >
          {phase === 'idle' && '🏮 　摇 签 求 卜　 🏮'}
          {phase === 'shaking' && '⏳ 　签 筒 摇 晃 中　…'}
          {phase === 'drawing' && '✨ 　灵 签 降 临　…'}
        </button>
      </form>
    </div>
  )
}
