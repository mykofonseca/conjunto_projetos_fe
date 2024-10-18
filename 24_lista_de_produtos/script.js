document.addEventListener('DOMContentLoaded', function() {
    const listaProdutos = document.getElementById('lista-produtos');
    const detalhesProdutos = document.getElementById('detalhes-produto');
    const filtroProduto = document.getElementById('filtro-produtos');
    const filtroVendedor = document.getElementById('filtro-vendedor');
    const mostrarTodosBtn = document.getElementById('mostrar-todos');
    const totalVendas = document.getElementById('total-vendas');
    let dadosTabela = [];
    let produtosUnicos = [];
    let vendedoresUnicos = [];

    function carregarExcel() {
        fetch('Vendedor.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array'});
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet);
            dadosTabela = json;
            criarListaProdutos();
            criarListaVendedores();
            calcularTotalVendas(dadosTabela)
        })
        .catch(error => console.error('Erro ao carregar o arquivo Excel:', error));
    }

    function criarListaProdutos() {
        const produtosMap = new Map();
        dadosTabela.forEach(linha => {
            if (!produtosMap.has(linha.Produto)) {
                produtosMap.set(linha.Produto, {
                    ...linha,
                    Total: 0
                });
            }
            produtosMap.get(linha.Produto).Total += linha.Total;
        });

        produtosUnicos = Array.from(produtosMap.values());
        preencherListaProdutos(produtosUnicos);
        exibirMiniaturasProdutos(produtosUnicos);
    }

    function preencherListaProdutos(produtos) {
        listaProdutos.innerHTML = '';
        produtos.forEach(produto => {
            const li = document.createElement('li');
            li.textContent = produto.Produto;
            li.addEventListener('click', () => exibirDetalhesProdutos(produto));
            listaProdutos.appendChild(li);
        });
    }

    function exibirDetalhesProdutos(produto) {
        detalhesProdutos.innerHTML = `
        <img src="imagemProduto/${produto.Produto}.jpg" alt="${produto.Produto}">
        <h2>${produto.Produto}</h2>
        <p>Total de Vendas: ${new Intl.NumberFormat('pt-BR', {style: "currency", currency: 'BRL'}).format(produto.Total)}</p>
        `;
    }

    function exibirMiniaturasProdutos(produtos) {
        detalhesProdutos.innerHTML = `<div class="miniaturas"></div>`;
        const miniaturasDiv = detalhesProdutos.querySelector('.miniaturas');
        produtos.forEach(produto => {
            const img = document.createElement('img');
            img.src = `imagemProduto/${produto.Produto}.jpg`;
            img.alt = produto.Produto;
            img.addEventListener('click', () => exibirDetalhesProdutos(produto));
            miniaturasDiv.appendChild(img);
        });
    }

    function criarListaVendedores() {
        const vendedoresSet = new Set(dadosTabela.map(linha => linha.Vendedor));
        vendedoresUnicos = Array.from(vendedoresSet);
        vendedoresUnicos.forEach(vendedor => {
            const option = document.createElement('option');
            option.value = vendedor;
            option.textContent = vendedor;
            filtroVendedor.appendChild(option);
        });
    }

    function calcularTotalVendas(produtos) {
        const total = produtos.reduce((sum, produto) => 
        sum + (produto.Total || 0), 0);
        totalVendas.textContent = `Total de Vendas: ${new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(total)}`;
    }

    function filtrarListaProdutos() {
        const filtro = filtroProduto.value.toLowerCase();
        const filtroVend = filtroVendedor.value;
        const produtosFiltrados = dadosTabela.filter(linha => {
            const produtoMatch = linha.Produto.toLowerCase().includes(filtro);
            const vendedorMatch = filtroVend === "" || linha.Vendedor === filtroVend;
            return produtoMatch && vendedorMatch;
        });

        const produtosMap = new Map();
        produtosFiltrados.forEach(linha => {
            if(!produtosMap.has(linha.Produto)) {
                produtosMap.set(linha.Produto, {
                    ...linha,
                    Total: 0
                });
            }
            produtosMap.get(linha.Produto).Total += linha.Total;
        });

        const produtosUnicosFiltrados = Array.from(produtosMap.values());
        preencherListaProdutos(produtosUnicosFiltrados);
        exibirMiniaturasProdutos(produtosUnicosFiltrados);
        calcularTotalVendas(produtosFiltrados);
    }

    filtroProduto.addEventListener('input', filtrarListaProdutos);
    filtroVendedor.addEventListener('change', filtrarListaProdutos);
    mostrarTodosBtn.addEventListener('click', () => {
        preencherListaProdutos(produtosUnicos);
        exibirMiniaturasProdutos(produtosUnicos);
        calcularTotalVendas(dadosTabela);
    });

    carregarExcel();
})