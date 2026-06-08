import app from './app.js';

const PORT = process.env['PORT'] ?? 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Department summary: http://localhost:${PORT}/api/users/department-summary`);
});
