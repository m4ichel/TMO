require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Make user data available to all views
app.use((req, res, next) => {
  res.locals.user = req.session.userId ? {
    id: req.session.userId,
    username: req.session.username,
    profile_image: req.session.profileImage || '/images/default-profile.png'
  } : null;
  next();
});

// Auth middleware
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// EJS view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(bodyParser.json());

console.log('Serving static files from:', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const routes = require('./routes');
app.use('/api', routes);

// Middleware para processar dados enviados via formulário
app.use(express.urlencoded({ extended: true }));

// Authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

// Home routes
const homeRoutes = require('./routes/homeRoutes');
app.use('/', homeRoutes);

// Profile routes
const profileRoutes = require('./routes/profileRoutes');
app.use('/', requireAuth, profileRoutes);

// Area page routes
const areaPageRoutes = require('./routes/areaPageRoutes');
app.use('/', requireAuth, areaPageRoutes);

// View routes
const viewRoutes = require('./routes/viewRoutes');
app.use('/', viewRoutes);

// Element API routes
const elementRoutes = require('./routes/elementRoutes');
app.use('/api/element', elementRoutes);

// 404 Not Found middleware
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

// 500 Internal Server Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

// Function to try starting the server on an available port
const tryListen = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use. Trying the next one...`);
      tryListen(port + 1);
    } else {
      console.error('Failed to start server:', err);
    }
  });
};

// Start with initial port
const initialPort = parseInt(process.env.PORT, 10) || 3000;
tryListen(initialPort);



// require('dotenv').config();
// const express = require('express');
// const app = express();
// const db = require('./config/db'); 
// const path = require('path');

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// db.connect()
//   .then(() => {
//     console.log('Conectado ao banco de dados PostgreSQL');

//     app.use(express.json());

//     const userRoutes = require('./routes/userRoutes');
//     app.use('/users', userRoutes);

//     const frontendRoutes = require('./routes/frontRoutes');
//     app.use('/', frontendRoutes);

//     // Middleware para lidar com erros de rota não encontrada
//     app.use((req, res, next) => {
//       res.status(404).send('Página não encontrada');
//     });

//     // Middleware para lidar com erros internos do servidor
//     app.use((err, req, res, next) => {
//       console.error(err.stack);
//       res.status(500).send('Erro no servidor');
//     });

//     const PORT = process.env.PORT || 3000;
//     app.listen(PORT, () => {
//       console.log(`Servidor rodando na porta ${PORT}`);
//     });
//   })
//   .catch(err => {
//     console.error('Erro ao conectar ao banco de dados:', err);
//   });
