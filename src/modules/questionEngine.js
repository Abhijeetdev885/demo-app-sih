import {
  CHIEF_COMPLAINT_QUESTION,
  GENERAL_HISTORY_QUESTIONS,
  PATHWAY_QUESTIONS,
} from '../data/questions.js'
import { resolveComplaintId } from '../data/clinicalHistory.js'

function isYes(value) {
  const text = formatAnswer(value)
  return text === 'Yes' || text === 'हाँ' || text === 'हां'
}

function matchesShowIf(question, answers) {
  if (!question.showIf) return true
  const stored = answers[question.showIf.id]
  const expected = question.showIf.value
  if (expected === 'Yes') return isYes(stored)
  return formatAnswer(stored) === expected
}

export function getQuestionQueue(answers) {
  const complaintId = resolveComplaintId(answers.chiefComplaint)
  const pathway = PATHWAY_QUESTIONS[complaintId] || PATHWAY_QUESTIONS.other
  const general = GENERAL_HISTORY_QUESTIONS.filter((question) => matchesShowIf(question, answers))
  return [CHIEF_COMPLAINT_QUESTION, ...pathway, ...general]
}

export function getQuestionAt(answers, index) {
  const queue = getQuestionQueue(answers)
  return {
    question: queue[index] || null,
    index,
    total: queue.length,
    isLast: index >= queue.length - 1,
  }
}

export function formatAnswer(value) {
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'number') return String(value)
  if (Array.isArray(value)) {
    return value.map((item) => formatAnswer(item)).filter(Boolean).join(', ')
  }
  if (typeof value === 'object') {
    return value.text || value.label || value.id || ''
  }
  return String(value)
}

function getAllPathwayIds() {
  return new Set(Object.values(PATHWAY_QUESTIONS).flat().map((item) => item.id))
}

export function hasAnswerValue(value) {
  if (value === 0) return true
  if (value === null || value === undefined || value === '') return false
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'object') return Boolean(value.text || value.label || value.id)
  return String(value).trim() !== ''
}

export function formatDisplayAnswer(value, question) {
  if (!hasAnswerValue(value) && value !== 0) return ''
  if (question?.type === 'PAIN_SCALE' || question?.field === 'severity') {
    const n = typeof value === 'number' ? value : Number(value)
    if (!Number.isNaN(n) && String(value).trim() !== '' && question?.type === 'PAIN_SCALE') {
      return `${n} / 10`
    }
  }
  return formatAnswer(value)
}

function writeStructured(target, question, value) {
  if (question.id === 'chiefComplaint') {
    target.chiefComplaint = formatAnswer(value)
    target.chiefComplaintId = value?.id || resolveComplaintId(value)
    return
  }
  if (question.section === 'hpi') {
    target.historyOfPresentIllness = {
      ...target.historyOfPresentIllness,
      [question.field]: value,
    }
    return
  }
  if (question.section === 'pastMedicalHistory') {
    target.pastMedicalHistory = Array.isArray(value) ? value : [value]
    return
  }
  if (question.section === 'pastSurgicalHistory') {
    target.pastSurgicalHistory = { ...target.pastSurgicalHistory, [question.field]: value }
    return
  }
  if (question.section === 'medications') {
    target.medications = { ...target.medications, [question.field]: value }
    return
  }
  if (question.section === 'allergies') {
    target.allergies = { ...target.allergies, [question.field]: value }
    return
  }
  if (question.section === 'familyHistory') {
    target.familyHistory = { ...target.familyHistory, [question.field]: value }
    return
  }
  if (question.section === 'personalHistory') {
    target.personalHistory = { ...target.personalHistory, [question.field]: value }
    return
  }
  if (question.section === 'reviewOfSystems') {
    target.reviewOfSystems = { ...target.reviewOfSystems, [question.field]: value }
  }
}

export function buildFromAnswers(history) {
  const next = {
    chiefComplaint: '',
    chiefComplaintId: '',
    historyOfPresentIllness: {},
    pastMedicalHistory: [],
    pastSurgicalHistory: { has: '', details: '' },
    medications: { has: '', details: '' },
    allergies: { has: '', details: '' },
    familyHistory: { has: '', details: '' },
    personalHistory: {
      smoking: '',
      alcohol: '',
      occupation: '',
      diet: '',
    },
    reviewOfSystems: {},
    answers: history.answers || {},
    completed: Boolean(history.completed),
    hasRedFlag: Boolean(history.hasRedFlag),
    redFlagSeverity: history.redFlagSeverity || '',
    matchedRules: history.matchedRules || [],
    redFlags: history.redFlags || [],
    acknowledgedRedFlags: history.acknowledgedRedFlags || [],
  }
  const queue = getQuestionQueue(next.answers)
  queue.forEach((question) => {
    const value = next.answers[question.id]
    if (hasAnswerValue(value) || value === 0) {
      writeStructured(next, question, value)
    }
  })
  return next
}

