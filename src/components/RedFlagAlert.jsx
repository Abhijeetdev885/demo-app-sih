import { t } from '../data/translations.js'

export default function RedFlagAlert({ language, detection, onAcknowledge }) {
  if (!detection?.hasRedFlag) return null
  const reason = detection.alerts?.[0]?.reason || ''

  return (
    <aside className="red-flag" role="alert">
      <p className="red-flag__title">{t(language, 'redFlagTitle')}</p>
      <p className="red-flag__message">{t(language, 'redFlagMessage')}</p>
      <p className="red-flag__action">{t(language, 'redFlagAction')}</p>
      {reason && <p className="red-flag__reason">{reason}</p>}
      {onAcknowledge && (
        <button type="button" className="btn btn--primary btn--xl" onClick={onAcknowledge}>
          {t(language, 'acknowledge')}
        </button>
      )}
    </aside>
  )
}
