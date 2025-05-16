const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar sessão
app.use(session({
    secret: 'meusegredoromantico',
    resave: false,
    saveUninitialized: true
}));

// Middleware para servir arquivos estáticos (HTML, CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Usuário e senha fixos
const usuario = 'ari de sa';
const senha = '21/01/2025';

// Rota de login (GET)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota de login (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === usuario && password === senha) {
        req.session.logado = true;
        res.redirect('/qualidades.html');
    } else {
        res.send('Login ou senha incorretos. <a href="/">Tentar novamente</a>');
    }
});

// Middleware de proteção (todas as páginas após login)
app.use((req, res, next) => {
    if (req.session.logado || req.path === '/' || req.path === '/login') {
        next();
    } else {
        res.redirect('/');
    }
});

// Rota do quiz (POST para validar)
app.post('/quiz', (req, res) => {
    const { resposta } = req.body;
    if (resposta.toLowerCase().trim() === 'coração') {
        req.session.quizOk = true;
        res.redirect('/presente.html');
    } else {
        res.send('Resposta errada... tente novamente. <a href="/quiz.html">Voltar</a>');
    }
});

// Rota protegida da página de presente
app.get('/presente.html', (req, res) => {
    if (req.session.quizOk) {
        res.sendFile(path.join(__dirname, 'public', 'presente.html'));
    } else {
        res.redirect('/quiz.html');
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
