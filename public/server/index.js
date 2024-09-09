import { login, getUserDbId } from './firebase.js';


const form = document.getElementById('loginForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.querySelector('#email_login').value;
  const password = document.querySelector('#password_login').value;

  try {
    await login(email, password);

    window.location.href = "./home.html";

  } catch (error) {

    console.error('Erro ao autenticar:', error.message);
    alert('Erro ao autenticar: ' + error.message);
  }
});