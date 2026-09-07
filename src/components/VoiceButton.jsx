export default function VoiceButton({ available, status, onStart, onStop, labels }) {
  const isListening = status === 'LISTENING'
  const label = labels[status] || labels.READY

  return (
    <div className="voice-wrap">
      <button
        type="button"
        className={`voice-btn ${isListening ? 'is-listening' : ''} ${!available ? 'is-disabled' : ''}`}
        onClick={isListening ? onStop : onStart}
        disabled={!available}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect x="10" y="4" width="8" height="13" rx="4" stroke="currentColor" strokeWidth="2.2" />
          <path d="M7 13a7 7 0 0014 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M14 20v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <span>{labels.speak}</span>
      </button>
      <p className="voice-status">{label}</p>
      {!available && <p className="muted">{labels.unavailable}</p>}
    </div>
  )
}
