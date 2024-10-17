
new Vue({
  el: '#app',
  data: {
    cnpj: '',
    password: '',
  },
  methods: {
    async login() {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          cnpj: this.cnpj,
          password: this.password
        })
      };
      
      const response = await fetch('/login', config);
      const data = await response.json();
  
      if (data.status === 'success') {
        window.location.href = '/home.html';
      } else {
        alert(data.message);
      }


      }
    }
  
})