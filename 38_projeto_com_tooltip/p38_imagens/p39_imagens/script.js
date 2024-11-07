document.addEventListener('DOMContentLoaded', function () {
    const table = document.getElementById('tabela-vendedores').getElementsByTagName('tbody')[0];
    const tooltip = document.getElementById('tooltip');
    let dadosTabela = [];
    function carregarExcel() {
        fetch('Vendedor.xlsx')
            .then(response => response.arrayBuffer())
            .then(data => {
                const workbook = XLSX.read(data, { type: 'array'});
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(sheet);
                dadosTabela = json;
                preencherTabela(dadosTabela);
            })
            .catch(error => console.error('Erro ao carregar o arquivo Excel', error));
    }

    function preencherTabela(dados) {
        tabela.innerHTML = '',
        dados.forEach(linha => {
            const novaLinha = tabela.insertRow();
            const celulaImagem = novaLinha.insertCell();
            const imagem = document.createElement('img');
            imagem.src = `imagens/${linha.Vendedor}.jpg`;
            imagem.alt = linha.Vendedor;

            imagem.width = 50;
            imagem.height = 50;

            celulaImagem.appendChild(imagem);
            const celulaVendedor = novaLinha.insertCell();
            celulaVendedor.textContent = linha.Vendedor;
            const celulaProduto = novaLinha.insertCell();
            celulaProduto.textContent = linha.Produto;

            const totalFormato = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(linha.Total);
            const celulaTotal = novaLinha.insertCell();
            celulaTotal.textContent = totalFormato;
            novaLinha.addEventListener('mouseover', () => {
                tooltip.innerHTML = `
                    <img src="imagemProduto/${linha.Produto}.jpg" alt="${linha.Produto}"
                    class="produtos-imagem">
                    <div class="produto-nome">${linha.Produto}</div>
                    <div class="total">${totalFormato}</div>
                `;
                tooltip.style.display = 'block';
            });
            novaLinha.addEventListener('mousemove', (event) => {
                tooltip.style.left = `${event.pageX + 10}px`;
                tooltip.style.top = `${event.pageY + 10}px`;
            });

            novaLinha.addEventListener('mouseout', () => {
                tooltip.style.display = 'none';
            });
        });
    }

    function filtrarTabela() {
        const filtroVendedor = document.getElementById('filtro-vendedor').value.toLowerCase();
        const filtroProduto = document.getElementById('filtro-produto').value.toLowerCase();
        const filtroPreco = document.getElementById('filtro-preco').value;
        const dadosFiltrados = dadosTabela.filter(linha => {
            const vendedorMatch = linha.Vendedor.toLowerCase().includes(filtroVendedor);
            const produtoMatch = linha.Produto.toLowerCase().includes(filtroProduto);
            const precoMatch = filtroPreco ? parseFloat(linha.Total) >= parseFloat(filtroPreco) : true;
            return vendedorMatch && produtoMatch && precoMatch;
        });
        preencherTabela(dadosFiltrados);
    }

    document.getElementById('filtro-vendedor').addEventListener('input', filtrarTabela);
    document.getElementById('filtro-produto').addEventListener('input', filtrarTabela);
    document.getElementById('filtro-preco').addEventListener('input', filtrarTabela);

    carregarExcel();
});