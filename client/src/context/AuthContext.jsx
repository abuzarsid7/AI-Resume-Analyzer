import { createContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem('token'))
	const navigate = useNavigate()

	useEffect(() => {
		if (token) {
			localStorage.setItem('token', token)
		} else {
			localStorage.removeItem('token')
		}
	}, [token])

	const logout = () => {
		localStorage.removeItem('token')
		setToken(null)
		navigate('/login', { replace: true })
	}

	const value = useMemo(
		() => ({
			token,
			isLoggedIn: Boolean(token),
			logout,
			setToken,
		}),
		[token],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
