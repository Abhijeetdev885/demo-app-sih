import KioskLayout from '../components/KioskLayout.jsx'
import { t } from '../data/translations.js'

export default function ConsentDeclinedScreen({ language, onHome, onBack }) {
  return (
    <KioskLayout
      language={language}
      view="consent-declined"
      onHome={onHome}
      onBack={onBack}
    >
      <div className="empty-state">
        <div className="empty-state__icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.4" />
            <path d="M16 16l16 16M32 16L16 32" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </div>
        <h1>{t(language, 'declinedTitle')}</h1>
        <p>{t(language, 'declinedText')}</p>
        <button type="button" className="btn btn--primary btn--xl" onClick={onHome}>
          {t(language, 'returnHome')}
        </button>
      </div>
    </KioskLayout>
  )
}
