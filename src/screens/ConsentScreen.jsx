import { useState } from 'react'
import KioskLayout from '../components/KioskLayout.jsx'
import PatientCard from '../components/PatientCard.jsx'
import { t } from '../data/translations.js'

function InfoIcon({ name }) {
  if (name === 'collect') {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="5" y="4" width="18" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M9 10h10M9 14h10M9 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === 'why') {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M14 12v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="8.5" r="1.3" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="10" cy="11" r="3.2" stroke="currentColor" strokeWidth="2" />
      <path d="M5 21c.8-3.4 3.2-5 5-5s4.2 1.6 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="19" cy="11" r="2.6" stroke="currentColor" strokeWidth="2" />
      <path d="M16.5 21c.5-2.4 2-3.7 3.3-3.7 1.6 0 3.2 1.4 3.7 3.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function ConsentScreen({
  language,
  patient,
  onHome,
  onBack,
  onAgree,
  onDisagree,
}) {
  const [checked, setChecked] = useState(false)
  const [error, setError] = useState('')

  function handleAgree() {
    if (!checked) {
      setError(t(language, 'consentNeeded'))
      return
    }
    onAgree()
  }

  return (
    <KioskLayout language={language} view="consent" onHome={onHome} onBack={onBack}>
      <div className="screen-split">
        <div>
          <div className="screen-head">
            <h1>{t(language, 'consentTitle')}</h1>
            <p>{t(language, 'consentIntro')}</p>
          </div>

          <div className="consent-list">
            <article className="info-card">
              <div className="info-card__icon">
                <InfoIcon name="collect" />
              </div>
              <div>
                <h2>{t(language, 'collectedTitle')}</h2>
                <ul>
                  {t(language, 'collectedItems').map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
            <article className="info-card">
              <div className="info-card__icon">
                <InfoIcon name="why" />
              </div>
              <div>
                <h2>{t(language, 'whyTitle')}</h2>
                <p>{t(language, 'whyText')}</p>
              </div>
            </article>
            <article className="info-card">
              <div className="info-card__icon">
                <InfoIcon name="who" />
              </div>
              <div>
                <h2>{t(language, 'whoTitle')}</h2>
                <p>{t(language, 'whoText')}</p>
              </div>
            </article>
          </div>

          <p className="consent-note">{t(language, 'aiText')}</p>

          <label className="consent-check">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked)
                setError('')
              }}
            />
            <span>{t(language, 'checkboxLabel')}</span>
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="btn-row">
            <button type="button" className="btn btn--primary btn--xl" onClick={handleAgree}>
              {t(language, 'agree')}
            </button>
            <button type="button" className="btn btn--danger btn--xl" onClick={onDisagree}>
              {t(language, 'disagree')}
            </button>
          </div>
          <p className="muted">{t(language, 'prototypeNote')}</p>
        </div>
        <PatientCard patient={patient} language={language} />
      </div>
    </KioskLayout>
  )
}
