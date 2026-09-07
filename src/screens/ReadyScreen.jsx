import KioskLayout from '../components/KioskLayout.jsx'
import PatientCard from '../components/PatientCard.jsx'
import { t } from '../data/translations.js'

export default function ReadyScreen({ language, patient, onHome, onBack }) {
  return (
    <KioskLayout language={language} view="ready" onHome={onHome} onBack={onBack}>
      <div className="screen-split">
        <div>
          <div className="banner-draft" role="status">
            {t(language, 'aiDraftLabel')}
          </div>
          <div className="screen-head">
            <h1>{t(language, 'readyTitle')}</h1>
            <p>{t(language, 'readySubtitle')}</p>
          </div>
          <div className="panel">
            <p>{t(language, 'readyBody')}</p>
          </div>
          <button type="button" className="btn btn--primary btn--xl" onClick={onHome}>
            {t(language, 'returnHome')}
          </button>
        </div>
        <PatientCard patient={patient} language={language} />
      </div>
    </KioskLayout>
  )
}
