document.addEventListener('DOMContentLoaded', () => {
    const contextoGrafico = document.getElementById('graficoKPI').getContext('2d');
    let dados = [];
    let grafico; 
    
    function lerArquivoExcel() {
        const url = 'dados.xlsx';
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(data => {
                const workbook = XLSX.read(data, { type: 'array'});
                const sheet = workbook.Sheets['Dados'];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1});
                dados = jsonData.slice(1);
                criarGrafico();
            })
            .catch(error => console.error('Erro ao ler o arquivo Excel:', error));
    }

    function criarGrafico() {
        const produtos = dados.map(row => row[0]);
        const vendas = dados.map(row => row[1]);
        const metas = dados.map(row => row[2]);
        const vendasDataset = vendas.map((venda, index) => Math.min(venda, metas[index]));
        const metasDataset = metas.map((meta, index) => meta - vendasDataset[index]);
        const coresVendas = vendas.map((venda, index) => venda > metas[index] ? '#FFD700' : '#4caf50');
        
        if(grafico) {
            grafico.destroy();
        }

        grafico = new Chart(contextoGrafico, {
            type: 'bar',
            data: {
                labels: produtos,
                datasets: [
                    {
                        label: 'Vendas',
                        data: vendasDataset,
                        backgroundColor: coresVendas,
                        borderColor: coresVendas,
                        borderWidth: 1
                    },
                    {
                        label: 'Meta Restante',
                        date: metasDataset,
                        backgroundColor: '#e0e0e0',
                        borderColor: '#e0e0e0',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true,
                        beginAtZero: true,
                        ticks: {
                            setpSize: 10
                        }
                    },
                    y: {
                        stacked: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.dataset.label + ': ' + tooltipItem.raw;
                            }
                        }
                    },
                    datalabels: {
                        display: true,
                        color: 'black',
                        anchor: 'center',
                        align: 'center',
                        formatter: function(value, context) {
                            const venda = vendas[context.dataIndex];
                            if(context.datasetIndex === 0 && venda > metas[context.dataIndex]) {
                                return venda;
                            }

                            return value;
                        }
                    }
                }
            },

            plugins: [ChartDataLabels]
        });
    }
    lerArquivoExcel();
});