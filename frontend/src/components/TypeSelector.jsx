export default function TypeSelector({ types, currentId, onSwitch }) {
  return (
    <div className="type-selector">
      {types.map((t) => (
        <div
          key={t.id}
          className={'type-btn' + (t.id === currentId ? ' active' : '')}
          onClick={() => onSwitch(t.id)}
        >
          <span className="type-icon">{t.icon}</span>
          <span className="type-label">{t.label}</span>
        </div>
      ))}
    </div>
  )
}
