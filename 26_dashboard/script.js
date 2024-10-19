document.addEventListener('DOMContentLoaded', function () {
    let dadosVendedores = [];
    fetch('Vendedor.xlsx')
    .then(response => response.arrayBuffer())
    .then(data => {
        const workbook = XLSX.read(data, { type: 'array' });
        const nomeDaAba = workbook.SheetNames[0];
        const aba = workbook.Sheets[nomeDaAba];
        dadosVendedores = XLSX.utils.sheet_to_json(aba);
        const vendas = {};
        dadosVendedores.forEach(item => {
            const vendedor = item.Vendedor;
            const total = parseFloat(item.Total);
            if(vendas[vendedor]) {
                vendas[vendedor] += total;
            } else {
                vendas[vendedor] = total;
            }
        });
        
        const vendasOrdenadas = Object.entries(vendas)
            .map(([vendedor, total]) => ({ vendedor, total}))
            .sort((a, b) => b.total - a.total);
            const topVendedores = vendasOrdenadas.slice(0, 3);
            const containerTopVendedores = document.querySelector('#top-3-vendedores');
            containerTopVendedores.innerHTML = topVendedores.map((vendedor, index) => `
                <div class="vendedor">
                    <img src="images/${vendedor.vendedor}.jpg" alt="${vendedor.vendedor}">
                    <div class="podio">
                        <div class="posicao posicao-${index + 1}">
                            <p>${index + 1}</p>
                        </div>
                        <h3>${vendedor.vendedor}</h3>
                        <p>${vendedor.total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                    </div>
                </div>
            `).join('');

            const containerRankingVendedores = document.querySelector('#ranking-vendedores');
            containerRankingVendedores.innerHTML = vendasOrdenadas.map((vendedor, index) => `
                <div class="item-ranking" data-vendedor="${vendedor.vendedor}">
                    <img src="images/${vendedor.vendedor}.jpg" alt="${vendedor.vendedor}">
                    <div class="info">
                        <p>${index + 1} - ${vendedor.vendedor}</p>
                        <p>${vendedor.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})}</p>
                    </div>
                </div>
            `).join('');

            const containerResumoVendas = document.querySelector('#tabela-resumo tbody');
            containerResumoVendas.innerHTML = dadosVendedores.map(venda => `
                <tr>
                    <td>${venda.Vendedor}</td>
                    <td>${venda.Produto}</td>
                    <td>${venda.Total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                </tr>
                `).join('');
    })
    .catch(error => console.error('Erro ao carregar o arquivo Excel:', error));

    document.getElementById('mostrar-top-3').addEventListener('click', () => {
        document.getElementById('titulo-principal').innerText = 'Melhores Vendedores do Mês';
        document.getElementById('top-3-vendedores').style.display = 'flex';
        document.getElementById('ranking-vendedores').style.display = 'none';
        document.getElementById('resumo-vendas').style.display = 'none';
        document.getElementById('detalhes-vendedor').style.display = 'none';
    });

    document.getElementById('mostrar-ranking').addEventListener('click', () => {
        document.getElementById('titulo-principal').innerText = 'Ranking de Vendas';
        document.getElementById('top-3-vendedores').style.display = 'none';
        document.getElementById('ranking-vendedores').style.display = 'flex';
        document.getElementById('resumo-vendas').style.display = 'none';
        document.getElementById('detalhes-vendedor').style.display = 'none';
    });

    document.getElementById('mostrar-resumo').addEventListener('click', () => {
        document.getElementById('titulo-principal').innerText = 'Resumo de Vendas';
        document.getElementById('top-3-vendedores').style.display = 'none';
        document.getElementById('ranking-vendedores').style.display = 'none';
        document.getElementById('resumo-vendas').style.display = 'block';
        document.getElementById('detalhes-vendedor').style.display = 'none';
    });

    document.querySelector('#ranking-vendedores').addEventListener('click', (event) => {
        const item = event.target.closest('.item-ranking');
        if(item) {
            const vendedorNome = item.getAttribute('data-vendedor');
            const detalhesVendedor = dadosVendedores.filter(venda => venda.Vendedor === vendedorNome);
            const tabelaDetalhes = document.querySelector('#tabela-detalhes tbody');
            tabelaDetalhes.innerHTML = detalhesVendedor.map(venda => `
                <tr>
                    <td>${venda.Vendedor}</td>
                    <td>${venda.Produto}</td>
                    <td>${parseFloat(venda.Total).toFixed(2)}</td>
                </tr>
            `).join('');

            document.getElementById('titulo-principal').innerText = `Detalhes de Vendas - ${vendedorNome}
            `;

            document.getElementById('top-3-vendedores').style.display = 'none';
            document.getElementById('ranking-vendedores').style.display = 'none';
            document.getElementById('resumo-vendas').style.display = 'none';
            document.getElementById('detalhes-vendedor').style.display = 'block';
        }
    });

    document.getElementById('voltar-ranking').addEventListener('click', () => {
        document.getElementById('titulo-principal').innerText = 'Ranking de Vendas';
        document.getElementById('top-3-vendedores').style.display = 'none';
        document.getElementById('ranking-vendedores').style.display = 'flex';
        document.getElementById('resumo-vendas').style.display = 'none';
        document.getElementById('detalhes-vendedor').style.display = 'none';
    });

    document.querySelectorAll('.filtros input').forEach(input => {
        input.addEventListener('input', filtrarTabelaResumo);
    });

    function filtrarTabelaResumo() {
        const filtroVendedor = document.getElementById('filtro-vendedor').value.toLowerCase();
        const filtroProduto = document.getElementById('filtro-produto').value.toLowerCase();
        const filtroTotal = document.getElementById('filtro-total').value.toLowerCase();
        const linhas = document.querySelectorAll('#tabela-resumo tbody tr');
        linhas.forEach(linha => {
            const vendedor = linha.children[0].innerText.toLowerCase();
            const produto = linha.children[1].innerText.toLowerCase();
            const total = linha.children[2].innerText.toLowerCase();
            const correspondeVendedor = vendedor.includes(filtroVendedor);
            const correspondeProduto = produto.includes(filtroProduto)
            const correspondeTotal = total.includes(filtroTotal)

            if(correspondeVendedor && correspondeProduto && correspondeTotal) {
                linha.style.display = '';
            } else {
                linha.style.display = 'none';
            }
        });
    }
    document.getElementById('exportar-resumo').addEventListener('click', () => {
        exportarTabelaParaExcel('tabela-resumo', 'resumo_vendas.xlsx');
    });
    document.getElementById('exportar-detalhes').addEventListener('click', () => {
        exportarTabelaParaExcel('tabela-detalhes', 'detalhes_vendas.xlsx');
    });

    function exportarTabelaParaExcel(tabelaId, nomeArquivo) {
        const tabela = document.getElementById(tabelaId);
        const linhas = Array.from(tabela.querySelectorAll('tr'));
        const tabelaClone = tabela.cloneNode(true);
        const linhasClone = Array.from(tabelaClone.querySelectorAll('tr'));
        const workbook = XLSX.utils.table_to_book(tabelaClone, { sheet: 'Sheet1'});
        XLSX.writeFile(workbook, nomeArquivo);
    }
});