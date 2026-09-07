import { useMemo, useState } from 'react'
import KioskLayout from '../components/KioskLayout.jsx'
import PatientCard from '../components/PatientCard.jsx'
import AnswerControls from '../components/AnswerControls.jsx'
import VoiceButton from '../components/VoiceButton.jsx'
import { t } from '../data/translations.js'
import { applyAnswer, formatAnswer, getQuestionAt, localize } from '../modules/questionEngine.js'
import { attachRedFlags, detectRedFlags } from '../modules/redFlagEngine.js'
import RedFlagAlert from '../components/RedFlagAlert.jsx'
import { useSpeechInput } from '../hooks/useSpeechInput.js'

function isEmpty(value) {
  if (value === 0) return false
  if (!value) return true
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return !value.text && !value.id && !value.label
  return String(value).trim() === ''
}

export default function InterviewScreen({
  language,
  patient,
  history,
  stepIndex,
  onHome,
  onBack,
  onSaveAnswer,
  onComplete,
  onLoadDemo,
  onLoadNormalDemo,
  onLoadRedFlagDemo,
}) {
  const { question, total, isLast } = useMemo(
    () => getQuestionAt(history.answers, stepIndex),
    [history.answers, stepIndex],
  )

  const saved = question ? history.answers[question.id] : ''
  const [draft, setDraft] = useState(saved ?? '')
  const [phase, setPhase] = useState(isEmpty(saved) ? 'answer' : 'confirm')
  const [error, setError] = useState('')
  const [pendingAlert, setPendingAlert] = useState(null)
  const [pendingHistory, setPendingHistory] = useState(null)

  const speech = useSpeechInput({
    language,
    onResult: (text) => {
      if (!question) return
      const lower = text.trim().toLowerCase()
      if (question.type === 'YES_NO') {
        if (['yes', 'yeah', 'haan', 'han', 'हाँ', 'हां'].includes(lower)) {
          setDraft('Yes')
        } else if (['no', 'nah', 'na', 'नहीं', 'नही'].includes(lower)) {
          setDraft('No')
        } else {
          setDraft(text)
        }
      } else if (question.type === 'COMPLAINT') {
        setDraft({ id: 'other', label: text, text })
      } else if (question.type === 'MULTI_SELECT') {
        setDraft([text])
      } else if (question.type === 'PAIN_SCALE') {
        const n = parseInt(text, 10)
        setDraft(Number.isNaN(n) ? text : Math.min(10, Math.max(0, n)))
      } else {
        setDraft(text)
      }
      setPhase('confirm')
    },
  })

  if (!question) {
    return (
      <KioskLayout language={language} view="history" onHome={onHome} onBack={onBack}>
        <div className="empty-state">
          <h1>{t(language, 'historyCompleteTitle')}</h1>
          <button type="button" className="btn btn--primary btn--xl" onClick={onComplete}>
            {t(language, 'reviewHistory')}
          </button>
        </div>
      </KioskLayout>
    )
  }

  const heading = question.heading ? localize(question.heading, language) : t(language, 'historyTitle')
  const prompt = localize(question.text, language)
  const explanation = localize(question.explanation, language)

  function handleContinue() {
    if (isEmpty(draft)) {
      setError(t(language, 'answerRequired'))
      return
    }
    setPhase('confirm')
  }

  function handleConfirm() {
    const nextHistory = applyAnswer(history, question, draft)
    const detection = detectRedFlags(nextHistory)
    const withFlags = attachRedFlags(nextHistory, detection)
    const known = new Set(history.acknowledgedRedFlags || [])
    const fresh = detection.matchedRules.filter((id) => !known.has(id))
    if (detection.hasRedFlag && fresh.length > 0) {
      setPendingHistory({ history: withFlags, isLast })
      setPendingAlert(detection)
      return
    }
    onSaveAnswer(withFlags, isLast)
  }

  function handleAcknowledge() {
    if (!pendingHistory) return
    const acknowledged = Array.from(
      new Set([
        ...(pendingHistory.history.acknowledgedRedFlags || []),
        ...(pendingAlert?.matchedRules || []),
      ]),
    )
    onSaveAnswer(
      { ...pendingHistory.history, acknowledgedRedFlags: acknowledged },
      pendingHistory.isLast,
    )
    setPendingAlert(null)
    setPendingHistory(null)
  }

  return (
    <KioskLayout language={language} view="history" onHome={onHome} onBack={onBack}>
      <div className="screen-split">
        <div>
          <div className="section-chip">{heading}</div>
          <div className="screen-head">
            <p className="step-count">
              {t(language, 'historyStep')} {stepIndex + 1} / {total}
            </p>
            <h1>{prompt}</h1>
            {explanation && <p>{explanation}</p>}
          </div>

          {phase === 'answer' && (
            <>
              <AnswerControls
                question={question}
                language={language}
                draft={draft}
                onChange={(value) => {
                  setDraft(value)
                  setError('')
                }}
              />
              <VoiceButton
                available={speech.available}
                status={speech.status}
                onStart={speech.start}
                onStop={speech.stop}
                labels={{
                  speak: t(language, 'speak'),
                  READY: t(language, 'voiceReady'),
                  LISTENING: t(language, 'voiceListening'),
                  PROCESSING: t(language, 'voiceProcessing'),
                  'ANSWER CAPTURED': t(language, 'voiceCaptured'),
                  unavailable: t(language, 'voiceUnavailable'),
                }}
              />
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button type="button" className="btn btn--primary btn--xl btn--block" onClick={handleContinue}>
                {t(language, 'continue')}
              </button>
            </>
          )}

          {pendingAlert && (
            <RedFlagAlert
              language={language}
              detection={pendingAlert}
              onAcknowledge={handleAcknowledge}
            />
          )}

          {phase === 'confirm' && !pendingAlert && (
            <div className="confirm-card">
              <p className="confirm-card__label">{t(language, 'youSaid')}</p>
              <p className="confirm-card__value">{formatAnswer(draft) || '—'}</p>
              <div className="btn-row">
                <button
                  type="button"
                  className="btn btn--secondary btn--xl"
                  onClick={() => {
                    setPhase('answer')
                    speech.setStatus('READY')
                  }}
                >
                  {t(language, 'edit')}
                </button>
                <button type="button" className="btn btn--primary btn--xl" onClick={handleConfirm}>
                  {t(language, 'confirm')}
                </button>
              </div>
            </div>
          )}

          <div className="demo-links">
            <button type="button" className="btn btn--ghost demo-link" onClick={onLoadDemo}>
              {t(language, 'loadChestPainDemo')}
            </button>
            <button type="button" className="btn btn--ghost demo-link" onClick={onLoadNormalDemo}>
              {t(language, 'loadNormalChestPainDemo')}
            </button>
            <button type="button" className="btn btn--ghost demo-link" onClick={onLoadRedFlagDemo}>
              {t(language, 'loadRedFlagChestPainDemo')}
            </button>
          </div>
        </div>
        <PatientCard patient={patient} language={language} />
      </div>
    </KioskLayout>
  )
}
