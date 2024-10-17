const mysql = require('mysql2');

// Crie a conexão com os dados da Hostinger
const connection = mysql.createPool({
  host: '193.203.175.133', // substitua pelo seu host
  user: 'u585686210_root',         // substitua pelo nome de usuário
  password: 'Vagalume@2024',       // substitua pela sua senha
  database: 'u585686210_DashboardDB' // substitua pelo nome do banco de dados
});

// connection.connect((err) => {
//   if (err) {
//     console.error('Erro ao conectar ao MySQL:', err);
//     return;
//   }
//   console.log('Conectado ao MySQL!');
// });

module.exports = connection;

