import Logo from '../components/Logo.jsx'
import { t } from '../data/translations.js'

function RoleIcon({ type }) {
  if (type === 'patient') {
    return (
      <svg width="48" height="48" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <circle cx="18" cy="12" r="6" stroke="currentColor" strokeWidth="2.2" />
        <path
          d="M7 30c1.5-6 6-9 11-9s9.5 3 11 9"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  return (
    <svg width="48" height="48" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect x="6" y="8" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="2.2" />
      <path d="M16 18h4M18 16v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10 28v2M26 28v2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export default function LandingScreen({ language, onPatient, onDoctor }) {
  return (
    <div className="landing">
      <div className="landing__glow" aria-hidden="true" />
      <header className="landing__top">
        <span className="chip">{t(language, 'sihBadge')}</span>
      </header>

      <section className="landing__hero">
        <div className="landing__mark">
          <Logo size={80} />
        </div>
        <h1 className="landing__brand">{t(language, 'brand')}</h1>
        <p className="landing__tagline">{t(language, 'tagline')}</p>
        <p className="landing__subtitle">{t(language, 'subtitle')}</p>
      </section>

      <section className="role-grid" aria-label="Choose role">
        <button type="button" className="role-card role-card--patient" onClick={onPatient}>
          <span className="role-card__icon">
            <RoleIcon type="patient" />
          </span>
          <span className="role-card__title">{t(language, 'patient')}</span>
          <span className="role-card__hint">{t(language, 'patientHint')}</span>
        </button>
        <button type="button" className="role-card role-card--doctor" onClick={onDoctor}>
          <span className="role-card__icon">
            <RoleIcon type="doctor" />
          </span>
          <span className="role-card__title">{t(language, 'doctor')}</span>
          <span className="role-card__hint">{t(language, 'doctorHint')}</span>
        </button>
      </section>

      <p className="landing__note">{t(language, 'demoOnly')}</p>
    </div>
  )
}
