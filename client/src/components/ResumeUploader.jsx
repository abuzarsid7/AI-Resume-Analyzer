import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import api from '../api/client'

import JobDescInput from './JobDescInput'

export default function ResumeUploader({ onResults, onLoadingChange }) {
	const [jobDesc, setJobDesc] = useState('')
	const [jobDescFile, setJobDescFile] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const [selectedFiles, setSelectedFiles] = useState([])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: {
			'application/pdf': ['.pdf'],
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
		},
		multiple: true,
		onDrop: (accepted) => {
			setSelectedFiles((prev) => [...prev, ...accepted])
		}
	})

	const handleAnalyze = async () => {
		if (selectedFiles.length === 0 || (!jobDesc.trim() && !jobDescFile) || loading) {
			return
		}

		setLoading(true)
		onLoadingChange?.(true)
		setError(null)

		try {
			const formData = new FormData()

			selectedFiles.forEach((file) => {
				formData.append('resumes', file)
			})

			if (jobDescFile) {
				formData.append('jobDescriptionFile', jobDescFile)
			} else {
				formData.append('jobDescription', jobDesc)
			}

			const { data } = await api.post('/resume/analyze', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			onResults?.(data.candidates)
		} catch (err) {
			setError(err.response?.data?.error || 'Unable to analyze resumes. Please try again.')
		} finally {
			setLoading(false)
			onLoadingChange?.(false)
		}
	}

	return (
		<section className="upload-panel">
			<div className="upload-panel__header">
				<span className="pill">Resume analyzer</span>
				<h2>Upload resumes and add a job description</h2>
				<p>Drop PDF or DOCX resume files below, then paste or upload the job description for scoring.</p>
			</div>

			<div className={`upload-dropzone ${isDragActive ? 'upload-dropzone--active' : ''}`} {...getRootProps()}>
				<input {...getInputProps()} />
				<div className="upload-dropzone__content">
					<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{margin: '0 auto 12px', color: 'var(--accent-2)'}}>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
						<polyline points="17 8 12 3 7 8"></polyline>
						<line x1="12" y1="3" x2="12" y2="15"></line>
					</svg>
					<strong>{isDragActive ? 'Drop files now...' : 'Drop RESUMES here or click to browse'}</strong>
					<span>{selectedFiles.length > 0 ? `${selectedFiles.length} resume(s) selected` : 'Supports .pdf and .docx'}</span>
				</div>
			</div>

			<div style={{ marginTop: '2rem' }}>
				<JobDescInput 
					textValue={jobDesc} 
					onTextChange={setJobDesc} 
					fileValue={jobDescFile} 
					onFileChange={setJobDescFile} 
				/>
			</div>

			{error ? <p className="error-text">{error}</p> : null}

			<button
				className="submit-button"
				type="button"
				onClick={handleAnalyze}
				disabled={selectedFiles.length === 0 || (!jobDesc.trim() && !jobDescFile) || loading}
			>
				{loading ? 'Analyzing...' : 'Analyze'}
			</button>
		</section>
	)
}
