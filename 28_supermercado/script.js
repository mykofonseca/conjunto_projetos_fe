document.addEventListener("DOMContentLoaded", function() {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const categorias = {
        "Alimentos": [
            { id: 1, nome: "Arroz", descricao: "Arroz branco longo, 5kg", imageUrl: "imagens/arroz.jpg", preco: "19,90"},
            { id: 2, nome: "Feijão", descricao: "Feijão preto, 1kg", imageUrl: "imagens/feijao.jpg", preco: "7,50"},
            { id: 3, nome: "Macarrão", descricao: "Macarraão integral, 500g", imageUrl: "imagens/macarrao.jpg", preco: "4,99"},
        ],
        "Bebidas": [
            { id: 4, nome: "Coca Cola", descricao: "Refrigerante de cola, 2L", imageUrl: "imagens/coca.jpg", preco: "6,99"},
            { id: 5, nome: "Suco de Laranja", descricao: "Suco natural, 1L", imageUrl: "imagens/suco.jpg", preco: "5,99"},
            { id: 6, nome: "Água Mineral", descricao: "Água mineral sem gás, 500ml", imageUrl: "imagens/agua.jpg", preco: "1,90"},
        ],
        "Laticínios": [
            { id: 7, nome: "Leite Integral", descricao: "Leite integral, 1L", imageUrl: "imagens/leite.jpg", preco: "3,59"},
            { id: 8, nome: "Queijo", descricao: "Queijo, 1kg", imageUrl: "imagens/queijo.jpg", preco: "50,90"},
            { id: 9, nome: "Iogurte Natural", descricao: "Iogurte natural, 1L", imageUrl: "imagens/iogurte.jpg", preco: "2,99"},
        ],
        "Produtos de Limpeza": [
            { id: 10, nome: "Detergente", descricao: "Detergente líquido, 500ml", imageUrl: "imagens/detergente.jpg", preco: "1,79"},
            { id: 11, nome: "Desinfetante", descricao: "Desinfetante multíuso, 1L", imageUrl: "imagens/desinfetante.jpg", preco: "4,99"},
            { id: 12, nome: "Água Sanitária", descricao: "Água sanitária, 2L", imageUrl: "imagens/agua_sanitaria.jpg", preco: "3,49"},
        ],
        "Snacks": [
            { id: 13, nome: "Batata Chips", descricao: "Batata chips, sabor original, 100g", imageUrl: "imagens/arroz.jpg", preco: "6,99"},
            { id: 14, nome: "Amendoim", descricao: "Amendoim torrado e salgado, 200g", imageUrl: "imagens/batata_chips.jpg", preco: "5,49"},
            { id: 15, nome: "Bolacha Recheada", descricao: "Bolacha recheada, sabor chocolate, 150g", imageUrl: "imagens/bolacha.jpg", preco: "2,50"}
        ]
    };

    const secoesProdutos = document.getElementById('secoes-produtos');
    const campoPesquisa = document.getElementById('campo-pesquisa');
    const botaoPesquisar = document.getElementById('botao-pesquisar');
    const botaoVerCarrinho = document.getElementById('botao-ver-carrinho');
    const contadorCarrinho = document.getElementById('contador-carrinho');
    const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
    const botaoLimparFiltro = document.getElementById('limpar-filtro');
    const imagemProduto = document.getElementById('imagem-produto');
    const nomeProduto = document.getElementById('nome-produto');
    const descricaoProduto = document.getElementById('descricao-produto');
    const precoProduto = document.getElementById('preco-produto');
    const quantidadeProduto = document.getElementById('quantidade-produto');
    const botaoAdicionarCarrinhoModal = document.getElementById('botao-adicionar-carrinho-modal');

    const bototesCategoria = document.querySelectorAll('.categoria');
    const modalProduto = new bootstrap.Modal(document.getElementById('modalProduto'));
    
    function atualizarExibicaoProdutos(categoriasFiltradas) {
        secoesProdutos.innerHTML = '';
        Object.keys(categoriasFiltradas).forEach(categoria => {
            if(categoriasFiltradas[categoria].length > 0) {
                let secao = document.createElement('section');
                let h2 = document.createElement('h2');
                h2.textContent = categoria;
                secao.appendChild(h2);

                let linha = document.createElement('div');
                linha.className = 'row';
                categoriasFiltradas[categoria].forEach(produto => {
                    let coluna = document.createElement('div');
                    coluna.className = 'col-md-4';
                    let cartao = document.createElement('div');
                    cartao.className = 'card';

                    cartao.innerHTML = ``
                    // linha 201
                })
            }
        })
    }
})