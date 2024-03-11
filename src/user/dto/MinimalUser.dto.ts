import { User } from '../user.entity';

export interface MinimalUserDto {
  id: string;
  email: string;
  pseudo: string;
}

export function userToMinimalUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    pseudo: user.pseudo,
  };
}
