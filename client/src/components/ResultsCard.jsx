import {
	RadarChart,
	Radar,
	PolarGrid,
	PolarAngleAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'

const rankBorder = {
	1: '#d4af37',
	2: '#c0c0c0',
	3: '#cd7f32',
}

export default function ResultsCard({ candidate, rank }) {
	const chartData = [
		{ subject: 'Skills', score: candidate.scores.skills },
		{ subject: 'Experience', score: candidate.scores.experience },
		{ subject: 'Education', score: candidate.scores.education },
	]

	const borderColor = rankBorder[rank] || 'rgba(255, 255, 255, 0.12)'

	return (
		<article className="results-card" style={{ borderLeftColor: borderColor }}>
			<div className="results-card__top">
				<div>
					<span className="results-card__rank">#{rank}</span>
					<h3>{candidate.name || 'Unnamed candidate'}</h3>
					<p>{candidate.email || 'No email provided'}</p>
				</div>

				<div className="results-card__score">
					<span>Total Match Score</span>
					<strong>{candidate.scores.total}%</strong>
				</div>
			</div>

			<div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
				<div><strong>Skills Score:</strong> {candidate.scores.skills}%</div>
				<div><strong>Experience Score:</strong> {candidate.scores.experience}%</div>
				<div><strong>Education Score:</strong> {candidate.scores.education}%</div>
			</div>

			{candidate.feedback?.comparison && (
				<div className="results-card__section" style={{ backgroundColor: 'rgba(124, 58, 237, 0.05)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
					<h4>JD Comparison</h4>
					<p style={{ marginBottom: '0.75rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
						<strong>Skills Match:</strong> {candidate.feedback.comparison.skills}
					</p>
					<p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
						<strong>Experience Match:</strong> {candidate.feedback.comparison.experience}
					</p>
				</div>
			)}

			<div className="results-card__chart">
				<ResponsiveContainer width="100%" height={200}>
					<RadarChart data={chartData}>
						<PolarGrid />
						<PolarAngleAxis dataKey="subject" />
						<Tooltip />
						<Radar
							name="Score"
							dataKey="score"
							stroke="#7c3aed"
							fill="#7c3aed"
							fillOpacity={0.35}
						/>
					</RadarChart>
				</ResponsiveContainer>
			</div>

			<div className="results-card__section">
				<h4>Strengths</h4>
				<ul>
					{candidate.feedback?.strengths?.map((item) => (
						<li key={item}>✓ {item}</li>
					))}
				</ul>
			</div>

			{candidate.skills?.length > 0 && (
				<div className="results-card__section">
					<h4>Skills</h4>
					<ul>
						{candidate.skills.map((item, i) => (
							<li key={i}>{item}</li>
						))}
					</ul>
				</div>
			)}

			{candidate.experience?.length > 0 && (
				<div className="results-card__section">
					<h4>Experience</h4>
					<ul>
						{candidate.experience.map((item, i) => (
							<li key={i}>{item}</li>
						))}
					</ul>
				</div>
			)}

			{candidate.education?.length > 0 && (
				<div className="results-card__section">
					<h4>Education</h4>
					<ul>
						{candidate.education.map((item, i) => (
							<li key={i}>{item}</li>
						))}
					</ul>
				</div>
			)}

			<div className="results-card__section">
				<h4>Improvements</h4>
				<ul>
					{candidate.feedback?.improvements?.map((item) => (
						<li key={item}>💡 {item}</li>
					))}
				</ul>
			</div>

			<p className="results-card__summary">{candidate.feedback?.summary}</p>
		</article>
	)
}
