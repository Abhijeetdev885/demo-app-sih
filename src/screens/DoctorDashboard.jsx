import Logo from '../components/Logo.jsx'
import { t } from '../data/translations.js'

export default function DoctorDashboard({ language, onHome, history }) {
  return (
    <div className="doctor-shell">
      <header className="doctor-header">
        <div className="kiosk-header__brand">
          <span className="kiosk-header__logo">
            <Logo size={36} />
          </span>
          <div>
            <p className="kiosk-header__name">{t(language, 'brand')}</p>
            <p className="kiosk-header__badge">{t(language, 'sihBadge')}</p>
          </div>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onHome}>
          {t(language, 'home')}
        </button>
      </header>

      <main className="doctor-main">
        <div className="screen-head">
          <h1>{t(language, 'doctorTitle')}</h1>
          <p>{t(language, 'doctorSubtitle')}</p>
        </div>

        <div className="banner-draft" role="status">
          {t(language, 'aiDraftLabel')}
        </div>
        {history?.hasRedFlag && (
          <div className="red-flag red-flag--compact" role="status">
            <p className="red-flag__title">{t(language, 'doctorRedFlag')}</p>
            <p className="red-flag__action">{t(language, 'redFlagAction')}</p>
          </div>
        )}

        <section className="doctor-grid">
          <article className="panel doctor-panel">
            <h2>{t(language, 'waitingPatients')}</h2>
            <p className="muted">{t(language, 'noQueue')}</p>
            <div className="placeholder-rows">
              <div />
              <div />
              <div />
            </div>
          </article>
          <article className="panel doctor-panel">
            <h2>{t(language, 'doctorTitle')}</h2>
            <p>{t(language, 'doctorEmpty')}</p>
          </article>
        </section>
      </main>
    </div>
  )
}
