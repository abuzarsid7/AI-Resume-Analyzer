# Progress Log

## Completed So Far

- Set up the server bootstrap in `server/src/index.js` with `helmet`, `cors`, `morgan`, JSON parsing, static uploads, `/api/auth`, `/api/resume`, and a final error handler.
- Added shared server config in `server/src/config/index.js` for `PORT`, `JWT_SECRET`, `MAX_FILE_SIZE`, and `MAX_FILES`.
- Created the auth route in `server/src/routes/authRoutes.js` and a placeholder resume route in `server/src/routes/resumeRoutes.js`.
- Added shared server middleware for errors, auth token verification, and file uploads:
	- `server/src/middleware/errorHandler.js`
	- `server/src/middleware/authMiddleware.js`
	- `server/src/middleware/upload.js`
- Implemented login validation in `server/src/controllers/authController.js` so missing email/password returns 400.
- Built the client login page in `client/src/pages/Login.jsx` with controlled inputs, loading state, error handling, and redirect on success.
- Added a dashboard landing page in `client/src/pages/Dashboard.jsx`.
- Added client routing in `client/src/App.jsx` and wrapped the app with `AuthProvider` in `client/src/context/AuthContext.jsx`.
- Created a shared axios instance in `client/src/api/client.js` with token injection and 401 handling.
- Added a Vite proxy in `client/vite.config.js` so client API calls can use `/api` directly.
- Updated the shared UI styling in `client/src/index.css` with a centered glass-card login experience.

## Verified

- `npm run dev` starts the server successfully from `server/`.
- `GET /health` responds with HTTP 200.
- The client build completes successfully with `npm run build`.

## Notes

- The server default port is `5050` because `5000` is already occupied locally.
- The client login flow now uses the shared API client instead of bare axios.
