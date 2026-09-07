import { t } from '../data/translations.js'

export default function PatientCard({ patient, language }) {
  if (!patient?.fullName && !patient?.id) return null

  return (
    <aside className="patient-card" aria-label={t(language, 'patientCard')}>
      <p className="patient-card__eyebrow">{t(language, 'patientCard')}</p>
      <p className="patient-card__name">{patient.fullName || '—'}</p>
      <dl className="patient-card__meta">
        {patient.id && (
          <>
            <dt>ID</dt>
            <dd>{patient.id}</dd>
          </>
        )}
        {patient.age && (
          <>
            <dt>{t(language, 'age')}</dt>
            <dd>{patient.age}</dd>
          </>
        )}
        {patient.gender && (
          <>
            <dt>{t(language, 'gender')}</dt>
            <dd>{patient.gender}</dd>
          </>
        )}
        {patient.abhaId && (
          <>
            <dt>ABHA</dt>
            <dd>{patient.abhaId}</dd>
          </>
        )}
      </dl>
    </aside>
  )
}
