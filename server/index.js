const express = require('express');
const path = require('path');
const db = require('./firebase');
const app = express();

app.use(express.static(path.join(__dirname,'..' ,'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let docID = '';

app.post('/login', (req, res) => {
  const { login, password } = req.body;
  console.log(login, password);  
  db.collection('empresas').where('LOGIN', '==', login).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (doc.data().SENHA == password) {
        docID = doc.id;
        console.log(docID);
        res.json({ success: true, redirectURL: '/home.html' });
      } else {
        console.log('Senha incorreta');
      }
    });
  });
})


app.get('/dashboard', async (req, res) => {
  console.log(docID);
  const query =  await db.collection('empresas').doc(docID).collection('produtosEstoque').get();
  const data = query.docs.map(doc => doc.data());
  res.json(data);
})

app.get('/dashboardVendas', async (req, res) => {
  console.log(docID);
  const query =  await db.collection('empresas').doc(docID).collection('vendas').get();
  const data = query.docs.map(doc => doc.data());
  res.json(data);
})
app.get('/dashboardCaixa', async (req, res) => {
  console.log(docID);
  const query =  await db.collection('empresas').doc(docID).collection('caixa').get();
  const data = query.docs.map(doc => doc.data());
  res.json(data);
})
app.get('/dashboardItensVenda', async (req, res) => {
  console.log(docID);
  const query =  await db.collection('empresas').doc(docID).collection('produtosEstoque').get();
  const data = query.docs.map(doc => doc.data());
  res.json(data);
})





app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
})