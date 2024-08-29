import { getUserDbId, currentUser, getVendasDb } from '../../server/firebase.js';


const URL = 'http://localhost:3000';

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
    DataCaixa: [],
    vendasData: [],
    itensVendaData: [],
    vendas: []
  },
  methods: {


    async prencherVendas(){

        try {
            const user = await currentUser();
            if (user) {
                const userEmail = user.email;
                const dbId = await getUserDbId(userEmail);
                
                const vendas = await getVendasDb(dbId);
                this.vendasData = vendas;
            } else {
                console.error("Usuário não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao obter o usuário:", error);
        }
    },

    async getDashboardData() {
        const config = {
            headers: {
                'Content-Type': 'Application/json',
            },
            method: 'GET',
        };
        const response = await fetch(`${URL}/dashboard`, config);
        const data = await response.json();
        this.produtosEstoqueData = data;
        console.log(this.produtosEstoqueData);
        
    },

    async getDashboardVendasData() {
        const config = {
            headers: {
                'Content-Type': 'Application/json',
            },
            method: 'GET',
        };
        const response = await fetch(`${URL}/dashboardVendas`, config);
        const data = await response.json();
        this.vendasData = data;
        console.log(this.vendasData);
    },

    async getDashboardCaixa(){
        const config = {
            headers: {
                'Content-Type': 'Application/json',
            },
            method: 'GET',
        }
        const response = await fetch(`${URL}/dashboardCaixa`, config);
        const data = await response.json();
        this.DataCaixa = data;
        console.log(this.DataCaixa);
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
    this.prencherVendas();
  },
      
  

});
