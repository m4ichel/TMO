const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());

// Rotas
const frontRoutes = require('./routes/frontRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/', frontRoutes);
app.use('/users', userRoutes);

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


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
