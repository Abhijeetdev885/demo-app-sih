import { COMPLAINT_OPTIONS, labelOf } from '../data/clinicalHistory.js'
import { DURATION_OPTIONS } from '../data/questions.js'
import { localize } from '../modules/questionEngine.js'

function asArray(value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function optionText(option, language) {
  return localize(option, language) || labelOf(option, language)
}

export default function AnswerControls({ question, language, draft, onChange }) {
  const type = question.type

  if (type === 'YES_NO') {
    const options = [
      { id: 'Yes', label: language === 'hi' ? 'हाँ' : 'YES' },
      { id: 'No', label: language === 'hi' ? 'नहीं' : 'NO' },
    ]
    return (
      <div className="choice-grid choice-grid--two">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={draft === option.id ? 'choice-btn is-selected' : 'choice-btn'}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    )
  }

  if (type === 'PAIN_SCALE') {
    const selected = draft === 0 || draft ? Number(draft) : null
    return (
      <div>
        <div className="pain-scale" role="group" aria-label="Pain scale 0 to 10">
          {Array.from({ length: 11 }, (_, n) => (
            <button
              key={n}
              type="button"
              className={selected === n ? 'pain-btn is-selected' : 'pain-btn'}
              onClick={() => onChange(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="muted">0 = {language === 'hi' ? 'कोई दर्द नहीं' : 'No pain'} · 10 = {language === 'hi' ? 'बहुत तेज दर्द' : 'Worst pain'}</p>
      </div>
    )
  }

  if (type === 'SINGLE_SELECT' || type === 'DURATION') {
    const options = type === 'DURATION' ? DURATION_OPTIONS : question.options || []
    const current = typeof draft === 'object' ? draft.label || draft.text : draft
    return (
      <div>
        <div className="choice-grid">
          {options.map((option) => {
            const text = optionText(option, language)
            const selected = current === text || current === optionText(option, 'en')
            return (
              <button
                key={text}
                type="button"
                className={selected ? 'choice-btn is-selected' : 'choice-btn'}
                onClick={() => onChange(text)}
              >
                {text}
              </button>
            )
          })}
        </div>
        <label className="field">
          <span>{language === 'hi' ? 'या लिखें' : 'Or type your answer'}</span>
          <input
            value={typeof draft === 'string' && !options.some((o) => optionText(o, language) === draft || optionText(o, 'en') === draft) ? draft : current || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      </div>
    )
  }

  if (type === 'MULTI_SELECT') {
    const selected = asArray(draft).map((item) => (typeof item === 'string' ? item : item.label || item.text))
    return (
      <div className="choice-grid">
        {(question.options || []).map((option) => {
          const text = optionText(option, language)
          const en = optionText(option, 'en')
          const isOn = selected.includes(text) || selected.includes(en)
          return (
            <button
              key={text}
              type="button"
              className={isOn ? 'choice-btn is-selected' : 'choice-btn'}
              onClick={() => {
                const next = isOn
                  ? selected.filter((item) => item !== text && item !== en)
                  : [...selected.filter((item) => item !== 'None' && item !== 'कोई नहीं'), text]
                const cleaned =
                  text === 'None' || text === 'कोई नहीं' ? [text] : next.filter((item) => item !== 'None' && item !== 'कोई नहीं')
                onChange(cleaned)
              }}
            >
              {text}
            </button>
          )
        })}
      </div>
    )
  }

  if (type === 'COMPLAINT') {
    const currentId = draft?.id || ''
    const currentText = draft?.text || (typeof draft === 'string' ? draft : '')
    return (
      <div>
        <div className="choice-grid">
          {COMPLAINT_OPTIONS.map((option) => {
            const text = option.label[language] || option.label.en
            const selected = currentId === option.id
            return (
              <button
                key={option.id}
                type="button"
                className={selected ? 'choice-btn is-selected' : 'choice-btn'}
                onClick={() => onChange({ id: option.id, label: option.label.en, text })}
              >
                {text}
              </button>
            )
          })}
        </div>
        <label className="field">
          <span>{language === 'hi' ? 'या अपना उत्तर लिखें' : 'Or type your answer'}</span>
          <input
            value={currentId === 'other' || !currentId ? currentText : currentText}
            onChange={(e) =>
              onChange({
                id: 'other',
                label: e.target.value,
                text: e.target.value,
              })
            }
            placeholder={language === 'hi' ? 'अपनी समस्या लिखें' : 'Type your answer'}
          />
        </label>
      </div>
    )
  }

  if (type === 'NUMBER') {
    return (
      <label className="field">
        <span>{language === 'hi' ? 'संख्या लिखें' : 'Enter a number'}</span>
        <input
          inputMode="numeric"
          value={draft ?? ''}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
        />
      </label>
    )
  }

  if (type === 'DATE') {
    return (
      <label className="field">
        <span>{language === 'hi' ? 'तारीख' : 'Date'}</span>
        <input type="date" value={draft || ''} onChange={(e) => onChange(e.target.value)} />
      </label>
    )
  }

  return (
    <label className="field">
      <span>{language === 'hi' ? 'अपना उत्तर लिखें' : 'Type your answer'}</span>
      <textarea
        className="text-area"
        rows={4}
        value={typeof draft === 'string' ? draft : draft?.text || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={language === 'hi' ? 'यहाँ लिखें' : 'Type your answer'}
      />
    </label>
  )
}
