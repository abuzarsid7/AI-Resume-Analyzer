import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Dashboard() {
	const navigate = useNavigate()
	const { token, isLoggedIn, logout } = useContext(AuthContext)

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/login', { replace: true })
		}
	}, [isLoggedIn, navigate])

	return (
		<main className="dashboard-page">
			<div className="dashboard-card">
				<span className="pill">Dashboard</span>
				<h1>You’re in.</h1>
				<p>
					The auth flow is working and your token has been stored locally. This space is ready for
					resume uploads, scoring, and feedback panels.
				</p>

				<div className="dashboard-actions">
					<button className="submit-button" type="button" onClick={logout}>
						Log out
					</button>
				</div>

				<code className="token-chip">Token saved: {token ? 'yes' : 'no'}</code>
			</div>
		</main>
	)
}
