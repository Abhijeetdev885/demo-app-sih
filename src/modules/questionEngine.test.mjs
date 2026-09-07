import { getQuestionQueue, applyAnswer, formatAnswer, getReviewSections } from './questionEngine.js'
import { createEmptyHistory } from '../data/clinicalHistory.js'
import { loadChestPainDemo } from './clinicalHistoryEngine.js'

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

const empty = createEmptyHistory()
const startQueue = getQuestionQueue(empty.answers)
assert(startQueue[0].id === 'chiefComplaint', 'first question is chief complaint')

let history = applyAnswer(empty, startQueue[0], { id: 'chest_pain', label: 'Chest Pain', text: 'Chest Pain' })
const chestQueue = getQuestionQueue(history.answers)
assert(chestQueue.some((q) => q.id === 'cp_severity'), 'chest pain pathway loaded')
assert(chestQueue.some((q) => q.id === 'pmh'), 'general history follows pathway')
assert(history.chiefComplaint === 'Chest Pain', 'chief complaint stored')

const feverHistory = applyAnswer(empty, startQueue[0], { id: 'fever', label: 'Fever', text: 'Fever' })
const feverQueue = getQuestionQueue(feverHistory.answers)
assert(feverQueue.some((q) => q.id === 'fe_chills'), 'fever pathway loaded')
assert(!feverQueue.some((q) => q.id === 'cp_severity'), 'chest questions not used for fever')

const demo = loadChestPainDemo()
assert(demo.chiefComplaint === 'Chest Pain', 'demo chief complaint')
assert(demo.answers.cp_severity === 7, 'demo pain scale')
assert(demo.historyOfPresentIllness.severity === 7, 'demo HPI severity stored')
assert(demo.historyOfPresentIllness.dyspnoea === 'Yes', 'demo breathlessness stored')
assert(formatAnswer(demo.pastMedicalHistory).includes('High Blood Pressure'), 'demo PMH')
assert(demo.completed === true, 'demo marked complete')
assert(getQuestionQueue(demo.answers).every((q) => q.showIf || demo.answers[q.id] !== undefined), 'demo covers visible questions')

const edited = applyAnswer(demo, chestQueue.find((q) => q.id === 'cp_severity'), 4)
assert(edited.answers.cp_severity === 4, 'edit updates answers')
assert(edited.historyOfPresentIllness.severity === 4, 'edit updates structured HPI')
assert(edited.chiefComplaint === 'Chest Pain', 'edit keeps earlier answers')

const withSurgeryNo = applyAnswer(history, chestQueue.find((q) => q.id === 'surgery_has'), 'No')
assert(
  !getQuestionQueue(withSurgeryNo.answers).some((q) => q.id === 'surgery_details'),
  'surgery details hidden when No',
)
const withSurgeryYes = applyAnswer(history, chestQueue.find((q) => q.id === 'surgery_has'), 'Yes')
assert(
  getQuestionQueue(withSurgeryYes.answers).some((q) => q.id === 'surgery_details'),
  'surgery details shown when Yes',
)

const sections = getReviewSections(demo, 'en')
const titles = sections.map((s) => s.titleKey)
assert(titles.includes('reviewChief'), 'review has chief complaint')
assert(titles.includes('reviewHpi'), 'review has HPI')
assert(titles.includes('reviewPmh'), 'review has PMH')
assert(sections.every((s) => s.rows.length > 0), 'empty review sections omitted')
assert(sections.find((s) => s.key === 'hpi').rows.some((r) => r.value.includes('7 / 10')), 'pain scale shown as 7 / 10')

const pathways = ['chest_pain', 'fever', 'abdominal_pain', 'headache', 'cough', 'breathlessness', 'vomiting', 'back_pain']
pathways.forEach((id) => {
  const h = applyAnswer(empty, startQueue[0], { id, label: id, text: id })
  const q = getQuestionQueue(h.answers)
  assert(q.length > 8, `${id} pathway has questions`)
  assert(q.some((item) => item.section === 'hpi'), `${id} has HPI questions`)
  assert(q.some((item) => item.id === 'pmh'), `${id} continues to general history`)
})

console.log('question engine tests passed')
