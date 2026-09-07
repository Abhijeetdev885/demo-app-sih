import KioskHeader from './KioskHeader.jsx'
import ProgressBar from './ProgressBar.jsx'
import { t } from '../data/translations.js'

export default function KioskLayout({
  language,
  view,
  onHome,
  onBack,
  showProgress = true,
  children,
}) {
  return (
    <div className="kiosk-shell">
      <KioskHeader language={language} onHome={onHome} />
      {showProgress && <ProgressBar currentView={view} language={language} />}
      <main className="kiosk-main">{children}</main>
      {onBack && (
        <div className="kiosk-footer">
          <button type="button" className="btn btn--secondary btn--xl" onClick={onBack}>
            {t(language, 'back')}
          </button>
        </div>
      )}
    </div>
  )
}
