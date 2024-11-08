document.addEventListener('DOMContentLoaded', function() {
    fetch('dados.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        var workbook = XLSX.read(data, { type: 'array' });
        var nomeDaPlanilha = workbook.SheetNames[0];
        var planilha = workbook.Sheets[nomeDaPlanilha];
        var dadosJson = XLSX.utils.sheet_to_json(planilha);
        atualizarGraficoAreas(dadosJson);
    })
    .catch(error => {
        console.error('Erro ao carregar o arquivo Excel', error);
    });
});

function atualizarGraficoAreas(dados) {
    var contextoAreas = document.getElementById('graficoAreas').getContext('2d');
    var produtos = dados.map(item => item['Produto']);
    var vendas = dados.map(item => item ['Vendas']);
    var metas = dados.map(item => item['Meta']);

    if(window.meuGraficoAreas) {
        window.meuGraficoAreas.destroy();
    }

    window.meuGraficoAreas = new Chart(contextoAreas, {
        type: 'line',
        data: {
            labels: produtos,
            datasets: [
                {
                    label: 'Vendas',
                    data: vendas,
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    fill: true,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: '2',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    dataLabels: {
                        display: true,
                        align: 'top',
                        backgroundColor: '#333',
                        borderRadius: 3,
                        color: 'white',
                        font: {
                            size: 10,
                            weight: 'bold'
                        },
                        formatter: function(value) {
                            return value;
                        }
                    }
                },
                {
                    label: 'Meta',
                    backgroundColor: 'rgba(235, 99, 132, 0.2)',
                    borderColor: 'rgba(235, 99, 132, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: true,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    datalabels: {
                        display: false
                    }
                }
            ]
        },

        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Vendas vs Meta por Produto', 
                    font: {
                        size: 20,
                        family: 'Roboto',
                        weight: 'bold',
                        color: '#333'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            family: 'Roboto'
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    titleFont: {
                        size: 16,
                        family: 'Roboto',
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 14,
                        family: 'Roboto'
                    },
                    callbacks: {
                        label: function(context) {
                            var label = context.dataset.label || '';
                            if(label) {
                                label += ': ';
                            }

                            label += context.raw;
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true, 
                        text: 'Quantidade de Vendas',
                        font: {
                            size: 14,
                            family: 'Roboto',
                            weight: 'bold',
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        borderDash: [5, 5]
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Produto',
                        font: {
                            size: 14,
                            family: 'Roboto',
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1',
                        borderDash: [5, 5]
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}