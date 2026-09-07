import { SessionProvider, useSession } from './context/SessionContext.jsx'
import LandingScreen from './screens/LandingScreen.jsx'
import IdentifyScreen from './screens/IdentifyScreen.jsx'
import LanguageScreen from './screens/LanguageScreen.jsx'
import ConsentScreen from './screens/ConsentScreen.jsx'
import ConsentDeclinedScreen from './screens/ConsentDeclinedScreen.jsx'
import InterviewScreen from './screens/InterviewScreen.jsx'
import HistoryReviewScreen from './screens/HistoryReviewScreen.jsx'
import DoctorDashboard from './screens/DoctorDashboard.jsx'
import {
  loadChestPainDemo,
  loadChestPainRedFlagDemo,
  loadNormalChestPainDemo,
} from './modules/clinicalHistoryEngine.js'
import { attachRedFlags, detectRedFlags } from './modules/redFlagEngine.js'
import { t } from './data/translations.js'

function AppFlow() {
  const {
    session,
    goTo,
    setLanguage,
    setPatient,
    setConsent,
    setHistory,
    setInterviewStep,
    startHistory,
    reset,
  } = useSession()
  const { view, language, patient, history, interviewStep } = session

  function confirmLeave() {
    if (view === 'history' && Object.keys(history.answers || {}).length > 0) {
      return window.confirm(t(language, 'leaveInterview'))
    }
    return true
  }

  function handleHome() {
    if (!confirmLeave()) return
    reset()
  }

  if (view === 'landing') {
    return (
      <LandingScreen
        language={language}
        onPatient={() => goTo('identify')}
        onDoctor={() => goTo('doctor')}
      />
    )
  }

  if (view === 'identify') {
    return (
      <IdentifyScreen
        language={language}
        onHome={handleHome}
        onBack={reset}
        onSelectPatient={(nextPatient, isNew) => {
          setPatient(nextPatient, isNew)
          goTo('language')
        }}
      />
    )
  }

  if (view === 'language') {
    return (
      <LanguageScreen
        language={language}
        patient={patient}
        onHome={handleHome}
        onBack={() => goTo('identify')}
        onChooseLanguage={setLanguage}
        onContinue={() => goTo('consent')}
      />
    )
  }

  if (view === 'consent') {
    return (
      <ConsentScreen
        language={language}
        patient={patient}
        onHome={handleHome}
        onBack={() => goTo('language')}
        onAgree={startHistory}
        onDisagree={() => {
          setConsent(false)
          goTo('consent-declined')
        }}
      />
    )
  }

  if (view === 'consent-declined') {
    return (
      <ConsentDeclinedScreen
        language={language}
        onHome={handleHome}
        onBack={() => goTo('consent')}
      />
    )
  }

  if (view === 'history') {
    return (
      <InterviewScreen
        key={`${interviewStep}-${Object.keys(history.answers || {}).length}`}
        language={language}
        patient={patient}
        history={history}
        stepIndex={interviewStep}
        onHome={handleHome}
        onBack={() => {
          if (interviewStep <= 0) {
            goTo('consent')
            return
          }
          setInterviewStep(interviewStep - 1)
        }}
        onSaveAnswer={(nextHistory, isLast) => {
          if (isLast) {
            const detection = detectRedFlags(nextHistory)
            setHistory({ ...attachRedFlags(nextHistory, detection), completed: true })
            goTo('review')
            return
          }
          setHistory(nextHistory)
          setInterviewStep(interviewStep + 1)
        }}
        onComplete={() => {
          const detection = detectRedFlags(history)
          setHistory({ ...attachRedFlags(history, detection), completed: true })
          goTo('review')
        }}
        onLoadDemo={() => {
          setHistory(loadChestPainDemo())
          goTo('review')
        }}
        onLoadNormalDemo={() => {
          setHistory(loadNormalChestPainDemo())
          goTo('review')
        }}
        onLoadRedFlagDemo={() => {
          setHistory(loadChestPainRedFlagDemo())
          goTo('review')
        }}
      />
    )
  }

  if (view === 'review') {
    return (
      <HistoryReviewScreen
        language={language}
        patient={patient}
        history={history}
        onHome={handleHome}
        onBack={() => {
          goTo('history')
        }}
        onEditSection={(index) => {
          setInterviewStep(index)
          goTo('history')
        }}
        onFinish={reset}
      />
    )
  }

  if (view === 'doctor') {
    return <DoctorDashboard language={language} onHome={reset} history={history} />
  }

  return (
    <LandingScreen
      language={language}
      onPatient={() => goTo('identify')}
      onDoctor={() => goTo('doctor')}
    />
  )
}

export default function App() {
  return (
    <SessionProvider>
      <AppFlow />
    </SessionProvider>
  )
}
