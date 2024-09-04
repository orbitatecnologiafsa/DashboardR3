function getLast7Days() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        dates.push(`${day}/${month}`);
    }
    return dates;
}

function getLast30Days() {
    const dates = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        dates.push(`${day}/${month}`);
    }
    return dates;
}










const labels = getLast7Days();

// Dados do gráfico de Visitas
// const visitasData = [12, 16, 3, 5, 2, 3, 7];

// Gráfico de Visitas
// const ctx1 = document.getElementById('graficoVisitas').getContext('2d');
// const graficoVisitas = new Chart(ctx1, {
//     type: 'bar',
//     data: {
//         labels: labels,
//         datasets: [{
//             label: 'Visitas',
//             data: visitasData,
//             backgroundColor: 'rgba(58, 190, 255)',
//             borderColor: ' rgba(0, 255, 255, 1)',
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });

// Dados do gráfico de Entregas
// const entregasData = [12, 16, 3, 5, 2, 3, 7];
// const deliveryData = [8, 14, 6, 4, 1, 5, 9];

// Gráfico de Entregas
// const ctx2 = document.getElementById('graficoEntregas').getContext('2d');
// const graficoEntregas = new Chart(ctx2, {
//     type: 'bar',
//     data: {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'Entregas',
//                 data: entregasData,
//                 backgroundColor: 'rgba(58, 190, 255)',
//                 borderColor: ' rgba(0, 255, 255, 1)',
//                 borderWidth: 1
//             },
//             {
//                 label: 'Delivery',
//                 data: deliveryData,
//                 backgroundColor: 'rgba(58, 190, 255)',
//                 borderColor: ' rgba(0, 255, 255, 1)',
//                 borderWidth: 1
//             }
//         ]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });

// Função para exportar os dados
// function exportToExcel(reportType, labels, data) {
//     const ws = XLSX.utils.json_to_sheet(data, { header: ['Data', reportType] });
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, reportType === 'visitas' ? 'Visitas' : 'Entregas');
//     XLSX.writeFile(wb, `relatorio_${reportType}.xlsx`);
// }

// document.querySelectorAll('.export-button').forEach(button => {
//     button.addEventListener('click', () => {
//         const reportType = button.getAttribute('data-report');

//         let data = [];
//         if (reportType === 'visitas') {
//             data = labels.map((label, index) => ({
//                 Data: label,
//                 Visitas: visitasData[index] || 0 // Garantir que index não exceda o comprimento do array
//             }));
//         } else if (reportType === 'entregas') {
//             data = labels.map((label, index) => ({
//                 Data: label,
//                 Entregas: entregasData[index] || 0, // Garantir que index não exceda o comprimento do array
//                 Delivery: deliveryData[index] || 0 // Garantir que index não exceda o comprimento do array
//             }));
//         }

//         exportToExcel(reportType, labels, data);
//     });
// });


