import { resolveComplaintId } from '../data/clinicalHistory.js'
import { RED_FLAG_RULES } from '../data/redFlagRules.js'
import { formatAnswer } from './questionEngine.js'

function textOf(value) {
  return formatAnswer(value).toLowerCase().trim()
}

function isYes(value) {
  const text = textOf(value)
  return text === 'yes' || text === 'हाँ' || text === 'हां' || text === 'haan'
}

function includesAny(value, words) {
  const text = textOf(value)
  return words.some((word) => text.includes(word))
}

function collectValues(history) {
  const answers = history.answers || {}
  const hpi = history.historyOfPresentIllness || {}
  const ros = history.reviewOfSystems || {}
  return [
    history.chiefComplaint,
    ...Object.values(answers),
    ...Object.values(hpi),
    ...Object.values(ros),
  ]
}

function painScoreOf(history) {
  const raw =
    history.answers?.cp_severity ??
    history.answers?.ap_severity ??
    history.answers?.ha_severity ??
    history.answers?.bp_severity ??
    history.historyOfPresentIllness?.severity
  if (raw === 0 || raw === '0') return 0
  const n = Number.parseInt(String(formatAnswer(raw)).replace(/[^0-9]/g, ''), 10)
  return Number.isNaN(n) ? -1 : n
}

export function extractRedFlagSignals(history) {
  const complaintId = history.chiefComplaintId || resolveComplaintId(history.answers?.chiefComplaint || history.chiefComplaint)
  const values = collectValues(history)
  const blob = values.map((item) => textOf(item)).join(' | ')

  const hasBreathlessness =
    isYes(history.answers?.cp_breathing) ||
    isYes(history.answers?.co_breathing) ||
    isYes(history.historyOfPresentIllness?.dyspnoea) ||
    complaintId === 'breathlessness' ||
    includesAny(blob, ['breathlessness', 'difficulty breathing', 'shortness of breath', 'साँस'])

  const hasSweating =
    isYes(history.answers?.cp_sweating) ||
    isYes(history.answers?.fe_sweating) ||
    isYes(history.historyOfPresentIllness?.sweating)

  const breathlessnessSevere =
    includesAny(history.answers?.br_severity, ['severe', 'तेज']) ||
    includesAny(history.historyOfPresentIllness?.severity, ['severe', 'तेज'])

  const breathlessnessAtRest = includesAny(history.answers?.br_when, ['at rest', 'आराम'])

  const hasChestPainSymptom =
    isYes(history.answers?.br_chest) ||
    isYes(history.answers?.co_chest) ||
    includesAny(blob, ['chest pain', 'सीने में दर्द'])

  const hasNeuroWarning =
    isYes(history.answers?.ha_weakness) ||
    isYes(history.answers?.ha_speech) ||
    isYes(history.answers?.ha_vision) ||
    isYes(history.answers?.bp_numbness) ||
    isYes(history.answers?.bp_weakness) ||
    isYes(history.answers?.ros_weakness) ||
    includesAny(blob, [
      'sudden weakness',
      'sudden numbness',
      'difficulty speaking',
      'facial weakness',
      'face droop',
      'cannot speak',
      'सुन्न',
    ])

  const hasLossOfConsciousness =
    isYes(history.answers?.ros_faint) ||
    includesAny(blob, ['loss of consciousness', 'faint', 'fainted', 'passed out', 'syncope', 'बेहोश'])

  const hasBloodWarning =
    isYes(history.answers?.vo_blood) ||
    isYes(history.answers?.ap_blood) ||
    isYes(history.answers?.co_blood) ||
    includesAny(blob, ['blood in stool', 'blood in vomit', 'blood in the mucus', 'hemoptysis', 'खून'])

  return {
    isChestPain: complaintId === 'chest_pain',
    hasBreathlessness,
    hasSweating,
    painScore: painScoreOf(history),
    breathlessnessSevere,
    breathlessnessAtRest,
    hasChestPainSymptom,
    hasNeuroWarning,
    hasLossOfConsciousness,
    hasBloodWarning,
  }
}

export function detectRedFlags(patientHistory) {
  const signals = extractRedFlagSignals(patientHistory || {})
  const matched = RED_FLAG_RULES.filter((rule) => rule.match(signals))
  const severity = matched.some((rule) => rule.severity === 'HIGH')
    ? 'HIGH'
    : matched.some((rule) => rule.severity === 'MEDIUM')
      ? 'MEDIUM'
      : ''

  const alerts = matched.map((rule) => ({
    type: rule.type,
    severity: rule.severity,
    reason: rule.reason,
    ruleId: rule.id,
  }))

  return {
    hasRedFlag: matched.length > 0,
    severity,
    alerts,
    matchedRules: matched.map((rule) => rule.id),
    signals,
  }
}

export function attachRedFlags(history, detection, timestamp = new Date().toISOString()) {
  const previous = history.redFlags || []
  const known = new Set(previous.map((item) => item.ruleId || item.reason))
  const added = detection.alerts
    .filter((alert) => !known.has(alert.ruleId))
    .map((alert) => ({
      ...alert,
      timestamp,
    }))

  return {
    ...history,
    hasRedFlag: detection.hasRedFlag,
    redFlagSeverity: detection.severity,
    matchedRules: detection.matchedRules,
    redFlags: [...previous, ...added],
  }
}

export function createRedFlagEngine() {
  return {
    name: 'Red-Flag Engine',
    status: 'phase-3',
    detectRedFlags,
  }
}
