export const RED_FLAG_RULES = [
  {
    id: 'chest_pain_urgent',
    type: 'POTENTIAL_RED_FLAG',
    severity: 'HIGH',
    reason: 'Chest pain with difficulty breathing, sweating, or severe pain',
    match(signals) {
      return (
        signals.isChestPain &&
        (signals.hasBreathlessness || signals.hasSweating || signals.painScore >= 8)
      )
    },
  },
  {
    id: 'neurological_warning',
    type: 'POTENTIAL_RED_FLAG',
    severity: 'HIGH',
    reason: 'Weakness, numbness, or difficulty speaking',
    match(signals) {
      return signals.hasNeuroWarning
    },
  },
  {
    id: 'severe_breathlessness',
    type: 'POTENTIAL_RED_FLAG',
    severity: 'HIGH',
    reason: 'Severe breathlessness, breathlessness at rest, or breathlessness with chest pain',
    match(signals) {
      return (
        signals.breathlessnessSevere ||
        signals.breathlessnessAtRest ||
        (signals.hasBreathlessness && (signals.isChestPain || signals.hasChestPainSymptom))
      )
    },
  },
  {
    id: 'loss_of_consciousness',
    type: 'POTENTIAL_RED_FLAG',
    severity: 'HIGH',
    reason: 'Reported loss of consciousness or fainting',
    match(signals) {
      return signals.hasLossOfConsciousness
    },
  },
  {
    id: 'unexplained_blood',
    type: 'POTENTIAL_RED_FLAG',
    severity: 'HIGH',
    reason: 'Reported blood in vomit, stool, or mucus',
    match(signals) {
      return signals.hasBloodWarning
    },
  },
]
