import LingqianShaker from './LingqianShaker'

const CN_NUMS = ['壹', '贰', '叁', '肆', '伍']

export default function FortuneForm({ typeConfig, onSubmit }) {
  if (typeConfig.id === 'lingqian') {
    return <LingqianShaker typeConfig={typeConfig} onSubmit={onSubmit} />
  }

  function handleSubmit(e) {
    e.preventDefault()
    const values = {}
    typeConfig.fields.forEach((f) => {
      values[f.key] = e.target.elements[f.key].value.trim()
    })
    onSubmit(values)
  }

  return (
    <div className="form-card">
      <div className="form-header">
        <span className="step-badge">请 填 写 信 息</span>
        <h3>诚心发问，卦象自明</h3>
        <p className="type-desc">{typeConfig.desc}</p>
      </div>
      <form className="fortune-form" onSubmit={handleSubmit}>
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
                name={f.key}
                placeholder={f.placeholder || ''}
                required={f.required}
              />
            ) : (
              <input
                type="text"
                name={f.key}
                placeholder={f.placeholder || ''}
                required={f.required}
              />
            )}
            {f.hint && <div className="field-hint">{f.hint}</div>}
          </div>
        ))}
        <button type="submit" className="btn btn-primary">
          ☯ 　开 始 占 卜　 ☯
        </button>
      </form>
    </div>
  )
}
