import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../api/client'

const initialForm = {
	name: '',
	email: '',
	password: '',
}

export default function Signup() {
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
			const { data } = await api.post('/auth/signup', formData)

			localStorage.setItem('token', data.token)
			setToken(data.token)
			navigate('/')
		} catch (err) {
			const message = err.response?.data?.error || 'Unable to sign up. Please try again.'
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
					<h1>Sign up and review resumes with a sharper workflow.</h1>
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
						<span className="pill">Create account</span>
						<h2>Sign up</h2>
						<p>Enter your details to create an account.</p>
					</div>

					<form className="auth-form" onSubmit={handleSubmit}>
						<label className="field">
							<span>Name</span>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="John Doe"
								autoComplete="name"
								required
							/>
						</label>

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
								placeholder="Create a password"
								autoComplete="new-password"
								required
							/>
						</label>

						{error ? <p className="error-text">{error}</p> : null}

						<button className="submit-button" type="submit" disabled={loading}>
							{loading ? 'Signing up...' : 'Sign up'}
						</button>
					</form>

					<p className="auth-footer" style={{ textAlign: 'center', marginTop: '1rem' }}>
						Already have an account? <Link to="/login" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 'bold' }}>Log in</Link>
					</p>
				</section>
			</div>
		</main>
	)
}
