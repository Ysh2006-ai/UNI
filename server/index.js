const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        res.json({ success: true, message: 'Login successful', token: 'mock-token' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/signup', (req, res) => {
    res.json({ success: true, message: 'Signup successful' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
