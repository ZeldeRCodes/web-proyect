// web-proyecto/apps/api/src/domain/UserRepository.ts
import { User } from './User'

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: { email: string; name: string; passwordHash: string; role?: 'ADMIN' | 'USER' }): Promise<User>
}
