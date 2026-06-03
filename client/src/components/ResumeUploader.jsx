import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import api from '../api/client'

export default function ResumeUploader({ onResults, onLoadingChange }) {
	const [jobDesc, setJobDesc] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
		accept: {
			'application/pdf': ['.pdf'],
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
		},
		multiple: true,
	})

	const handleAnalyze = async () => {
		if (acceptedFiles.length === 0 || !jobDesc.trim() || loading) {
			return
		}

		setLoading(true)
		onLoadingChange?.(true)
		setError(null)

		try {
			const formData = new FormData()

			acceptedFiles.forEach((file) => {
				formData.append('resumes', file)
			})

			formData.append('jobDescription', jobDesc)

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
				<p>Drop PDF or DOCX files, then submit the job description for scoring and feedback.</p>
			</div>

			<div className="upload-dropzone" {...getRootProps()}>
				<input {...getInputProps()} />
				<div className="upload-dropzone__content">
					<strong>Drop files here or click to browse</strong>
					<span>{acceptedFiles.length} file(s) selected</span>
				</div>
			</div>

			<label className="upload-field">
				<span>Job Description</span>
				<textarea
					value={jobDesc}
					onChange={(event) => setJobDesc(event.target.value)}
					placeholder="Paste the job description here..."
					rows={8}
				/>
			</label>

			{error ? <p className="error-text">{error}</p> : null}

			<button
				className="submit-button"
				type="button"
				onClick={handleAnalyze}
				disabled={acceptedFiles.length === 0 || !jobDesc.trim() || loading}
			>
				{loading ? 'Analyzing...' : 'Analyze'}
			</button>
		</section>
	)
}
