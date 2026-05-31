export interface UserProfile {
  name: string
  email: string
  picture?: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  condition: string
  vitals: {
    heartRate: number
    bloodPressure: string
    temp: number
  }
  status: 'Stable' | 'Critical' | 'Recovering'
  time: string
}
