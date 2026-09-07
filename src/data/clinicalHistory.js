export function createEmptyHistory() {
  return {
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
    answers: {},
    completed: false,
    hasRedFlag: false,
    redFlagSeverity: '',
    matchedRules: [],
    redFlags: [],
    acknowledgedRedFlags: [],
  }
}

export const COMPLAINT_OPTIONS = [
  { id: 'chest_pain', label: { en: 'Chest Pain', hi: 'सीने में दर्द' } },
  { id: 'fever', label: { en: 'Fever', hi: 'बुखार' } },
  { id: 'abdominal_pain', label: { en: 'Abdominal Pain', hi: 'पेट दर्द' } },
  { id: 'headache', label: { en: 'Headache', hi: 'सिर दर्द' } },
  { id: 'cough', label: { en: 'Cough', hi: 'खाँसी' } },
  { id: 'breathlessness', label: { en: 'Breathlessness', hi: 'साँस फूलना' } },
  { id: 'vomiting', label: { en: 'Vomiting', hi: 'उल्टी' } },
  { id: 'back_pain', label: { en: 'Back Pain', hi: 'कमर दर्द' } },
  { id: 'other', label: { en: 'Other', hi: 'अन्य' } },
]

export function labelOf(option, language) {
  if (!option) return ''
  if (typeof option === 'string') return option
  return option.label?.[language] || option.label?.en || option.label || option.id
}

export function resolveComplaintId(value) {
  if (!value) return ''
  const raw = typeof value === 'object' ? value.id || value.text || '' : String(value)
  const v = raw.toLowerCase()
  if (COMPLAINT_OPTIONS.some((c) => c.id === raw)) return raw
  if (v.includes('chest')) return 'chest_pain'
  if (v.includes('fever') || v.includes('बुखार')) return 'fever'
  if (v.includes('abdom') || v.includes('stomach') || v.includes('पेट')) return 'abdominal_pain'
  if (v.includes('head')) return 'headache'
  if (v.includes('cough') || v.includes('खाँसी')) return 'cough'
  if (v.includes('breath') || v.includes('saans') || v.includes('साँस')) return 'breathlessness'
  if (v.includes('vomit') || v.includes('उल्टी')) return 'vomiting'
  if (v.includes('back') || v.includes('कमर')) return 'back_pain'
  return 'other'
}

export const CHEST_PAIN_DEMO_ANSWERS = {
  chiefComplaint: {
    id: 'chest_pain',
    label: 'Chest Pain',
    text: 'Chest Pain',
  },
  cp_onset: 'Since yesterday',
  cp_location: 'Centre of the chest',
  cp_character: 'Tight / Pressure',
  cp_spread: 'Left arm',
  cp_severity: 7,
  cp_worse: ['Walking / exertion'],
  cp_better: ['Rest'],
  cp_breathing: 'Yes',
  cp_sweating: 'Yes',
  cp_nausea: 'No',
  cp_before: 'No',
  pmh: ['High Blood Pressure'],
  surgery_has: 'No',
  surgery_details: '',
  meds_has: 'Yes',
  meds_details: 'Amlodipine 5 mg (demo)',
  allergy_has: 'No',
  allergy_details: '',
  family_has: 'Yes',
  family_details: 'Father had heart disease (demo)',
  smoke: 'No',
  alcohol: 'Occasional',
  occupation: 'Shopkeeper (demo)',
  diet: 'Mixed',
  ros_fever: 'No',
  ros_weakness: 'No',
  ros_weight: 'No',
  ros_faint: 'No',
}

export const CHEST_PAIN_NORMAL_DEMO_ANSWERS = {
  ...CHEST_PAIN_DEMO_ANSWERS,
  cp_severity: 3,
  cp_breathing: 'No',
  cp_sweating: 'No',
}

export const CHEST_PAIN_RED_FLAG_DEMO_ANSWERS = {
  ...CHEST_PAIN_DEMO_ANSWERS,
  cp_severity: 8,
  cp_breathing: 'Yes',
  cp_sweating: 'Yes',
}
