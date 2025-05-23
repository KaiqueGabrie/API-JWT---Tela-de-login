require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3000;

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_top';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const usuario = {
  email: 'user@exemplo.com',
  senha: '123456',
  id: 1,
  role: 'user'
};

app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (email === usuario.email && senha === usuario.senha) {
    const token = jwt.sign(
      { sub: usuario.id, role: usuario.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } else {
    res.status(401).json({ erro: 'Credenciais inválidas' });
  }
});

app.get('/status', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.json({ authenticated: false });
  }

  jwt.verify(token, JWT_SECRET, (err) => {
    if (err) {
      return res.json({ authenticated: false });
    }

    res.json({ authenticated: true });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
