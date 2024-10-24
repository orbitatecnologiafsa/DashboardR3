

new Vue({
  el: '#appDashboard',
  data: {

    produtosEstoqueData: [],
    // Variáveis para somas da aba de Vendas
    vendasHoje: 0,
    vendasMes: 0,
    // Variáveis para somas da aba de Vendas

    // Variáveis para somas da aba de Produtos
    estoqueValorTotal: 0,
    estoqueValorTotalVenda: 0,
    // Variáveis para somas da aba de Produtos

    // Variáveis para somas da aba de Caixa
    vendaDinheiro: 0,
    caixaEntrada: 0,
    caixaSaida: 0,
    totalCaixa: 0,
    // Variáveis para somas da aba de Caixa
    produtosVendidosData: [],
    DataCaixa: [],
    vendasData: [],
    itensVendaData: [],
    searchVendas: '',
    searchProdutos: '',
    searchCaixa: '',
    activeTab: 1,
    vendasTotais: 0,
    dataInicio: '',
    dataFim: '',
    dataInicioCaixa: '',
    dataFimCaixa: '',
    vendas7dias: [],
    vendas30dias: [],
    formatação: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }),
    comissoesAll: [],
    comissoesData: [],
    comissoesDataNome: [],
    mesAtual: '',

  },
  methods: {
    setActiveTab(tab) {
        this.activeTab = tab;
      },
    async getDashboardTest(){
        const config = {
            headers: {
                'Content-Type': 'application/json'}
        }
        const response = await fetch('/dashboardVendas', config)
        const data = await response.json()
        this.vendasData = data
        this.prencherVendas()
        const currentDate = new Date();
        const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
        // Exemplo: "outubro"
        this.mesAtual = currentMonthName
    },

    async prencherVendas(){

        try {                
                for (let index = 0; index < this.vendasData.length; index++) {
                    this.vendasTotais = this.vendasTotais + this.vendasData[index].TOTAL_NOTA
                }
                try {
                    this.vendasPorDia(this.vendasData);
                    this.vendasPorMes(this.vendasData);
                    // this.vendasPorSemana(this.vendasData);
                    // this.vendasUltimos7Dias(this.vendasData);
                    this.vendasPorDiaNosUltimos7Dias(this.vendasData);
                    this.vendasPorDiaNosUltimos30Dias(this.vendasData);
                    this.createGraficoEntregas();
                    this.createGraficoVisitas();
                    this.createGraficoComissoes();
                    
                    
                } catch (error) {
                    console.error("Erro ao obter os dados de vendas:", error);
                }
            } catch (error) {
                console.error("Erro ao obter os dados de vendas:", error);
            }
        
    },
    
    async getDashboardCaixa(){
        const config = {
            headers: {'Content-Type': 'application/json'},
            method: 'GET',
        }
        const response = await fetch('/dashboardCaixa', config)
        const data = await response.json()
        this.DataCaixa = data
        this.valoresCaixa(this.DataCaixa)
    },
    async getDashboardComissoes(){
        const config = {
            headers: {'Content-Type': 'application/json'},
            method: 'GET',
        }
        const response = await fetch('/dashboardComissoes', config)
        const data = await response.json()
        this.comissoesAll = data
        this.comissoesData = data.map(item => item.VALOR_TOTAL)
        this.comissoesDataNome = data.map(item => item.NOME)
        
    },

//     async getProdutosEstoque() {
//         try {
//             const user = await currentUser();
//             if (user) {
//                 const userEmail = user.email;
//                 const dbId = await getUserDbId(userEmail);
                
//                 const estoque = await getProdutosDb(dbId);
//                 this.produtosEstoqueData = estoque;

//                 this.valorTotalEstoque(this.produtosEstoqueData);
//             } else {
//                 console.error("Usuário não encontrado.");
//             }
//         } catch (error) {
//             console.error("Erro ao obter o usuário:", error);
//         }
//     },
    createGraficoVisitas() {
        const ctx1 = document.getElementById('graficoVisitas').getContext('2d');
        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: getLast7Days(),
                datasets: [{
                    label: 'Valores das Vendas',
                    data: this.vendas7dias,
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
                labels: getLast30Days(),
                datasets: [{
                    label: 'Valores das Vendas',
                    data: this.vendas30dias,
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

    createGraficoComissoes() {
        const ctx3 = document.getElementById('graficoComissoes').getContext('2d');
        new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: this.comissoesDataNome,
                datasets: [{
                    label: 'Valores das Vendas',
                    data: this.comissoesData,
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
//  // ==================================== Somas da aba de Vendas =============================================================================================//   
    vendasPorDia(vendasData){
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        
        const data = new Date().toISOString().slice(0, 10);
        const [year, month, day] = data.split('-');  // Separa em ["2024", "09", "11"]
        const formattedDate = `${day}-${month}-${year}`;  // Reorganiza para "11-09-2024"
        
         let vendasDia = 0
        for (let index = 0; index < vendasData.length; index++) {
            if (formattedDate === this.vendasData[index].DATA) {
                vendasDia = vendasDia + vendasData[index].TOTAL_NOTA
            } else {
                // console.log("Não houveram vendas hoje");
            }
        }

        
        this.vendasHoje = formatter.format(vendasDia)
        
    },

//     // vendasPorSemana(vendasData) {
//     //     // Converta as datas de venda para o formato Date
//     //     const vendasConvertidas = vendasData.map(venda => {
//     //         const [day, month, year] = venda.DATA.split('-');
//     //         return {
//     //             ...venda,
//     //             dataVenda: new Date(`${year}-${month}-${day}`)
//     //         };
//     //     });
    
//     //     // Ordene as vendas por data (caso ainda não estejam ordenadas)
//     //     vendasConvertidas.sort((a, b) => a.dataVenda - b.dataVenda);
    
//     //     // Inicialize o array para armazenar os totais por semana
//     //     const vendasPorSemana = [];
//     //     let semanaAtual = [];
//     //     let inicioSemana = vendasConvertidas[0].dataVenda;
    
//     //     vendasConvertidas.forEach(venda => {
//     //         // Verifique se a venda pertence à semana atual
//     //         if ((venda.dataVenda - inicioSemana) / (1000 * 60 * 60 * 24) < 7) {
//     //             semanaAtual.push(venda);
//     //         } else {
//     //             // Calcule o total da semana e adicione ao array
//     //             const totalSemana = semanaAtual.reduce((total, venda) => total + venda.TOTAL_NOTA, 0);
//     //             vendasPorSemana.push({ inicioSemana, totalSemana });
    
//     //             // Inicie uma nova semana
//     //             semanaAtual = [venda];
//     //             inicioSemana = venda.dataVenda;
//     //         }
//     //     });
    
//     //     // Adicione a última semana ao array
//     //     if (semanaAtual.length > 0) {
//     //         const totalSemana = semanaAtual.reduce((total, venda) => total + venda.TOTAL_NOTA, 0);
//     //         vendasPorSemana.push({ inicioSemana, totalSemana });
//     //     }

//     //     return vendasPorSemana;
//     // },

//     // vendasUltimos7Dias(vendasData) {
//     //     // Data final é a data atual
//     //     const fim = new Date(); // Data atual
    
//     //     // Data de início é exatamente 7 dias antes da data final
//     //     const inicio = new Date(fim);
//     //     inicio.setDate(fim.getDate() - 7); // Subtrai 7 dias
    
//     //     // Inicialize a soma
//     //     let total = 0;
    
//     //     // Filtre as vendas pelo intervalo de datas e some os valores
//     //     vendasData.forEach(venda => {
//     //         // Supondo que venda.DATA está no formato "DD-MM-YYYY"
//     //         const [day, month, year] = venda.DATA.split('-');
//     //         const dataVenda = new Date(`${year}-${month}-${day}`);
    
//     //         // Verifica se a data da venda está dentro do intervalo dos últimos 7 dias
//     //         if (dataVenda >= inicio && dataVenda <= fim) {
//     //             total += venda.TOTAL_NOTA;
//     //         }
//     //     });
    
//     //     this.vendasUltimos7Dias = total;

//     //     return total;
//     // },

    vendasPorDiaNosUltimos7Dias(vendasData) {
        // Data final é a data atual
        const fim = new Date(); // Data atual
        
        
        // Array para armazenar as vendas de cada dia nos últimos 7 dias
        this.vendas7dias = Array(7).fill(0);
    
        // Itera sobre as vendas e distribui os valores para os últimos 7 dias
        vendasData.forEach(venda => {
            // Supondo que venda.DATA está no formato "DD-MM-YYYY"
            const [day, month, year] = venda.DATA.split('-');
            const dataVenda = new Date(`${year}-${month}-${day}`);
            
            // Calcula a diferença em dias entre a data da venda e a data atual
            const diffInTime = fim.getTime() - dataVenda.getTime();
            const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
            
            // Se a venda estiver nos últimos 7 dias, adiciona ao respectivo dia
            if (diffInDays >= 0 && diffInDays < 7) {
                const index = 6 - diffInDays;
                this.vendas7dias[index] += venda.TOTAL_NOTA;
            }
        });
    
        // Retorna as vendas de cada um dos últimos 7 dias
        return this.vendas7dias;
    },
    
    vendasPorDiaNosUltimos30Dias(vendasData) {
        // Data final é a data atual
        const fim = new Date(); // Data atual
    
        // Array para armazenar as vendas de cada dia nos últimos 30 dias
        this.vendas30dias = Array(30).fill(0);
    
        // Itera sobre as vendas e distribui os valores para os últimos 30 dias
        vendasData.forEach(venda => {
            // Supondo que venda.DATA está no formato "DD-MM-YYYY"
            const [day, month, year] = venda.DATA.split('-');
            const dataVenda = new Date(`${year}-${month}-${day}`);
    
            // Calcula a diferença em dias entre a data da venda e a data atual
            const diffInTime = fim.getTime() - dataVenda.getTime();
            const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));
    
            // Se a venda estiver dentro dos últimos 30 dias, coloca no respectivo dia
            if (diffInDays >= 0 && diffInDays < 30) {
                const index = 29 - diffInDays; // Inverte o índice para colocar a venda no dia correto
                this.vendas30dias[index] += venda.TOTAL_NOTA;
                
            }
        });
    
        // Retorna as vendas de cada um dos últimos 30 dias
        
        return this.vendas30dias;
    },
    
    vendasPorMes(vendasData) {
        // Data final é a data atual
        const fim = new Date(); // Data atual
        
    
        // Data de início é exatamente um mês antes da data final
        const inicio = new Date(fim);
        inicio.setMonth(fim.getMonth() - 1); // Subtrai um mês
        
    
        // Inicialize a soma
        let total = 0;
    
        // Filtre as vendas pelo intervalo de datas e some os valores
        vendasData.forEach(venda => {
            // Supondo que venda.DATA está no formato "DD-MM-YYYY"
            const [day, month, year] = venda.DATA.split('-');
            const dataVenda = new Date(`${year}-${month}-${day}`);
    
            
    
            if (dataVenda >= inicio && dataVenda <= fim) {
                total += venda.TOTAL_NOTA;
                
            }
        });
    
        
        this.vendasMes = total;
        return total;
    },
// // ==================================== Somas da aba de Vendas =============================================================================================//

// // ==================================== Somas da aba de Produtos =============================================================================================//
    valorTotalEstoque(produtosEstoqueData) {
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        for (let index = 0; index < produtosEstoqueData.length; index++) {
        //     if (produtosEstoqueData[index].ESTOQUE_ATUAL >= 1) {
        //         console.log("Estoque cheio", produtosEstoqueData[index].PRECOCUSTO);
                this.estoqueValorTotal = this.estoqueValorTotal + produtosEstoqueData[index].PRECOCUSTO
                this.estoqueValorTotalVenda = this.estoqueValorTotal + produtosEstoqueData[index].PRECOVENDA
                
        //     } else {
        //         console.log("Estoque vazio");
        //     }      
        }
        this.estoqueValorTotal = formatter.format(this.estoqueValorTotal)
        this.estoqueValorTotalVenda = formatter.format(this.estoqueValorTotalVenda)
    },
// // ==================================== Somas da aba de Caixa =============================================================================================//
    valoresCaixa(DataCaixa) {

        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        let entradaCaixa = 0
        let saidaCaixa = 0
        
        
        for (let index = 0; index < DataCaixa.length; index++) {
            entradaCaixa = entradaCaixa + DataCaixa[index].ENTRADA
            saidaCaixa = saidaCaixa + DataCaixa[index].SAIDA
            this.totalCaixa = entradaCaixa - saidaCaixa
            // if (DataCaixa[index].TIPO_MOVIMENTO === "VENDA DINHEIRO") {
                const valorConvertido = parseFloat(DataCaixa[index].VALOR) 
                
                this.vendaDinheiro = this.vendaDinheiro + valorConvertido
            // }
        }
        this.caixaEntrada = formatter.format(entradaCaixa)
        this.caixaSaida = formatter.format(saidaCaixa)
        this.totalCaixa = formatter.format(this.totalCaixa)
        this.vendaDinheiro = formatter.format(this.vendaDinheiro)
        console.log("Entrada Caixa: ", entradaCaixa, "Saida Caixa: ", saidaCaixa, "Total Caixa: ", this.totalCaixa, "Venda Dinheiro: ", this.vendaDinheiro);
    }
    



  },
  mounted() {
    this.getDashboardTest();
    this.getDashboardCaixa();
    this.getDashboardComissoes();
    // this.prencherVendas();
    // this.getDashboardData();
    // this.getProdutosEstoque();
    
    
  },
  computed: {
    filteredVendasData() {
        const searchTerm = this.searchVendas.toLowerCase();
        let filteredData = this.vendasData;
    
        // Filtrar pelo termo de pesquisa (opcional)
        if (searchTerm) {
          filteredData = filteredData.filter(item => 
            item.CODIGO.toLowerCase().includes(searchTerm) || 
            item.NOME.toLowerCase().includes(searchTerm)
          );
        }
        
    
        // Filtrar pelo intervalo de datas
        if (this.dataInicio && this.dataFim) {
          const inicio = new Date(this.dataInicio);
          const fim = new Date(this.dataFim);
          console.log(inicio, fim);
          filteredData = filteredData.filter(item => {
            const [day, month, year] = item.DATA.split('-');
            const dataVenda = new Date(`${year}-${month}-${day}`)
            return dataVenda >= inicio && dataVenda <= fim;
          });
        }
    
        return filteredData;
    },
    filteredProdutos() {
        if (!this.searchProdutos) {
          return this.produtosEstoqueData; // Return full data if search is empty
        }
        const searchTerm = this.searchProdutos.toLowerCase();
        return this.produtosEstoqueData.filter(item => 
          item.PRODUTO.toLowerCase().includes(searchTerm) ||
          item.CODIGO.toLowerCase().includes(searchTerm)
        );
      },
    filteredComissao() {
        if(!this.searchProdutos) {
            return this.comissoesAll;
        }
        const searchTerm = this.searchProdutos.toLowerCase();
        return this.comissoesAll.filter(item =>
            item.NOME.toLowerCase().includes(searchTerm)
        )
    },
    filteredCaixaData() {
        const searchTerm = this.searchCaixa.toLowerCase();
        let filteredData = this.DataCaixa;
    
        // // Filtrar pelo termo de pesquisa (opcional)
        if (searchTerm) {
          filteredData = filteredData.filter(item => 
            item.TIPO_MOVIMENTO.toLowerCase().includes(searchTerm)
          );
        }
    
        // Filtrar pelo intervalo de datas
        if (this.dataInicioCaixa && this.dataFimCaixa) {
          const inicio = new Date(this.dataInicioCaixa);
          const fim = new Date(this.dataFimCaixa);
          console.log(inicio, fim);
          filteredData = filteredData.filter(item => {
            const [day, month, year] = item.DATA.split('-');
            const dataVenda = new Date(`${year}-${month}-${day}`)
            return dataVenda >= inicio && dataVenda <= fim;
          });
        }
        return filteredData;
    }
}
  
      
  

});
