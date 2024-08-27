const URL = 'https://7143-177-8-130-94.ngrok-free.app';
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
                    'ngrok-skip-browser-warning': 'true'
                },
                method: 'POST',
                body: JSON.stringify(obj)
            }
            const response = await fetch(`${URL}/`, config);
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
                


"Faça com que ao logar,"