export interface UserInterface {
  email: string;
  name: string;
  username: string;
  image?: string | null;
  role: Role;
}

enum Role {
  DRIVER = "DRIVER",
  ADMIN = "ADMIN",
}
