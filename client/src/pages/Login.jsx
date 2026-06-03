import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../api/client'

const initialForm = {
	email: '',
	password: '',
}

export default function Login() {
	const [formData, setFormData] = useState(initialForm)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const navigate = useNavigate()
	const { setToken } = useContext(AuthContext)

	const handleChange = (event) => {
		const { name, value } = event.target

		setFormData((current) => ({
			...current,
			[name]: value,
		}))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		setLoading(true)
		setError('')

		try {
			const { data } = await api.post('/auth/login', formData)

			localStorage.setItem('token', data.token)
			setToken(data.token)
			navigate('/')
		} catch (err) {
			const message = err.response?.data?.error || 'Unable to sign in. Please try again.'
			setError(message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className="auth-page">
			<section className="auth-glow auth-glow-one" aria-hidden="true" />
			<section className="auth-glow auth-glow-two" aria-hidden="true" />

			<div className="auth-shell">
				<aside className="auth-aside">
					<span className="eyebrow">AI Resume Analyzer</span>
					<h1>Sign in and review resumes with a sharper workflow.</h1>
					<p>
						Compare candidate files, generate scores, and move straight into the dashboard with a
						clean, focused interface.
					</p>

					<div className="feature-grid">
						<div>
							<strong>Fast upload</strong>
							<span>PDF and DOCX support</span>
						</div>
						<div>
							<strong>Secure access</strong>
							<span>JWT-backed auth</span>
						</div>
					</div>
				</aside>

				<section className="auth-card">
					<div className="auth-card__header">
						<span className="pill">Welcome back</span>
						<h2>Login</h2>
						<p>Use your email and password to continue.</p>
					</div>

					<form className="auth-form" onSubmit={handleSubmit}>
						<label className="field">
							<span>Email</span>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="you@example.com"
								autoComplete="email"
								required
							/>
						</label>

						<label className="field">
							<span>Password</span>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Enter your password"
								autoComplete="current-password"
								required
							/>
						</label>

						{error ? <p className="error-text">{error}</p> : null}

						<button className="submit-button" type="submit" disabled={loading}>
							{loading ? 'Signing in...' : 'Sign in'}
						</button>
					</form>

					<p className="auth-footer">
						Protected by token-based auth. After login, you’ll land on the dashboard.
					</p>
				</section>
			</div>
		</main>
	)
}
