export interface User {
  id: number;
  username: string;
  password_hash: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}
