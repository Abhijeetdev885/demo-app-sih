import Logo from './Logo.jsx'
import { t } from '../data/translations.js'

export default function KioskHeader({ language, onHome, showHome = true }) {
  return (
    <header className="kiosk-header">
      <div className="kiosk-header__brand">
        <span className="kiosk-header__logo">
          <Logo size={36} />
        </span>
        <div>
          <p className="kiosk-header__name">{t(language, 'brand')}</p>
          <p className="kiosk-header__badge">{t(language, 'sihBadge')}</p>
        </div>
      </div>
      {showHome && (
        <button type="button" className="btn btn--ghost btn--touch" onClick={onHome}>
          {t(language, 'home')}
        </button>
      )}
    </header>
  )
}
