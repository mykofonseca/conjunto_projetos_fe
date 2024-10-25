document.addEventListener('DOMContentLoaded', function() {
    fetch('dados.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        var workbook = XLSX.read(data, { type: 'array'});
        var nomeDaPlanilha = workbook.SheetNames[0];
        var planilha = workbook.Sheets[nomeDaPlanilha];
        var dadosJson = XLSX.utils.sheet_to_json(planilha);
        var corpoTabela = document.querySelector('#tabelaVendas tbody');
        corpoTabela.innerHTML = '';
        dadosJson.forEach(function(linha) {
            var tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${linha['Produto']}</td>
                <td>${linha['Vendas']}</td>
            `;
            corpoTabela.appendChild(tr);
        });
        atualizarGraficoPizza(dadosJson);
    })
    .catch(error => console.error('Erro ao carregar o arquivo Excel:', error));
});

function atualizarGraficoPizza(dados) {
    var contextoPizza = document.getElementById('graficoPizza').getContext('2d');
    var produtos = dados.map(item => item ['Produto']);
    var vendas = dados.map(item => item['Vendas']);
    var totalVendas = vendas.reduce((a, b) => a + b, 0);
    var cores = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)'
    ];

    var bordas = [
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)',
        'rgba(255, 255, 255, 1)'
    ];

    if (window.meuGraficoPizza) {
        window.meuGraficoPizza.destroy();
    }

    window.meuGraficoPizza = new Chart(contextoPizza, {
        type: 'pie',
        data: {
            labels: produtos,
            datasets: [{
                data: vendas,
                backgroundColor: cores,
                borderColor: bordas,
                borderWidth: 2,
                hoverOffset: 10
            }]
        }, 
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Proporção de Vendas por Produto',
                    font: {
                        size: 18,
                    },
                    padding: {
                        top: 10,
                        bottom: 30,
                    },
                },
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        font: {
                            size: 14,
                        },
                        padding: 20,
                    }
                },
                datalabels: {
                    formatter: (value, context) => {
                        let percentual = ((value / totalVendas) * 100).toFixed(2) + '%'
                        let label = context.chart.data.labels[context.dataIndex];
                        return label + '\n' + percentual;
                    },
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 14,
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}