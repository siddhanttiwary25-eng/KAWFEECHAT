// api/health.js
//
// A simple endpoint to confirm the backend is deployed and running.
// Visit https://your-project.vercel.app/api/health in a browser after deploying.

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ status: 'ok', message: 'Backend is running.' });
}
