// web-proyecto/shared/types/index.ts
export type UserDTO = {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER'
  createdAt: string
}
