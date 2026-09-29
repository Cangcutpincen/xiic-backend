const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Railway otomatis menyediakan DATABASE_URL untuk koneksi MySQL
const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/xii_c_db';
const db = mysql.createConnection(dbUrl);

db.connect(err => {
    if (err) {
        console.error('Koneksi MySQL Cloud Gagal:', err.message);
        return;
    }
    console.log('Terhubung ke Cloud Database MySQL XII C secara sukses!');
});

// Otomatis buat tabel users saat server pertama kali dinyalakan
db.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'Pengunjung',
    saldo DECIMAL(12,2) DEFAULT 50000.00,
    bio TEXT,
    status VARCHAR(255),
    banner VARCHAR(50) DEFAULT 'animated-banner-1',
    frame VARCHAR(50) DEFAULT 'none',
    pin VARCHAR(10) DEFAULT '',
    pinEnabled TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
    if (err) console.error('Gagal membuat tabel users:', err.message);
    else {
        // Masukkan Master Admin Zyen otomatis
        db.query(`INSERT IGNORE INTO users (username, password, name, role, saldo, bio, status, banner, frame) 
            VALUES ('zyen', 'Steven@0921', 'Zyen (Master Admin)', 'Administrator', 5000000, 'System Administrator & Backend Master XII C 2026/2027.', 'Menjaga sistem tetap optimal 🛡️', 'animated-banner-3', 'cyber')`);
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend Railway XII C berjalan 24/7!' });
});

// Endpoint Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username.toLowerCase(), password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Username atau password salah!' });
        res.json({ message: 'Login berhasil', user: results[0] });
    });
});

// Endpoint Ambil Semua Anggota
app.get('/api/students', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Backend aktif di port ${PORT}`);
});
