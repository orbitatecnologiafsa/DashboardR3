import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  query,
  where,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { converterData }  from '../js/converterData.js'



const firebaseConfig = {
  apiKey: "AIzaSyDbSey9MkVvP_3fn88UjxS6VlG2tHMY_rI",
  authDomain: "dashboardr3.firebaseapp.com",
  projectId: "dashboardr3",
  storageBucket: "dashboardr3.appspot.com",
  messagingSenderId: "812133357031",
  appId: "1:812133357031:web:0b2b7e90fdb5bd7fc9d942",
  measurementId: "G-S2MJG8QCVG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}
export function logout() {
  return signOut(auth);
}
export function currentUser() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        reject();
      }
    });
  });
}

export async function getUserDbId(user_email) {
  
  const empresaDb = collection(db,'empresas');

  const doc = query(empresaDb, where("email", "==", user_email));

  const doc_data = await getDocs(doc);

  if(!doc_data.empty){
    const doc_id = doc_data.docs[0].id;
    return doc_id;
  }else{
    return null;
  }
}
export async function getVendasDb(doc_id) {
  try {
  
    const empresaDocRef = doc(db, 'empresas', doc_id);

    const vendasCollectionRef = collection(empresaDocRef, 'vendas');

    const querySnapshot = await getDocs(vendasCollectionRef);
    
    const vendas = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        CODIGO: data.CODIGO,
        CFOP: data.CFOP,
        CODCLIENTE: data.CODCLIENTE,
        NOME: data.NOME,
        NOTAFISCAL: data.NOTAFISCAL,
        DATA: converterData(data.DATA), // Converter timestamp para DD-MM-YYYY
        TOTAL_NOTA: data.TOTAL_NOTA, 
        VALOR_PRODUTOS: data.VALOR_PRODUTOS, 
      };
    });

    return vendas;
  } catch (error) {
    console.error("Erro ao obter documentos da subcoleção 'vendas':", error);
    throw error; 
  }
}

export async function getCaixaDb(doc_id) {
  try {
  
    const empresaDocRef = doc(db, 'empresas', doc_id);

    const vendasCollectionRef = collection(empresaDocRef, 'caixa');

    const querySnapshot = await getDocs(vendasCollectionRef);

    const vendas = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        CODIGO: data.CODIGO,
        CODCAIXA: data.CODCAIXA,
        ENTRADA: data.ENTRADA, 
        SAIDA: data.SAIDA, 
        TIPO_MOVIMENTO: data.TIPO_MOVIMENTO,
        DATA: converterData(data.DATA), // Converter timestamp para DD-MM-YYYY
        VALOR: data.VALOR, 
        CODIGO_VENDA: data.CODIGO_VENDA

        
      };
    });

    return vendas;
  } catch (error) {
    console.error("Erro ao obter documentos da subcoleção 'vendas':", error);
    throw error; 
  }
}

export async function getProdutosDb(doc_id) {
  try {
  
    const empresaDocRef = doc(db, 'empresas', doc_id);

    const vendasCollectionRef = collection(empresaDocRef, 'produtosEstoque');

    const querySnapshot = await getDocs(vendasCollectionRef);

    const vendas = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        CODIGO: data.CODIGO,
        ESTOQUE_ATUAL: data.ESTOQUE_ATUAL,
        NOTAFISCAL: data.NOTAFISCAL,
        PRECOCUSTO: data.PRECOCUSTO,
        PRECOVENDA: data.PRECOVENDA,
        PRODUTO: data.PRODUTO, // Converter timestamp para DD-MM-YYYY
        UNIDADE: data.UNIDADE,
        CODBARRA: data.CODBARRA

        
      };
    });

    return vendas;
  } catch (error) {
    console.error("Erro ao obter documentos da subcoleção 'vendas':", error);
    throw error; 
  }
}