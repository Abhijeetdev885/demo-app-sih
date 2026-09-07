import KioskLayout from '../components/KioskLayout.jsx'
import PatientCard from '../components/PatientCard.jsx'
import { SUPPORTED_LANGUAGES, t } from '../data/translations.js'

function FlagMark({ code }) {
  if (code === 'hi') {
    return (
      <svg className="lang-card__flag" viewBox="0 0 48 32" aria-hidden="true">
        <rect width="48" height="32" rx="4" fill="#FF9933" />
        <rect y="10.7" width="48" height="10.6" fill="#FFFFFF" />
        <rect y="21.3" width="48" height="10.7" fill="#138808" />
        <circle cx="24" cy="16" r="3.4" fill="none" stroke="#000080" strokeWidth="1.4" />
      </svg>
    )
  }
  return (
    <svg className="lang-card__flag" viewBox="0 0 48 32" aria-hidden="true">
      <rect width="48" height="32" rx="4" fill="#012169" />
      <path d="M0 0L48 32M48 0L0 32" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M0 0L48 32M48 0L0 32" stroke="#C8102E" strokeWidth="3" />
      <path d="M24 0V32M0 16H48" stroke="#FFFFFF" strokeWidth="10" />
      <path d="M24 0V32M0 16H48" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
}

export default function LanguageScreen({
  language,
  patient,
  onHome,
  onBack,
  onChooseLanguage,
  onContinue,
}) {
  return (
    <KioskLayout language={language} view="language" onHome={onHome} onBack={onBack}>
      <div className="screen-split">
        <div>
          <div className="screen-head">
            <h1>{t(language, 'languageTitle')}</h1>
            <p>{t(language, 'languageSubtitle')}</p>
          </div>
          <div className="lang-grid">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={language === lang.code ? 'lang-card is-selected' : 'lang-card'}
                onClick={() => onChooseLanguage(lang.code)}
              >
                <FlagMark code={lang.code} />
                <span className="lang-card__title">{lang.title}</span>
                <span className="lang-card__en">{lang.label}</span>
              </button>
            ))}
          </div>
          <p className="muted">{t(language, 'languageNote')}</p>
          <button type="button" className="btn btn--primary btn--xl" onClick={onContinue}>
            {t(language, 'continue')}
          </button>
        </div>
        <PatientCard patient={patient} language={language} />
      </div>
    </KioskLayout>
  )
}
