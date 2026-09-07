import { useState } from 'react'
import KioskLayout from '../components/KioskLayout.jsx'
import { DEMO_PATIENTS, EMPTY_NEW_PATIENT, createNewPatientId } from '../data/demoPatients.js'
import { t } from '../data/translations.js'

export default function IdentifyScreen({ language, onHome, onBack, onSelectPatient }) {
  const [mode, setMode] = useState('existing')
  const [selectedId, setSelectedId] = useState(DEMO_PATIENTS[0].id)
  const [form, setForm] = useState({ ...EMPTY_NEW_PATIENT })
  const [error, setError] = useState('')

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  function handleExistingContinue() {
    const patient = DEMO_PATIENTS.find((p) => p.id === selectedId)
    if (!patient) return
    onSelectPatient(patient, false)
  }

  function handleNewContinue() {
    const name = form.fullName.trim()
    const age = form.age.trim()
    const gender = form.gender
    const phone = form.phone.trim()
    if (!name || !age || !gender || !phone) {
      setError(t(language, 'identifyError'))
      return
    }
    onSelectPatient(
      {
        ...form,
        fullName: name,
        age,
        phone,
        abhaId: form.abhaId.trim() || `Demo-ABHA-${createNewPatientId().slice(3)}`,
        id: createNewPatientId(),
      },
      true,
    )
  }

  return (
    <KioskLayout language={language} view="identify" onHome={onHome} onBack={onBack}>
      <div className="screen-head">
        <h1>{t(language, 'identifyTitle')}</h1>
        <p>{t(language, 'identifySubtitle')}</p>
      </div>

      <div className="segmented" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'existing'}
          className={mode === 'existing' ? 'segmented__btn is-active' : 'segmented__btn'}
          onClick={() => setMode('existing')}
        >
          {t(language, 'existingPatient')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'new'}
          className={mode === 'new' ? 'segmented__btn is-active' : 'segmented__btn'}
          onClick={() => setMode('new')}
        >
          {t(language, 'newPatient')}
        </button>
      </div>

      {mode === 'existing' ? (
        <section className="panel">
          <p className="panel__hint">{t(language, 'existingHint')}</p>
          <ul className="patient-list">
            {DEMO_PATIENTS.map((patient) => {
              const checked = selectedId === patient.id
              return (
                <li key={patient.id}>
                  <label className={checked ? 'select-card is-selected' : 'select-card'}>
                    <input
                      type="radio"
                      name="demo-patient"
                      value={patient.id}
                      checked={checked}
                      onChange={() => setSelectedId(patient.id)}
                    />
                    <span className="select-card__body">
                      <strong>{patient.fullName}</strong>
                      <span>
                        {t(language, 'demoPatientId')}: {patient.id}
                      </span>
                      <span>
                        {t(language, 'demoAbhaId')}: {patient.abhaId}
                      </span>
                      <span>
                        {patient.age} · {patient.gender}
                      </span>
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
          <button type="button" className="btn btn--primary btn--block btn--xl" onClick={handleExistingContinue}>
            {t(language, 'useThisPatient')}
          </button>
        </section>
      ) : (
        <section className="panel">
          <p className="panel__hint">{t(language, 'newHint')}</p>
          <form
            className="form-grid"
            onSubmit={(event) => {
              event.preventDefault()
              handleNewContinue()
            }}
          >
            <label className="field">
              <span>{t(language, 'fullName')}</span>
              <input
                value={form.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder={t(language, 'namePlaceholder')}
                autoComplete="name"
              />
            </label>
            <label className="field">
              <span>{t(language, 'age')}</span>
              <input
                inputMode="numeric"
                value={form.age}
                onChange={(e) => updateField('age', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder={t(language, 'agePlaceholder')}
              />
            </label>
            <label className="field">
              <span>{t(language, 'gender')}</span>
              <select value={form.gender} onChange={(e) => updateField('gender', e.target.value)}>
                <option value="">{t(language, 'selectGender')}</option>
                <option value="Male">{t(language, 'male')}</option>
                <option value="Female">{t(language, 'female')}</option>
                <option value="Other">{t(language, 'other')}</option>
                <option value="Prefer not to say">{t(language, 'preferNot')}</option>
              </select>
            </label>
            <label className="field">
              <span>{t(language, 'phone')}</span>
              <input
                inputMode="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder={t(language, 'phonePlaceholder')}
              />
            </label>
            <label className="field field--wide">
              <span>{t(language, 'optionalAbha')}</span>
              <input
                value={form.abhaId}
                onChange={(e) => updateField('abhaId', e.target.value)}
                placeholder={t(language, 'abhaPlaceholder')}
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn--primary btn--block btn--xl field--wide">
              {t(language, 'registerContinue')}
            </button>
          </form>
        </section>
      )}
    </KioskLayout>
  )
}
