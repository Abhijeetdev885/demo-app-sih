export const DEMO_PATIENTS = [
  {
    id: 'MK-1001',
    fullName: 'Raj Kumar',
    age: '45',
    gender: 'Male',
    phone: '9000001001',
    abhaId: 'Demo-ABHA-1001',
  },
  {
    id: 'MK-1002',
    fullName: 'Meera Sharma',
    age: '62',
    gender: 'Female',
    phone: '9000001002',
    abhaId: 'Demo-ABHA-1002',
  },
  {
    id: 'MK-1003',
    fullName: 'Arjun Patel',
    age: '28',
    gender: 'Male',
    phone: '9000001003',
    abhaId: 'Demo-ABHA-1003',
  },
]

export const EMPTY_NEW_PATIENT = {
  id: '',
  fullName: '',
  age: '',
  gender: '',
  phone: '',
  abhaId: '',
}

export function createNewPatientId() {
  const n = 2000 + Math.floor(Math.random() * 7000)
  return `MK-${n}`
}
