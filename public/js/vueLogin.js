const URL = 'http://localhost:3000';
new Vue({
    el: '#app',
    data: {
        login: '',
        password: '',
    },
    methods: {
        async loginDashboard() {
          const obj = {
            login: this.login,
            password: this.password
          }
            const config = {
                headers: {
                    'Content-Type': 'Application/json',
                    
                },
                method: 'POST',
                body: JSON.stringify(obj)
            }
            const response = await fetch(`${URL}/login`, config);
            const data = await response.json();
            console.log(data);

            if (data.success) {
              window.location.href = data.redirectURL;  // Redireciona o usuário
          } else {
              alert(data.message || 'Erro no login');
          }
        }
    }
})
                


"Faça com que ao logar,"