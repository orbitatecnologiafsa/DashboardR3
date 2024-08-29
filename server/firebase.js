import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";

//Sem o db ainda !

const firebaseConfig = {
  apiKey: "AIzaSyD1KxGa3u3kX1lGKbr6nN2_5gr8MTVl5zM",
  authDomain: "prototiposincronizador.firebaseapp.com",
  projectId: "prototiposincronizador",
  storageBucket: "prototiposincronizador.appspot.com",
  messagingSenderId: "761543687418",
  appId: "1:761543687418:web:9ea382bb1b4494461d9d43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);