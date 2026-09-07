import { t } from '../data/translations.js'

const STEPS = [
  { id: 'identify', views: ['identify'] },
  { id: 'language', views: ['language'] },
  { id: 'consent', views: ['consent', 'consent-declined'] },
  { id: 'history', views: ['history'] },
  { id: 'documents', views: [] },
  { id: 'review', views: ['review'] },
]

export default function ProgressBar({ currentView, language }) {
  const currentIndex = STEPS.findIndex((step) => step.views.includes(currentView))

  return (
    <nav className="progress" aria-label={t(language, 'progressLabel')}>
      {STEPS.map((step, index) => {
        let state = 'upcoming'
        if (currentView === 'review') {
          state = index <= 3 ? 'done' : index === 5 ? 'current' : 'upcoming'
        } else if (currentIndex >= 0) {
          state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'upcoming'
        }

        return (
          <div key={step.id} className={`progress-step progress-step--${state}`}>
            <span className="progress-dot" aria-hidden="true">
              {state === 'done' ? (
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7.2L5.7 10L11 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </span>
            <span className="progress-label">{t(language, `steps.${step.id}`)}</span>
            {index < STEPS.length - 1 && <span className="progress-line" aria-hidden="true" />}
          </div>
        )
      })}
    </nav>
  )
}
