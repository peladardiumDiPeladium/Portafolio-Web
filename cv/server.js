const express = require('express');
const mysql = require('mysql2');

const app = express();

// Middleware para procesar JSON y archivos estáticos
app.use(express.json());
app.use(express.static(__dirname)); // Sirve el index.html y assets

// Conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',        
    user: 'root',             
    password: '',             
    database: 'portafolio_db' 
});

db.connect(err => {
    if (err) {
        console.error('Error de conexión a MySQL:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Endpoint para procesar el formulario de contacto
app.post('/api/contacto', (req, res) => {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const query = 'INSERT INTO mensajes (nombre, email, mensaje) VALUES (?, ?, ?)';
    db.query(query, [nombre, email, mensaje], (err, result) => {
        if (err) {
            console.error('Error al insertar en la BD:', err);
            return res.status(500).json({ error: 'Error interno al guardar el mensaje.' });
        }
        res.status(200).json({ message: 'Mensaje guardado correctamente.' });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});