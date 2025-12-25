const TOKEN_KEY = "developer_token";
const USERNAME_KEY = "developer_username";

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function getUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function setUsername(username: string): void {
  localStorage.setItem(USERNAME_KEY, username);
}

function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

function isAuthenticated(): boolean {
  return getToken() !== null && getUsername() !== null;
}

export const authLocalStorage = {
  getToken,
  getUsername,
  setToken,
  setUsername,
  clearAuth,
  isAuthenticated,
};
