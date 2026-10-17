const WUXING_COLOR_CLASS = { 金: 'metal', 木: 'wood', 水: 'water', 火: 'fire', 土: 'earth' }

export function BlockCard({ block }) {
  switch (block.kind) {
    case 'header':
      return <HeaderCard b={block} />
    case 'pair':
      return <PairCard b={block} />
    case 'lines':
      return <LinesCard b={block} />
    case 'text':
      return <TextCard b={block} />
    case 'verse':
      return <VerseCard b={block} />
    case 'cards':
      return <CardsCard b={block} />
    case 'kv':
      return <KvCard b={block} />
    case 'ai':
      return <AiCard b={block} />
    default:
      return null
  }
}

function HeaderCard({ b }) {
  return (
    <div className="result-card header-card">
      {b.pinyin && <div className="pinyin">{b.pinyin}</div>}
      <div className="hex-name">{b.title}</div>
      <div className="hex-num">{b.num}</div>
      <span className={'judgement-badge ' + (b.badge ? b.badge.cls : 'ping')}>
        {b.badge ? b.badge.text : ''}
      </span>
    </div>
  )
}

function TrigramBlock({ t }) {
  return (
    <div className="trigram-block">
      <div className="tri-symbol">{t.symbol}</div>
      <div className="tri-name">{t.name}</div>
      <div className="tri-info">
        <span className={'wuxing-dot ' + (WUXING_COLOR_CLASS[t.element] || '')}></span>
        {t.element} · {t.nature} · {t.direction}
      </div>
    </div>
  )
}

function PairCard({ b }) {
  return (
    <div className="result-card">
      <div className="trigram-detail">
        <TrigramBlock t={b.left} />
        <div className="trigram-divider">
          <div className="taiji-icon"></div>
          {b.center && (
            <div className={'wuxing-relation ' + b.center.cls}>{b.center.text}</div>
          )}
        </div>
        <TrigramBlock t={b.right} />
      </div>
    </div>
  )
}

function LinesCard({ b }) {
  const rows = []
  for (let i = b.values.length - 1; i >= 0; i--) {
    rows.push(
      <div className="yao-row" key={i}>
        <span className="yao-label">{b.labels[i]}</span>
        <div
          className={'yao-line ' + (b.values[i] === 1 ? 'yang' : 'yin')}
          style={{ animationDelay: (b.values.length - 1 - i) * 0.12 + 's' }}
        ></div>
      </div>
    )
  }
  return (
    <div className="result-card hexagram-visual">
      <div className="section-title">◇ 六 爻 卦 象 ◇</div>
      {rows}
    </div>
  )
}

function TextCard({ b }) {
  return (
    <div className="result-card text-card">
      <div className="section-label">{b.title}</div>
      <div className="text-content">{b.text}</div>
    </div>
  )
}

function VerseCard({ b }) {
  return (
    <div className="result-card verse-card">
      <div className="verse-text">「{b.text}」</div>
    </div>
  )
}

function CardsCard({ b }) {
  return (
    <div className="result-card tarot-spread">
      <div className="section-title">✦ 塔 罗 牌 阵 ✦</div>
      <div className="cards-container">
        {b.items.map((item, i) => (
          <div className="tarot-slot" key={i}>
            <div className={'tarot-visual' + (item.reversed ? ' reversed' : '')}>
              <div className="tv-back">
                <div className="tv-back-pattern">✦</div>
              </div>
              <div className="tv-face">
                <div className="tv-emoji">{item.emoji}</div>
                <div className="tv-name">{item.name}</div>
              </div>
            </div>
            <div className="tarot-caption">
              <div className="card-pos">
                {item.pos}
                {item.reversed && <span className="card-reversed">逆位</span>}
              </div>
              <div className="card-meaning">{item.meaning}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function KvCard({ b }) {
  return (
    <div className="result-card">
      <div className="section-title">{b.title}</div>
      <div className="kv-list">
        {b.items.map((item, i) => (
          <div className="kv-item" key={i}>
            <span className="kv-key">{item.k}</span>
            <span className={'kv-value' + (item.cls ? ' ' + item.cls : '')}>{item.v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function AiCard({ b }) {
  return (
    <div className="result-card explanation-card">
      <div className="section-title">{b.title}</div>
      <div className="explanation-content">{b.text}</div>
    </div>
  )
}
