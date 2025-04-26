const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 5000;

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'health_system',
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to the MySQL database.');
});

app.use(cors());
app.use(express.json());

// ---------------------------------------------
// ROUTES
// ---------------------------------------------

// 🔍 Get all or search clients
app.get('/api/clients', (req, res) => {
  const search = req.query.search || '';
  const query = `
    SELECT c.*, GROUP_CONCAT(p.name) AS programs
    FROM clients c
    LEFT JOIN enrollments e ON c.id = e.client_id
    LEFT JOIN programs p ON e.program_id = p.id
    WHERE c.first_name LIKE ? OR c.last_name LIKE ? OR c.email LIKE ?
    GROUP BY c.id
  `;
  db.query(query, [`%${search}%`, `%${search}%`, `%${search}%`], (err, results) => {
    if (err) {
      console.error("Error fetching clients:", err);
      res.status(500).send('Database error');
    } else {
      const formatted = results.map(row => ({
        ...row,
        programs: row.programs ? row.programs.split(',') : []
      }));
      res.json(formatted);
    }
  });
});

// 🔎 Get single client by ID (Newly added)
app.get('/api/clients/:id', (req, res) => {
  const clientId = req.params.id;

  const query = `
    SELECT c.*, GROUP_CONCAT(p.name) AS programs
    FROM clients c
    LEFT JOIN enrollments e ON c.id = e.client_id
    LEFT JOIN programs p ON e.program_id = p.id
    WHERE c.id = ?
    GROUP BY c.id
  `;

  db.query(query, [clientId], (err, results) => {
    if (err) {
      console.error("Error fetching client:", err);
      res.status(500).send('Database error');
    } else if (results.length === 0) {
      res.status(404).send("Client not found");
    } else {
      const row = results[0];
      const formatted = {
        ...row,
        programs: row.programs ? row.programs.split(',') : []
      };
      res.json(formatted);
    }
  });
});

// 📄 Get all programs
app.get('/api/programs', (req, res) => {
  db.query(`SELECT * FROM programs`, (err, results) => {
    if (err) {
      console.error("Error fetching programs:", err);
      res.status(500).send('Database error');
    } else {
      res.json(results);
    }
  });
});

// 🔍 Get program by name
app.get('/api/programs/search', (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).send("Program name is required");
  
  db.query(`SELECT * FROM programs WHERE name = ?`, [name], (err, results) => {
    if (err) {
      console.error("Error searching program:", err);
      res.status(500).send('Database error');
    } else if (results.length === 0) {
      res.status(404).send("Program not found");
    } else {
      res.json(results[0]);
    }
  });
});

// 👤 Register new client
app.post('/api/clients', (req, res) => {
  const { first_name, last_name, email, phone, date_of_birth } = req.body;
  if (!first_name || !last_name || !email || !phone || !date_of_birth) {
    return res.status(400).send("Missing client fields");
  }

  const query = `
    INSERT INTO clients (first_name, last_name, email, phone, date_of_birth)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(query, [first_name, last_name, email, phone, date_of_birth], (err, result) => {
    if (err) {
      console.error("Error inserting client:", err);
      res.status(500).send('Database error');
    } else {
      res.status(201).json({
        id: result.insertId,
        first_name,
        last_name,
        email,
        phone,
        date_of_birth
      });
    }
  });
});

// ➕ Enroll client to a program
app.post('/api/enrollments', (req, res) => {
  const { client_id, program_id } = req.body;
  if (!client_id || !program_id) {
    return res.status(400).send("Missing client_id or program_id");
  }

  const query = `INSERT INTO enrollments (client_id, program_id) VALUES (?, ?)`;
  db.query(query, [client_id, program_id], (err, result) => {
    if (err) {
      console.error("Error enrolling client:", err);
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).send("Client already enrolled in this program");
      } else {
        res.status(500).send('Database error');
      }
    } else {
      res.status(201).json({ id: result.insertId, client_id, program_id });
    }
  });
});

// ➕ Create new program
app.post('/api/programs', (req, res) => {
  const { name, description = "" } = req.body;
  if (!name) return res.status(400).send("Program name required");

  const query = `INSERT INTO programs (name, description) VALUES (?, ?)`;
  db.query(query, [name, description], (err, result) => {
    if (err) {
      console.error("Error inserting program:", err);
      res.status(500).send('Database error');
    } else {
      res.status(201).json({ id: result.insertId, name, description });
    }
  });
});

// ✅ Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
