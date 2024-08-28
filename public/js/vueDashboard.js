const URL = 'https://7143-177-8-130-94.ngrok-free.app';

new Vue({
  el: '#appDashboard',
  data: {
      isLoading: false,
      loadingProgress: 0,
      produtosEstoqueData: [],
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 10,
      produtosVendidosData: [],
      caixaData: [],
      vendasData: [],
      itensVendaData: [],
  },
  methods: {

    async createData() {
        const config = {
            headers: { 
                'Content-Type': 'Application/json',
                'ngrok-skip-browser-warning': 'true',
                'Access-Control-Allow-Origin': '*'
             },
            method: 'GET'
        };
        const response = await fetch(`${URL}/api/dashboard`, config);
        const data = await response.json();
        console.log(data);
    },

    async loadDatasProdutos(page = 1) {
        this.isLoading = true;
        const config = {
          headers: { 
            'Content-Type': 'Application/json',
            'ngrok-skip-browser-warning': 'true',
            'Access-Control-Allow-Origin': '*'
        },
          method: 'GET'
        };
    
        const response = await fetch(`${URL}/api/dashboardProdutos?page=${page}&limit=${this.itemsPerPage}`, config);
        const { data, totalPages, currentPage } = await response.json();
    
        this.produtosEstoqueData = data;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.isLoading = false;
      },
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.loadDatasProdutos(page);
        }
      },
    async loadDatasCaixa() {
        const config = {
            headers: { 
                'Content-Type': 'Application/json',
                'ngrok-skip-browser-warning': 'true',
                'Access-Control-Allow-Origin': '*'
             },
            method: 'GET'
        }
        const response = await fetch(`${URL}/api/dashboardCaixa`, config);
        const data = await response.json();
        this.caixaData = data;
        console.log(this.caixaData.data);
      },
    async loadDatasVendas() {
        const config = {
            headers: { 'Content-Type': 'Application/json',
                'ngrok-skip-browser-warning': 'true',
                'Access-Control-Allow-Origin': '*'
             },
            method: 'GET'
        }
        const response = await fetch(`${URL}/api/dashboardVendas`, config);
        const data = await response.json();
        this.vendasData = data;
        console.log(this.vendasData);
      },
    async loadDatasItensVenda() {
        const config = {
            headers: { 'Content-Type': 'Application/json',
                'ngrok-skip-browser-warning': 'true',
                'Access-Control-Allow-Origin': '*'
             },
            method: 'GET'
        }
        const response = await fetch(`${URL}/api/dashboardItensVenda`, config);
        const data = await response.json();
        this.itensVendaData = data;
        console.log(this.itensVendaData);
      },
    createGraficoVisitas() {
        const ctx1 = document.getElementById('graficoVisitas').getContext('2d');
        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: getLast7Days(),
                datasets: [{
                    label: 'Visitas',
                    data: [12, 16, 3, 5, 2, 3, 7],
                    backgroundColor: '#00adf6',
                    borderColor: '#00adf6',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    },
    
    // Função para criar o gráfico de entregas
    createGraficoEntregas() {
        const ctx2 = document.getElementById('graficoEntregas').getContext('2d');
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: getLast7Days(),
                datasets: [{
                    label: 'Entregas',
                    data: [12, 16, 3, 5, 2, 3, 7],
                    backgroundColor: '#00adf6',
                    borderColor: '#00adf6',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    },



    

  },
      
  
mounted() {
    
    this.createData();
    
    // Espera até que o Vue tenha montado o DOM e depois cria os gráficos
    this.$nextTick(() => {
        this.createGraficoVisitas();
        this.createGraficoEntregas();
        this.loadDatasProdutos();
        this.loadDatasCaixa();
        this.loadDatasVendas();
        this.loadDatasItensVenda();
    });
  }
});
