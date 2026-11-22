import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
const KEY = 'hopeHavenUser'

export function AuthProvider({ children }) {
  const [currentUser, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
  })

  const setCurrentUser = (u) => {
    setUser(u)
    if (u) localStorage.setItem(KEY, JSON.stringify(u))
    else localStorage.removeItem(KEY)
  }

  const login = (email, password, role, users) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    )
    if (!user) return { success: false, error: 'Invalid email or password.' }
    if (user.role !== role)
      return { success: false, error: `This account is not a ${role === 'admin' ? 'Administrator' : 'Staff'} account.` }
    setCurrentUser(user)
    return { success: true }
  }

  const register = (form, users) => {
    if (form.password !== form.confirmPassword) return { success: false, error: 'Passwords do not match.' }
    if (users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase()))
      return { success: false, error: 'Email already registered.' }
    return { success: true }
  }

  const logout = () => setCurrentUser(null)

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)