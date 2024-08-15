const URL = 'http://localhost:3001';
new Vue({
  el: '#appDashboard',
  data: {
      isLoading: false, // Estado de carregamento
      loadingProgress: 0 // Progresso da barra de carregamento
  },
  methods: {
      async createData() {
           // Progresso parcial antes de completar
          const config = {
              headers: {
                  'Content-Type': 'Application/json'
              },
              method: 'GET'
          };
          const response = await fetch(`${URL}/api/dashboard`, config);
          const data = await response.json();
          console.log(data);
          ; // Progresso completo após a criação
      },
      async deleteData() {
          try {
               // Progresso parcial durante a exclusão
              const config = {
                  headers: {
                      'Content-Type': 'Application/json'
                  },
                  method: 'DELETE'
              };
              const response = await fetch(`${URL}/api/delete`, config);
              const data = await response.json();
              console.log(data);
          } catch (error) {
              console.error('Erro ao deletar dados:', error);
          } 
      },
      
  },
   created() {
      
      this.deleteData(); // Aguarda a exclusão dos dados e depois chama createData
      
      
      
  },
  mounted() {
    this.createData();
  }
});
