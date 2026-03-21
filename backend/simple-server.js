const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Simple login route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@system.com' && password === 'Admin123!') {
    res.json({
      token: 'test-token',
      user: {
        id: 1,
        name: 'System Administrator User',
        email: 'admin@system.com',
        role: 'admin'
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

const PORT = 3002; // Different port to avoid conflict

app.listen(PORT, () => {
  console.log(`✅ Simple server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is busy, trying port ${PORT + 1}`);
    app.listen(PORT + 1, () => {
      console.log(`✅ Server running on port ${PORT + 1}`);
    });
  } else {
    console.error('Server error:', err);
  }
});