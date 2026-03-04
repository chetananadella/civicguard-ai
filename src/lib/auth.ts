export type UserRole = "citizen" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

const AUTH_KEY = "civicguard_user";

const MOCK_USERS: User[] = [
  { id: "u1", name: "Rahul Sharma", email: "rahul@example.com", role: "citizen" },
  { id: "u2", name: "Priya Admin", email: "admin@civicguard.gov", role: "admin" },
];

export function login(email: string, password: string): User | null {
  // Mock: accept any password, match by email or fallback
  const user = MOCK_USERS.find((u) => u.email === email);
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }
  return null;
}

export function register(name: string, email: string, role: UserRole): User {
  const user: User = { id: `u${Date.now()}`, name, email, role };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function getCurrentUser(): User | null {
  const stored = localStorage.getItem(AUTH_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}
