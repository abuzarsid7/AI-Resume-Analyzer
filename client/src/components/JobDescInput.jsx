import { useDropzone } from 'react-dropzone'

export default function JobDescInput({ textValue, onTextChange, fileValue, onFileChange }) {
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: {
			'application/pdf': ['.pdf'],
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
		},
		maxFiles: 1,
		onDrop: (accepted) => {
			if (accepted.length > 0) {
				onFileChange(accepted[0])
			}
		},
	})

	return (
		<div className="job-desc-container" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
			<label className="upload-field" style={{ flex: '1 1 300px' }}>
				<span>Job Description Text</span>
				<textarea
					value={textValue}
					onChange={(event) => {
						onTextChange(event.target.value)
						if (event.target.value) onFileChange(null) // clear file if typing
					}}
					placeholder="Paste the job description text here..."
					rows={6}
					disabled={!!fileValue}
				/>
			</label>

			<div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
				<span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
					Or Upload JD File
				</span>
				<div 
					className={`upload-dropzone ${isDragActive ? 'upload-dropzone--active' : ''}`} 
					style={{ flex: 1, minHeight: '140px', padding: '1rem', margin: 0 }} 
					{...getRootProps()}
				>
					<input {...getInputProps()} />
					<div className="upload-dropzone__content">
						{fileValue ? (
							<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
								<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
									<polyline points="14 2 14 8 20 8"></polyline>
									<line x1="16" y1="13" x2="8" y2="13"></line>
									<line x1="16" y1="17" x2="8" y2="17"></line>
									<polyline points="10 9 9 9 8 9"></polyline>
								</svg>
								<strong style={{ color: 'var(--accent-1)', fontSize: '0.9rem', wordBreak: 'break-all', maxWidth: '200px' }}>{fileValue.name}</strong>
								<button 
									type="button" 
									onClick={(e) => {
										e.stopPropagation()
										onFileChange(null)
									}}
									style={{ padding: '4px 8px', fontSize: '0.8rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', marginTop: '4px' }}
								>
									Remove
								</button>
							</div>
						) : (
							<>
								<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{margin: '0 auto 8px', color: 'var(--accent-2)'}}>
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
									<polyline points="17 8 12 3 7 8"></polyline>
									<line x1="12" y1="3" x2="12" y2="15"></line>
								</svg>
								<strong>{isDragActive ? 'Drop JD here...' : 'Upload JD (PDF/DOCX)'}</strong>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
