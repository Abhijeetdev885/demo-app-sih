import { applyAnswer, getQuestionQueue } from './questionEngine.js'
import { createEmptyHistory } from '../data/clinicalHistory.js'
import { detectRedFlags } from './redFlagEngine.js'
import {
  loadChestPainDemo,
  loadChestPainRedFlagDemo,
  loadNormalChestPainDemo,
} from './clinicalHistoryEngine.js'

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

function withAnswers(map) {
  let history = createEmptyHistory()
  const start = getQuestionQueue({}).find((q) => q.id === 'chiefComplaint')
  if (map.chiefComplaint) {
    history = applyAnswer(history, start, map.chiefComplaint)
  }
  const queue = getQuestionQueue(history.answers)
  queue.forEach((question) => {
    if (map[question.id] !== undefined) {
      history = applyAnswer(history, question, map[question.id])
    }
  })
  return history
}

const chest = { id: 'chest_pain', label: 'Chest Pain', text: 'Chest Pain' }

const normal = detectRedFlags(
  withAnswers({
    chiefComplaint: chest,
    cp_severity: 3,
    cp_breathing: 'No',
    cp_sweating: 'No',
  }),
)
assert(!normal.hasRedFlag, 'normal chest pain has no red flag')

const severePain = detectRedFlags(
  withAnswers({
    chiefComplaint: chest,
    cp_severity: 8,
    cp_breathing: 'No',
    cp_sweating: 'No',
  }),
)
assert(severePain.hasRedFlag, 'chest pain + severe pain flags')
assert(severePain.matchedRules.includes('chest_pain_urgent'), 'matched chest pain rule')

const withBreathing = detectRedFlags(
  withAnswers({
    chiefComplaint: chest,
    cp_severity: 4,
    cp_breathing: 'Yes',
    cp_sweating: 'No',
  }),
)
assert(withBreathing.hasRedFlag, 'chest pain + breathlessness flags')

const withSweating = detectRedFlags(
  withAnswers({
    chiefComplaint: chest,
    cp_severity: 4,
    cp_breathing: 'No',
    cp_sweating: 'Yes',
  }),
)
assert(withSweating.hasRedFlag, 'chest pain + sweating flags')

const severeBreath = detectRedFlags(
  withAnswers({
    chiefComplaint: { id: 'breathlessness', label: 'Breathlessness', text: 'Breathlessness' },
    br_severity: 'Severe',
    br_when: 'During activity',
    br_chest: 'No',
  }),
)
assert(severeBreath.hasRedFlag, 'severe breathlessness flags')
assert(severeBreath.matchedRules.includes('severe_breathlessness'), 'matched breathlessness rule')

const restBreath = detectRedFlags(
  withAnswers({
    chiefComplaint: { id: 'breathlessness', label: 'Breathlessness', text: 'Breathlessness' },
    br_severity: 'Mild',
    br_when: 'At rest',
    br_chest: 'No',
  }),
)
assert(restBreath.hasRedFlag, 'breathlessness at rest flags')

const neuro = detectRedFlags(
  withAnswers({
    chiefComplaint: { id: 'headache', label: 'Headache', text: 'Headache' },
    ha_weakness: 'Yes',
    ha_speech: 'No',
  }),
)
assert(neuro.hasRedFlag, 'neurological warning flags')
assert(neuro.matchedRules.includes('neurological_warning'), 'matched neuro rule')

const faint = detectRedFlags(
  withAnswers({
    chiefComplaint: { id: 'other', label: 'Other', text: 'Felt unwell' },
    ros_faint: 'Yes',
  }),
)
assert(faint.hasRedFlag, 'loss of consciousness flags')
assert(faint.matchedRules.includes('loss_of_consciousness'), 'matched faint rule')

const blood = detectRedFlags(
  withAnswers({
    chiefComplaint: { id: 'vomiting', label: 'Vomiting', text: 'Vomiting' },
    vo_blood: 'Yes',
  }),
)
assert(blood.hasRedFlag, 'blood in vomit flags')
assert(blood.matchedRules.includes('unexplained_blood'), 'matched blood rule')

const stoolBlood = detectRedFlags(
  withAnswers({
    chiefComplaint: { id: 'abdominal_pain', label: 'Abdominal Pain', text: 'Abdominal Pain' },
    ap_blood: 'Yes',
  }),
)
assert(stoolBlood.hasRedFlag, 'blood in stool flags')

const mucusBlood = detectRedFlags(
  withAnswers({
    chiefComplaint: { id: 'cough', label: 'Cough', text: 'Cough' },
    co_blood: 'Yes',
  }),
)
assert(mucusBlood.hasRedFlag, 'blood in mucus flags')

const speech = detectRedFlags(
  withAnswers({
    chiefComplaint: { id: 'headache', label: 'Headache', text: 'Headache' },
    ha_speech: 'Yes',
    ha_weakness: 'No',
  }),
)
assert(speech.hasRedFlag, 'difficulty speaking flags')

const demoRed = detectRedFlags(loadChestPainRedFlagDemo())
assert(demoRed.hasRedFlag, 'red-flag demo triggers')
assert(demoRed.severity === 'HIGH', 'red-flag demo is HIGH')

const demoNormal = detectRedFlags(loadNormalChestPainDemo())
assert(!demoNormal.hasRedFlag, 'normal chest pain demo does not trigger')

const originalDemo = detectRedFlags(loadChestPainDemo())
assert(originalDemo.hasRedFlag, 'original demo with breathing and sweating flags')

console.log('red-flag engine tests passed')
