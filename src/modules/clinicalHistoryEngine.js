import {
  CHEST_PAIN_DEMO_ANSWERS,
  CHEST_PAIN_NORMAL_DEMO_ANSWERS,
  CHEST_PAIN_RED_FLAG_DEMO_ANSWERS,
  createEmptyHistory,
} from '../data/clinicalHistory.js'
import { getQuestionQueue, applyAnswer } from './questionEngine.js'
import { attachRedFlags, detectRedFlags } from './redFlagEngine.js'

export function createClinicalHistoryEngine() {
  return {
    name: 'Clinical History Engine',
    status: 'phase-2',
    createEmptyHistory,
  }
}

export function loadHistoryFromAnswers(answers) {
  let history = createEmptyHistory()
  const seedQueue = getQuestionQueue({ chiefComplaint: answers.chiefComplaint })
  seedQueue.forEach((question) => {
    if (answers[question.id] !== undefined) {
      history = applyAnswer(history, question, answers[question.id])
    }
  })
  history.completed = true
  const detection = detectRedFlags(history)
  return attachRedFlags(history, detection)
}

export function loadChestPainDemo() {
  return loadHistoryFromAnswers(CHEST_PAIN_DEMO_ANSWERS)
}

export function loadNormalChestPainDemo() {
  return loadHistoryFromAnswers(CHEST_PAIN_NORMAL_DEMO_ANSWERS)
}

export function loadChestPainRedFlagDemo() {
  return loadHistoryFromAnswers(CHEST_PAIN_RED_FLAG_DEMO_ANSWERS)
}
