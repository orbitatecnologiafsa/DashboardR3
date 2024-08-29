import { getUserDbId, currentUser, getVendasDb, getCaixaDb, getProdutosDb } from '../../server/firebase.js';


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
    vendas: [],
    searchVendas: '',
  },
  methods: {
    pesquisarProduto(val){
        this.search = val;
        console.log(this.search);
        console.log(val);
        if (this.search.length === 0 ) {
          this.prencherVendas();
        } else {
          this.vendasData = this.vendasData.filter(item => item.nome.toLowerCase().includes(this.search.toLowerCase()));
        }
      },

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
        try {
            const user = await currentUser();
            if (user) {
                const userEmail = user.email;
                const dbId = await getUserDbId(userEmail);

                const caixa = await getCaixaDb(dbId);
                this.DataCaixa = caixa;
            }
        } catch (error) {
            
        }
        
    },

    async getProdutosEstoque() {
        try {
            const user = await currentUser();
            if (user) {
                const userEmail = user.email;
                const dbId = await getUserDbId(userEmail);
                
                const estoque = await getProdutosDb(dbId);
                this.produtosEstoqueData = estoque;
            } else {
                console.error("Usuário não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao obter o usuário:", error);
        }
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
    this.getDashboardData();
    this.getProdutosEstoque();
    // this.createGraficoVisitas();
    // this.createGraficoEntregas();
  },
  watch: {
    search: 'pesquisarProduto'
  }
      
  

});
