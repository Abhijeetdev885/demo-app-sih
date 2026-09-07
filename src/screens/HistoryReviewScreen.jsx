import KioskLayout from '../components/KioskLayout.jsx'
import PatientCard from '../components/PatientCard.jsx'
import { t } from '../data/translations.js'
import { getQuestionQueue, getReviewSections } from '../modules/questionEngine.js'
import { detectRedFlags } from '../modules/redFlagEngine.js'
import RedFlagAlert from '../components/RedFlagAlert.jsx'

export default function HistoryReviewScreen({
  language,
  patient,
  history,
  onHome,
  onBack,
  onEditSection,
  onFinish,
}) {
  const queue = getQuestionQueue(history.answers || {})
  const sections = getReviewSections(history, language)
  const detection = detectRedFlags(history)

  function jumpTo(id) {
    const index = queue.findIndex((item) => item.id === id)
    onEditSection(index >= 0 ? index : 0)
  }

  return (
    <KioskLayout language={language} view="review" onHome={onHome} onBack={onBack}>
      <div className="screen-split">
        <div>
          <div className="section-chip">{t(language, 'patientProvided')}</div>
          <div className="screen-head">
            <h1>{t(language, 'historyCompleteTitle')}</h1>
            <p>{t(language, 'historyCompleteBody')}</p>
          </div>
          {detection.hasRedFlag && <RedFlagAlert language={language} detection={detection} />}

          <div className="review-stack">
            {sections.map((section) => (
              <article key={section.key} className="review-block">
                <div className="review-block__head">
                  <h2>{t(language, section.titleKey)}</h2>
                  {section.jumpId && (
                    <button type="button" className="btn btn--ghost review-edit" onClick={() => jumpTo(section.jumpId)}>
                      {t(language, 'edit')}
                    </button>
                  )}
                </div>
                <dl className="review-dl">
                  {section.rows.map((row) => (
                    <div key={row.id} className="review-row">
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>

          <button type="button" className="btn btn--primary btn--xl btn--block" onClick={onFinish}>
            {t(language, 'returnHome')}
          </button>
        </div>
        <PatientCard patient={patient} language={language} />
      </div>
    </KioskLayout>
  )
}
