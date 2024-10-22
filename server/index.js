const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt'); // Certifique-se de que o bcrypt está importado
const db = require('./db.js');
const { converterData } = require('../public/js/converterData.js'); // Conexão com o banco de dados
const app = express();

// Middleware para processar JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de sessão
app.use(session({
  secret: 'gRyt54g!r38B6N3#29&*Ja23FD!la89S',
  resave: false,
  saveUninitialized: false
}));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// Rota de login
app.post('/login', (req, res) => {
  const { cnpj, password } = req.body;
  // console.log('CNPJ:', cnpj);
  // console.log('Senha:', password);

  // Lógica de autenticação (ex. verificar no banco)
  // console.log('Autenticando...');
  
  db.query('SELECT * FROM empresas WHERE cnpj = ?', [cnpj], (err, results) => {
    // console.log("Chegou aqui");
    
    // console.log(results);
    console.log('Erro:', err);
    if (err) {
      return res.status(500).send('Erro no servidor');
    }
    
    if (results.length === 0) {
      return res.status(401).send('CNPJ não encontrado');
    }

    // Verificando a senha com bcrypt
    bcrypt.compare(password, results[0].password, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Erro no servidor');
      }
      if (!result) {
        console.log('Senha inválida');
        return res.status(401).send('Senha inválida');
      }

      // Autenticação bem-sucedida
      req.session.userId = results[0].empresa;
      
      // Redireciona para outra página (ex. dashboard)
      // console.log('Autenticação bem-sucedida');
      res.json({ message: 'Autenticação bem-sucedida', status: 'success' });
    });
  });
});

app.get('/dashboardProdutos', (req, res) => {
  const user = req.session.userId;
  // console.log(user);
  if (!req.session.userId) {
    return res.status(401).send('Necessita de autenticação');
  }
  
  db.query(`SELECT * FROM dashboardProdutos${user}`, (err, results) => {
    if (err) {
      return res.status(500).send('Erro no servidor');
    }
    // console.log(results);
    res.json(results);
  });
})
app.get('/dashboardVendas', (req, res) => {
  const user = req.session.userId;
  console.log(user);
  if (!req.session.userId) {
    return res.status(401).send('Necessita de autenticação');
  }
  function converterData(data_user) {
    // Verifica se o dado já é uma string no formato ISO
    const data = new Date(data_user);
  
    // Valida se a data é válida
    if (isNaN(data.getTime())) {
      console.error('Data inválida:', data_user);
      return 'Data inválida'; // Retorna um valor padrão em caso de data inválida
    }
  
    // Extrai o dia, mês e ano
    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const ano = data.getUTCFullYear();
  
    // Retorna no formato DD-MM-YYYY
    return `${dia}-${mes}-${ano}`;
  }
  
  
  db.query(`SELECT * FROM dashboardVendas${user}`, (err, results) => {
    if (err) {
      return res.status(500).send('Erro no servidor');
    }
    const dataConvertida = results.map(result => ({
      ID_VENDAS :  result.ID_VENDAS,
      DATA :  converterData(result.DATA),
      VALOR_PRODUTOS : result.VALOR_PRODUTOS,
      TOTAL_NOTA: result.TOTAL_NOTA,
      NOME: result.NOME,
      MODELO_NF: result.MODELO_NF,
      CODCLIENTE: result.CODCLIENTE,
      CFOP: result.CFOP,
      DESCRICAO_SITUACAO: result.DESCRICAO_SITUACAO
    }));
    console.log(dataConvertida);
    res.json(dataConvertida);
  });
})
app.get('/dashboardCaixa', (req, res) =>{
  const user = req.session.userId;
  // console.log(user);
  if (!req.session.userId) {
    return res.status(401).send('Necessita de autenticação');
  }

  function converterData(data_user) {
    // Verifica se o dado já é uma string no formato ISO
    const data = new Date(data_user);
  
    // Valida se a data é válida
    if (isNaN(data.getTime())) {
      console.error('Data inválida:', data_user);
      return 'Data inválida'; // Retorna um valor padrão em caso de data inválida
    }
  
    // Extrai o dia, mês e ano
    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const ano = data.getUTCFullYear();
  
    // Retorna no formato DD-MM-YYYY
    return `${dia}-${mes}-${ano}`;
  }
  db.query(`SELECT * FROM dashboardCaixa${user}`, (err, results) => {
    if (err) {
      return res.status(500).send('Erro no servidor');
    }

    const dataConvertida = results.map(result => ({
      ID_CAIXA :  result.ID_CAIXA,
      DATA :  converterData(result.DATA),
      ENTRADA : result.ENTRADA,
      SAIDA : result.SAIDA,
      VALOR: result.VALOR,
      CODIGO: result.CODIGO,
      CODCAIXA: result.CODCAIXA,
      CODOPERADOR: result.CODOPERADOR,
      CODCONTA: result.CODCONTA,
      HISTORICO: result.HISTORICO,
      TIPO_MOVIMENTO: result.TIPO_MOVIMENTO,

    }));
    // console.log(dataConvertida);
    res.json(dataConvertida);
  });
})

app.get('/dashboardComissoes', (req, res) =>{
  const user = req.session.userId;
  // console.log(user);
  if (!req.session.userId) {
    return res.status(401).send('Necessita de autenticação');
  }

  db.query(`SELECT * FROM dashboardComissoes${user}`, (err, results) => {
    if (err) {
      return res.status(500).send('Erro no servidor');
    }
    // console.log(results);
    res.json(results);
  });
})
// Rotas protegidas 
// Exemplo de rota protegida (dashboard)



// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