export function applyAnswer(history, question, value) {
  let answers = { ...history.answers, [question.id]: value }

  if (question.id === 'chiefComplaint') {
    const prev = resolveComplaintId(history.answers?.chiefComplaint)
    const nextId = resolveComplaintId(value)
    if (prev && nextId && prev !== nextId) {
      const pathwayIds = getAllPathwayIds()
      answers = Object.fromEntries(
        Object.entries(answers).filter(([id]) => !pathwayIds.has(id)),
      )
      answers.chiefComplaint = value
    }
  }

  if (question.showIf && !isYes(answers[question.showIf.id]) && question.showIf.value === 'Yes') {
    answers[question.id] = ''
  }

  if (question.id === 'surgery_has' && !isYes(value)) answers.surgery_details = ''
  if (question.id === 'meds_has' && !isYes(value)) answers.meds_details = ''
  if (question.id === 'allergy_has' && !isYes(value)) answers.allergy_details = ''
  if (question.id === 'family_has' && !isYes(value)) answers.family_details = ''

  return buildFromAnswers({
    ...history,
    answers,
  })
}

export function getReviewSections(history, language) {
  const queue = getQuestionQueue(history.answers || {})
  const rowsFor = (predicate) =>
    queue
      .filter(predicate)
      .map((question) => {
        const value = history.answers?.[question.id]
        if (!hasAnswerValue(value) && value !== 0) return null
        return {
          id: question.id,
          label: localize(question.text, language),
          value: formatDisplayAnswer(value, question),
        }
      })
      .filter(Boolean)

  return [
    {
      key: 'chiefComplaint',
      titleKey: 'reviewChief',
      jumpId: 'chiefComplaint',
      rows: rowsFor((question) => question.id === 'chiefComplaint'),
    },
    {
      key: 'hpi',
      titleKey: 'reviewHpi',
      jumpId: queue.find((question) => question.section === 'hpi')?.id,
      rows: rowsFor((question) => question.section === 'hpi'),
    },
    {
      key: 'pmh',
      titleKey: 'reviewPmh',
      jumpId: 'pmh',
      rows: rowsFor((question) => question.section === 'pastMedicalHistory'),
    },
    {
      key: 'psh',
      titleKey: 'reviewPsh',
      jumpId: 'surgery_has',
      rows: rowsFor((question) => question.section === 'pastSurgicalHistory'),
    },
    {
      key: 'meds',
      titleKey: 'reviewMeds',
      jumpId: 'meds_has',
      rows: rowsFor((question) => question.section === 'medications'),
    },
    {
      key: 'allergies',
      titleKey: 'reviewAllergies',
      jumpId: 'allergy_has',
      rows: rowsFor((question) => question.section === 'allergies'),
    },
    {
      key: 'family',
      titleKey: 'reviewFamily',
      jumpId: 'family_has',
      rows: rowsFor((question) => question.section === 'familyHistory'),
    },
    {
      key: 'personal',
      titleKey: 'reviewPersonal',
      jumpId: 'smoke',
      rows: rowsFor((question) => question.section === 'personalHistory'),
    },
    {
      key: 'ros',
      titleKey: 'reviewRos',
      jumpId: 'ros_fever',
      rows: rowsFor((question) => question.section === 'reviewOfSystems'),
    },
  ].filter((section) => section.rows.length > 0)
}

export function buildHpiSummary(history) {
  const parts = []
  if (history.chiefComplaint) parts.push(`Chief complaint: ${formatAnswer(history.chiefComplaint)}`)
  const hpi = history.historyOfPresentIllness || {}
  Object.entries(hpi).forEach(([key, value]) => {
    const text = formatAnswer(value)
    if (text) parts.push(`${key}: ${text}`)
  })
  return parts.join('. ')
}

export function localize(value, language) {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[language] || value.en || ''
}
