const express = require('express');
const pool = require('./db');
const db = require('./firebase'); 
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const firebaseDB = require('./firebase.js');




const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, '..', 'assets')));
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
// app.use((req, res, next) => {
//   const protectedPages = ['/home.html']; 
//   if (protectedPages.includes(req.url) && !req.session.isAuthenticated) {
//     res.status(401).redirect('/index.html');
//   } else {
//     next();
//   }
// });

function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    next(); 
  } else {
    res.status(401).send('Unauthorized'); // Adiciona uma resposta de erro para o navegador.redirect('/login');
  }
}

app.get('/api/dashboard', async (req, res) => {
  try {
    const response = await pool.query(`SELECT "CODIGO", "CODBARRA", "PRODUTO", "UNIDADE", "DATA_CADASTRO", "DATA_ULTIMACOMPRA", "NOTAFISCAL", "PRECOCUSTO", "PRECOVENDA", "ESTOQUE_ATUAL"FROM "C000025"inner join "C000100" on ("CODPRODUTO"  = "CODIGO" )`);
    const responseCaixa = await pool.query(`SELECT "CODIGO", "CODCAIXA", "CODOPERADOR", "DATA", "SAIDA", "ENTRADA", "CODCONTA", "HISTORICO", 
       CASE 
           WHEN "MOVIMENTO" = 0 THEN 'IMPLANTAÇÃO DE SALDO'
           WHEN "MOVIMENTO" = 1 THEN 'LANCTO. ENTRADA'
           WHEN "MOVIMENTO" = 2 THEN 'LANCTO. SAÍDA'
           WHEN "MOVIMENTO" = 3 THEN 'VENDA DINHEIRO'
           WHEN "MOVIMENTO" = 4 THEN 'VENDA CREDIÁRIO'
           WHEN "MOVIMENTO" = 5 THEN 'VENDA CHEQUE À VISTA'
           WHEN "MOVIMENTO" = 6 THEN 'VENDA CHEQUE À PRAZO'
           WHEN "MOVIMENTO" = 7 THEN 'VENDA CARTÃO CRÉDITO'
           WHEN "MOVIMENTO" = 8 THEN 'VENDA CARTÃO DÉBITO'
           WHEN "MOVIMENTO" = 9 THEN 'RECEBTO. DINHEIRO'
           WHEN "MOVIMENTO" = 10 THEN 'RECEBTO. CHEQUE A.V.'
           WHEN "MOVIMENTO" = 11 THEN 'RECEBTO. CHEQUE A.P.'
           WHEN "MOVIMENTO" = 12 THEN 'RECEBTO. CARTÃO'
           WHEN "MOVIMENTO" = 13 THEN 'RECEBTO. JUROS'
           WHEN "MOVIMENTO" = 14 THEN 'DESCONTO NO RECEBTO'
           WHEN "MOVIMENTO" = 15 THEN 'RECEBTO. BOLETO'
           WHEN "MOVIMENTO" = 16 THEN 'OUTRAS ENTRADAS'
           WHEN "MOVIMENTO" = 17 THEN 'OUTRAS SAÍDAS'
           WHEN "MOVIMENTO" = 18 THEN 'O.S. DINHEIRO'
           WHEN "MOVIMENTO" = 19 THEN 'O.S. CREDIÁRIO'
           WHEN "MOVIMENTO" = 20 THEN 'O.S. CHEQUE À VISTA'
           WHEN "MOVIMENTO" = 21 THEN 'O.S. CARTÃO CRÉDITO'
           WHEN "MOVIMENTO" = 22 THEN 'O.S. PIX'
           WHEN "MOVIMENTO" = 23 THEN 'O.S. CARTÃO DÉBITO'
           WHEN "MOVIMENTO" = 25 THEN 'PAGTO - CAIXA'
           WHEN "MOVIMENTO" = 26 THEN 'PAGTO - BANCO'
           WHEN "MOVIMENTO" = 27 THEN 'PAGTO - CHEQUE TERC.'
           WHEN "MOVIMENTO" = 40 THEN 'VENDA TRANSFERÊNCIA'
           WHEN "MOVIMENTO" = 41 THEN 'TROCA/CRÉDITO'
           WHEN "MOVIMENTO" = 42 THEN 'PIX'
           ELSE 'OUTRO'
       END AS "TIPO_MOVIMENTO",
       "VALOR", "CODNFSAIDA", "CODIGO_VENDA", "HORA"
  FROM "C000044" WHERE "DATA" >= CURRENT_DATE - INTERVAL '4 months';
`);
    const responseVendas = await pool.query(`SELECT "C000061"."CODIGO", "C000061"."NUMERO", "CFOP", "DATA", "CODCLIENTE", "VALOR_PRODUTOS", "TOTAL_NOTA", "NOME","DESCONTO", "MODELO_NF", 
       CASE 
           WHEN "NFE_SITUACAO" = 3 THEN 'ORÇAMENTO'
           WHEN "NFE_SITUACAO" = 5 THEN 'CONTIGENCIA'
           WHEN "NFE_SITUACAO" = 6 THEN 'EMITIDA'
           WHEN "NFE_SITUACAO" = 8 THEN 'CANCELADA'
           
           ELSE 'OUTRO'
       END AS "DESCRICAO_SITUACAO"
  FROM "C000061"
  INNER JOIN "C000007" ON ("C000007"."CODIGO" = "CODCLIENTE")
  WHERE "DATA" >= CURRENT_DATE - INTERVAL '4 months';
`);
    const responseItensVenda = await pool.query(`SELECT "CODNOTA", "CODPRODUTO", "QTDE", "UNITARIO", "TOTAL",  "C000062"."DESCONTO", "SUBTOTAL", "PRODUTO" FROM "C000062"
    INNER JOIN "C000061" ON ("C000061"."CODIGO" = "CODNOTA")
    INNER JOIN "C000025" ON ("C000025"."CODIGO" = "CODPRODUTO");
`);

    const data = response.rows;
    const dataCaixa = responseCaixa.rows;
    const dataVendas = responseVendas.rows;
    const dataItensVenda = responseItensVenda.rows;



   



   
    for (let index = 0; index < 10; index++) {
      await db.collection('produtosEstoque').doc(`${index}`).set(data[index]) // Use set() em vez de add()
      .then(() => {
        console.log('Document successfully written in produtosEstoque!');
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
      
      
    }
    for (let index = 0; index < 10; index++) {
      
      await db.collection('Caixa').doc(`${index}`).set(dataCaixa[index]) // Use set() em vez de add()
      .then(() => {
        console.log('Document successfully written in Caixa!');
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
      
    }
      
       // Incrementa o id
     for (let index = 0; index < 10; index++) {
      
      await db.collection('Vendas').doc(`${index}`).set(dataVendas[index]) // Use set() em vez de add()
      .then(() => {
        console.log('Document successfully written in Vendas!');
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
      
    }

    for (let index = 0; index < 10; index++) {
      await db.collection('ItensVenda').doc(`${index}`).set(dataItensVenda[index]) // Use set() em vez de add()
      .then(() => {
        console.log('Document successfully written in ItensVenda!');
      })
      .catch((error) => {
        console.error('Error writing document: ', error);
      });
    }     

    // Envia a resposta final após processar os dados
    res.json({ data, dataCaixa, dataVendas, dataItensVenda });
  
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error'); // Adiciona uma resposta de erro
  }
});


app.delete('/api/delete', async (req, res) => {
  const response = await pool.query(`SELECT "CODIGO", "CODBARRA", "PRODUTO", "UNIDADE", "DATA_CADASTRO", "DATA_ULTIMACOMPRA", "NOTAFISCAL", "PRECOCUSTO", "PRECOVENDA", "ESTOQUE_ATUAL"FROM "C000025"inner join "C000100" on ("CODPRODUTO"  = "CODIGO" )`);
  const responseCaixa = await pool.query(`SELECT "CODIGO", "CODCAIXA", "CODOPERADOR", "DATA", "SAIDA", "ENTRADA", "CODCONTA", "HISTORICO", 
     CASE 
         WHEN "MOVIMENTO" = 0 THEN 'IMPLANTAÇÃO DE SALDO'
         WHEN "MOVIMENTO" = 1 THEN 'LANCTO. ENTRADA'
         WHEN "MOVIMENTO" = 2 THEN 'LANCTO. SAÍDA'
         WHEN "MOVIMENTO" = 3 THEN 'VENDA DINHEIRO'
         WHEN "MOVIMENTO" = 4 THEN 'VENDA CREDIÁRIO'
         WHEN "MOVIMENTO" = 5 THEN 'VENDA CHEQUE À VISTA'
         WHEN "MOVIMENTO" = 6 THEN 'VENDA CHEQUE À PRAZO'
         WHEN "MOVIMENTO" = 7 THEN 'VENDA CARTÃO CRÉDITO'
         WHEN "MOVIMENTO" = 8 THEN 'VENDA CARTÃO DÉBITO'
         WHEN "MOVIMENTO" = 9 THEN 'RECEBTO. DINHEIRO'
         WHEN "MOVIMENTO" = 10 THEN 'RECEBTO. CHEQUE A.V.'
         WHEN "MOVIMENTO" = 11 THEN 'RECEBTO. CHEQUE A.P.'
         WHEN "MOVIMENTO" = 12 THEN 'RECEBTO. CARTÃO'
         WHEN "MOVIMENTO" = 13 THEN 'RECEBTO. JUROS'
         WHEN "MOVIMENTO" = 14 THEN 'DESCONTO NO RECEBTO'
         WHEN "MOVIMENTO" = 15 THEN 'RECEBTO. BOLETO'
         WHEN "MOVIMENTO" = 16 THEN 'OUTRAS ENTRADAS'
         WHEN "MOVIMENTO" = 17 THEN 'OUTRAS SAÍDAS'
         WHEN "MOVIMENTO" = 18 THEN 'O.S. DINHEIRO'
         WHEN "MOVIMENTO" = 19 THEN 'O.S. CREDIÁRIO'
         WHEN "MOVIMENTO" = 20 THEN 'O.S. CHEQUE À VISTA'
         WHEN "MOVIMENTO" = 21 THEN 'O.S. CARTÃO CRÉDITO'
         WHEN "MOVIMENTO" = 22 THEN 'O.S. PIX'
         WHEN "MOVIMENTO" = 23 THEN 'O.S. CARTÃO DÉBITO'
         WHEN "MOVIMENTO" = 25 THEN 'PAGTO - CAIXA'
         WHEN "MOVIMENTO" = 26 THEN 'PAGTO - BANCO'
         WHEN "MOVIMENTO" = 27 THEN 'PAGTO - CHEQUE TERC.'
         WHEN "MOVIMENTO" = 40 THEN 'VENDA TRANSFERÊNCIA'
         WHEN "MOVIMENTO" = 41 THEN 'TROCA/CRÉDITO'
         WHEN "MOVIMENTO" = 42 THEN 'PIX'
         ELSE 'OUTRO'
     END AS "TIPO_MOVIMENTO",
     "VALOR", "CODNFSAIDA", "CODIGO_VENDA", "HORA"
FROM "C000044";
`);
  const responseVendas = await pool.query(`SELECT "C000061"."CODIGO", "C000061"."NUMERO", "CFOP", "DATA", "CODCLIENTE", "VALOR_PRODUTOS", "TOTAL_NOTA", "NOME","DESCONTO", "MODELO_NF", 
     CASE 
         WHEN "NFE_SITUACAO" = 3 THEN 'ORÇAMENTO'
         WHEN "NFE_SITUACAO" = 5 THEN 'CONTIGENCIA'
         WHEN "NFE_SITUACAO" = 6 THEN 'EMITIDA'
         WHEN "NFE_SITUACAO" = 8 THEN 'CANCELADA'
         
         ELSE 'OUTRO'
     END AS "DESCRICAO_SITUACAO"
FROM "C000061"
INNER JOIN "C000007" ON ("C000007"."CODIGO" = "CODCLIENTE");
`);
  const responseItensVenda = await pool.query(`SELECT "CODNOTA", "CODPRODUTO", "QTDE", "UNITARIO", "TOTAL",  "C000062"."DESCONTO", "SUBTOTAL", "PRODUTO" FROM "C000062"
  INNER JOIN "C000061" ON ("C000061"."CODIGO" = "CODNOTA")
  INNER JOIN "C000025" ON ("C000025"."CODIGO" = "CODPRODUTO");
`);

const data = response.rows;
const dataCaixa = responseCaixa.rows;
const dataVendas = responseVendas.rows;
const dataItensVenda = responseItensVenda.rows;

for (let index = 0; index < 10; index++) {
  db.collection('produtosEstoque').doc(`${index}`).delete()
  .then(() => {
    console.log('Documento deletado da tabela produtosEstoque com sucesso!');
  })
  .catch((error) => {
    console.error('Error deleting document: ', error);
  });
  

}


  for (let index = 0; index < 10; index++) {
      
    db.collection('Caixa').doc(`${index}`).delete()
    .then(() => {
      console.log('Documento deletado da tabela Caixa com sucesso!');
    })
    .catch((error) => {
      console.error('Error deleting document: ', error);
    });
    
  }



  for (let index = 0; index < 10; index++) {
    db.collection('Vendas').doc(`${index}`).delete()
    .then(() => {
      console.log('Documento deletado da tabela Vendas com sucesso!');
    })
    .catch((error) => {
      console.error('Error deleting document: ', error);
    });

  }



  for (let index = 0; index < 10; index++) {
    db.collection('ItensVenda').doc(`${index}`).delete()
    .then(() => {
      console.log('Documento deletado da tabela ItensVenda com sucesso!');
    })
    .catch((error) => {
      console.error('Error deleting document: ', error);
    });
    

  }
});

app.post('/api/login', async (req, res) => {
  console.log(req.body);  // Adicione isso para ver o que está sendo enviado
  const { username, password } = req.body;
  
  if (username && password) {
    if (username === 'admin' && password === 'admin') {
      req.session.authenticated = true;
      res.json({ success: true, redirectUrl: '/home.html' });
    } else {
      res.json({ success: false, message: 'Credenciais inválidas' });
    }
  } else {
    // res.status(400).json({ success: false, message: 'Missing credentials' });
    alert('Missing credentials');
  }
});

app.get('/api/dashboardProdutos', async (req, res) => {
  const snapshot = await db.collection('produtosEstoque').get();
  const dataProdutosEstoque = snapshot.docs.map(doc => doc.data());
  console.log(dataProdutosEstoque);
  res.json(dataProdutosEstoque);
});

app.get('/api/dashboardCaixa', async (req, res) => {
  const snapshot = await db.collection('Caixa').get();
  const dataCaixa = snapshot.docs.map(doc => doc.data());
  console.log(dataCaixa);
  res.json(dataCaixa);
});
app.get('/api/dashboardVendas', async (req, res) => {
  const snapshot = await db.collection('Vendas').get();
  const dataVendas = snapshot.docs.map(doc => doc.data());
  console.log(dataVendas);
  res.json(dataVendas);
});
app.get('/api/dashboardItensVenda', async (req, res) => {
  const snapshot = await db.collection('ItensVenda').get();
  const dataItensVenda = snapshot.docs.map(doc => doc.data());
  console.log(dataItensVenda);
  res.json(dataItensVenda);
});







app.listen(port, () => console.log(`api rodando na porta ${port}!`))