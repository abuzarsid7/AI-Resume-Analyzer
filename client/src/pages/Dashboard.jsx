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
			<button
				style={{
					position: 'absolute',
					top: '24px',
					right: '24px',
					backgroundColor: 'var(--danger)',
					color: 'white',
					padding: '8px 16px',
					borderRadius: 'var(--radius-sm)',
					fontWeight: '600',
					cursor: 'pointer',
					width: 'auto',
					boxShadow: '0 4px 12px rgba(251, 113, 133, 0.25)',
				}}
				type="button"
				onClick={logout}
			>
				Logout
			</button>
			<div className="dashboard-card">
				<div className="dashboard-topbar">
					<div>
						<span className="pill">Dashboard</span>
						<h1>Resume analysis workspace</h1>
					</div>
				</div>

				<p>
					Upload resumes, compare candidates, and review feedback below.
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

				{candidates?.length > 0 && (
					<div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
						<h3 style={{ marginBottom: '1rem', color: 'var(--accent-2)' }}>Candidate Rankings Leaderboard</h3>
						<div style={{ overflowX: 'auto' }}>
							<table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
								<thead>
									<tr style={{ borderBottom: '1px solid var(--border)' }}>
										<th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Rank</th>
										<th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Name</th>
										<th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Match Score</th>
										<th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Skills</th>
										<th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Experience</th>
									</tr>
								</thead>
								<tbody>
									{candidates.map((c, i) => (
										<tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
											<td style={{ padding: '0.75rem 0.5rem', color: i === 0 ? '#d4af37' : 'inherit', fontWeight: i === 0 ? 'bold' : 'normal' }}>
												#{i + 1} {i === 0 && '🏆'}
											</td>
											<td style={{ padding: '0.75rem 0.5rem' }}>{c.name || c.filename}</td>
											<td style={{ padding: '0.75rem 0.5rem' }}><strong>{c.scores.total}%</strong></td>
											<td style={{ padding: '0.75rem 0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{c.scores.skills}%</td>
											<td style={{ padding: '0.75rem 0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{c.scores.experience}%</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}

				{candidates?.length ? (
					<div className="results-list">
						{candidates.map((candidate, index) => (
							<ResultsCard key={`${candidate.filename}-${index}`} candidate={candidate} rank={index + 1} />
						))}
					</div>
				) : null}
			</div>
		</main>
	)
}
