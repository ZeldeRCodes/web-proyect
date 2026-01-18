// web-proyecto/apps/api/src/domain/User.ts
export type User = {
  id: string
  email: string
  name: string
  passwordHash: string
  role: 'ADMIN' | 'USER'
  createdAt: Date
}
