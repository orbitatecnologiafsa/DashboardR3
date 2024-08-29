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
import { converterData }  from '../public/js/converterData.js'



const firebaseConfig = {
  apiKey: "AIzaSyD1KxGa3u3kX1lGKbr6nN2_5gr8MTVl5zM",
  authDomain: "prototiposincronizador.firebaseapp.com",
  projectId: "prototiposincronizador",
  storageBucket: "prototiposincronizador.appspot.com",
  messagingSenderId: "761543687418",
  appId: "1:761543687418:web:9ea382bb1b4494461d9d43"
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
        VALOR_PRODUTOS: data.VALOR_PRODUTOS
      };
    });

    return vendas;
  } catch (error) {
    console.error("Erro ao obter documentos da subcoleção 'vendas':", error);
    throw error; 
  }
}