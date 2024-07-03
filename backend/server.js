const express = require('express');
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'jadwal_kehadiran'
})

app.get('/teknisi', (req, res)=> {
    const sql = "SELECT * FROM teknisi";
    db.query(sql, (err, data)=> {
        if(err) return res.json({message: 'Error inside server'}); // Standardized error message
        return res.json(data);
    })
})

app.post('/teknisi', (req, res)=> {
    const sql = "INSERT INTO teknisi (`nama`, `crew`, `sektor`) VALUES (?, ?, ?)";
    const values = [
        req.body.nama,
        req.body.crew,
        req.body.sektor
    ];
    db.query(sql, values, (err, result) => {
        if(err) return res.json({message: 'Error inside server'}); // Standardized error message
        return res.json(result);
    });
})

app.delete('/teknisi/:id', (req, res) => {
    const sqlDelete = "DELETE FROM teknisi WHERE id = ?";
    const sqlGetMaxId = "SELECT MAX(id) AS maxId FROM teknisi";
    const teknisiId = req.params.id;

    db.query(sqlDelete, [teknisiId], (err, result) => {
        if (err) return res.json({message: 'Error inside server'}); // Standardized error message

        // Get the current max ID
        db.query(sqlGetMaxId, (err, data) => {
            if (err) return res.json({message: 'Error inside server'}); // Standardized error message

            const maxId = data[0].maxId || 0;
            const sqlResetAI = `ALTER TABLE teknisi AUTO_INCREMENT = ${maxId + 1}`;

            // Reset AUTO_INCREMENT
            db.query(sqlResetAI, (err) => {
                if (err) return res.json({message: 'Error inside server'}); // Standardized error message
                return res.json(result);
            });
        });
    });
});

app.get('/sektor', (req, res) => {
    const sql = "SELECT * FROM sektor";
    db.query(sql, (err, data) => {
        if (err) return res.json({message: 'Error inside server'}); // Standardized error message
        return res.json(data);
    });
});

app.get('/kehadiran', (req, res) => {
    const sql = "SELECT * FROM kehadiran";
    console.log("Executing SQL:", sql); // Log the SQL query
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error executing query:", err); // Log the error
            return res.json({message: 'Error inside server'}); // Standardized error message
        }
        console.log("Query result:", data); // Log the result
        return res.json(data);
    });
});

app.get('/teknisi-details', (req, res) => {
    const sql = `
        SELECT 
            t.nama AS namaTeknisi, 
            t.crew, 
            t.sektor, 
            k.status, 
            k.date
        FROM 
            teknisi t
        LEFT JOIN 
            kehadiran k ON t.id = k.idTeknisi;

    `;
    console.log("Executing SQL:", sql); // Log the SQL query
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Error executing query:", err); // Log the error
            return res.json({message: 'Error inside server'}); // Standardized error message
        }
        if (data.length === 0) {
            console.log("No data found"); // Log if no data is found
            return res.json({message: 'No data found'});
        }
        console.log("Query result:", data); // Log the result
        return res.json(data);
    });
});

app.post('/kehadiran', (req, res) => {
    const { idTeknisi, date, status } = req.body;

    // Check if the record exists
    const sqlCheck = "SELECT * FROM kehadiran WHERE idTeknisi = ? AND date = ?";
    db.query(sqlCheck, [idTeknisi, date], (err, data) => {
        if (err) return res.json({message: 'Error inside server'}); // Standardized error message

        if (data.length > 0) {
            // Update the existing record
            const sqlUpdate = "UPDATE kehadiran SET status = ? WHERE idTeknisi = ? AND date = ?";
            db.query(sqlUpdate, [status, idTeknisi, date], (err, result) => {
                if (err) return res.json({message: 'Error inside server'}); // Standardized error message
                return res.json({message: 'Status updated successfully'});
            });
        } else {
            // Insert a new record
            const sqlInsert = "INSERT INTO kehadiran (idTeknisi, date, status) VALUES (?, ?, ?)";
            db.query(sqlInsert, [idTeknisi, date, status], (err, result) => {
                if (err) return res.json({message: 'Error inside server'}); // Standardized error message
                return res.json({message: 'Status added successfully'});
            });
        }
    });
});

app.listen(8081, ()=> {
    console.log("Listening");
})
