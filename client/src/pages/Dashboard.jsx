import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import ResumeUploader from '../components/ResumeUploader'
import ResultsCard from '../components/ResultsCard'

export default function Dashboard() {
	const navigate = useNavigate()
	const { token, isLoggedIn, logout } = useContext(AuthContext)
	const [candidates, setCandidates] = useState(null)
	const [analyzing, setAnalyzing] = useState(false)
	const [uploaderKey, setUploaderKey] = useState(0)

	const summary = useMemo(() => {
		if (!candidates || candidates.length === 0) {
			return null
		}

		const bestMatch = candidates[0]
		return `${candidates.length} candidates analyzed, best match: ${bestMatch.name || 'Unnamed candidate'} (${bestMatch.scores.total}%)`
	}, [candidates])

	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/login', { replace: true })
		}
	}, [isLoggedIn, navigate])

	const handleReset = () => {
		setCandidates(null)
		setAnalyzing(false)
		setUploaderKey((current) => current + 1)
	}

	return (
		<main className="dashboard-page">
			<div className="dashboard-card">
				<div className="dashboard-topbar">
					<div>
						<span className="pill">Dashboard</span>
						<h1>Resume analysis workspace</h1>
					</div>
					<button className="submit-button dashboard-topbar__logout" type="button" onClick={logout}>
						Logout
					</button>
				</div>

				<p>
					The auth flow is working and your token has been stored locally. Upload resumes, compare
					candidates, and review feedback below.
				</p>

				<ResumeUploader
					key={uploaderKey}
					onResults={setCandidates}
					onLoadingChange={setAnalyzing}
				/>

				<div className="dashboard-actions dashboard-actions--split">
					<button className="submit-button" type="button" onClick={handleReset} disabled={!candidates && !analyzing}>
						Reset
					</button>
				</div>

				{analyzing ? <p className="dashboard-status">Analyzing...</p> : null}

				{summary ? <div className="dashboard-summary">{summary}</div> : null}

				{candidates?.length ? (
					<div className="results-list">
						{candidates.map((candidate, index) => (
							<ResultsCard key={`${candidate.filename}-${index}`} candidate={candidate} rank={index + 1} />
						))}
					</div>
				) : null}

				<code className="token-chip">Token saved: {token ? 'yes' : 'no'}</code>
			</div>
		</main>
	)
}
