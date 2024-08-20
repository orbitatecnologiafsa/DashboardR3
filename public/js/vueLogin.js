const URL = 'https://794f-177-8-130-94.ngrok-free.app';
new Vue({
    el: '#app',
    data: {
        login: '',
        password: '',
    },
    methods: {
        async loginDashboard() {
          const obj = {
            username: this.login,
            password: this.password
          }
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                },
                method: 'POST',
                body: JSON.stringify(obj)
            }
            const response = await fetch(`${URL}/api/login`, config);
            const data = await response.json();
            console.log(data);

            if (data.success) {
              window.location.href = data.redirectUrl;  // Redireciona o usuário
          } else {
              alert(data.message || 'Erro no login');
          }
        }
    }
})
                
