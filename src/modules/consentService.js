export function recordConsent({ patientId, language, given }) {
  return {
    patientId,
    language,
    given,
    recordedAt: new Date().toISOString(),
    prototype: true,
  }
}
