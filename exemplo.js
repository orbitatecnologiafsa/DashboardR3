import { } from './firebaseConfig.js'


let user_email;
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        alert('Login efetuado com sucesso!');
        //Ai aqui tu manda pra tua tela de main screen/
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    })
}


// Funcao para extrair as informações do db

async function getDocId() {
  const db = firebase.firestore(); // Acessamos o db
  const empresasDb = db.collection('empresas'); // Acessamos a coleção de empresas
  
  // Filtramos as empresas pelo email
  const empresas = await empresasDb.where('LOGIN', '==', '123').get(); 

  if (empresas.empty) {
      console.log("Nenhuma empresa encontrada com esse email.");
      return;
  }

  const empresa_id = empresas.docs[0].id;

 return empresa_id;
}

async function getItensVenda() {
  const empresa_id = await getDocId();
  const db = firebase.firestore();
  const itensVendaDb = db.collection('empresas').doc(empresa_id).collection('itensVenda');
  const itensVenda = await itensVendaDb.get();
  
  itensVenda.forEach(doc => {
    console.log(doc.data());
  });
}

async function getVendas() {
  const empresa_id = await getDocId();
  const db = firebase.firestore();
  const vendasDb = db.collection('empresas').doc(empresa_id).collection('vendas');
  const vendas = await vendasDb.get();
  
  vendas.forEach(doc => {
    console.log(doc.data());
  });
}

async function getCaixa(){
  const empresa_id = await getDocId();
  const db = firebase.firestore();
  const caixaDb = db.collection('empresas').doc(empresa_id).collection('caixa');
  const caixa = await caixaDb.get();
  
  caixa.forEach(doc => {
    console.log(doc.data());
  });
}
