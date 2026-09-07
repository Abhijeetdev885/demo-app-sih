import { createContext, useContext, useMemo, useState } from 'react'
import { EMPTY_NEW_PATIENT } from '../data/demoPatients.js'
import { createEmptyHistory } from '../data/clinicalHistory.js'

const SessionContext = createContext(null)

const INITIAL = {
  view: 'landing',
  language: 'en',
  patient: { ...EMPTY_NEW_PATIENT },
  isNewPatient: false,
  consentGiven: false,
  history: createEmptyHistory(),
  interviewStep: 0,
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(INITIAL)

  const api = useMemo(
    () => ({
      session,
      goTo(view) {
        setSession((prev) => ({ ...prev, view }))
      },
      setLanguage(language) {
        setSession((prev) => ({ ...prev, language }))
      },
      setPatient(patient, isNewPatient) {
        setSession((prev) => ({
          ...prev,
          patient,
          isNewPatient,
        }))
      },
      setConsent(consentGiven) {
        setSession((prev) => ({ ...prev, consentGiven }))
      },
      setHistory(history) {
        setSession((prev) => ({ ...prev, history }))
      },
      setInterviewStep(interviewStep) {
        setSession((prev) => ({ ...prev, interviewStep }))
      },
      startHistory() {
        setSession((prev) => ({
          ...prev,
          consentGiven: true,
          history: createEmptyHistory(),
          interviewStep: 0,
          view: 'history',
        }))
      },
      reset() {
        setSession({ ...INITIAL, history: createEmptyHistory() })
      },
    }),
    [session],
  )

  return <SessionContext.Provider value={api}>{children}</SessionContext.Provider>
}

export function useSession() {
  const value = useContext(SessionContext)
  if (!value) {
    throw new Error('useSession must be used inside SessionProvider')
  }
  return value
}
