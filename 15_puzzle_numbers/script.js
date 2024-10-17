document.addEventListener('DOMContentLoaded', () => {
    const containerPuzzle = document.getElementById('container-puzzle');
    const botaoTestar = document.getElementById('botao-testar');
    const tamanhoTabuleiro = document.getElementById('tamanho-tabuleiro');
    const modalVitoria = document.getElementById('modal-vitoria');
    
    modalVitoria.style.display = "none";

    const fecharModal = document.getElementById('fechar-modal');
    const pontuacao = document.getElementById('pontuacao')

    let pontos = localStorage.getItem('pontos_puzzle') ? parseInt(localStorage.getItem('pontos_puzzle')) : 
    0;
    let ordemPecas;
    let tamanhoAtual = 3;

    pontuacao.innerText = `Pontos: ${pontos}`;

    fecharModal.onclick = () => {
        modalVitoria.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target === modalVitoria) {
            modalVitoria.style.display = "none";
        }
    }

    tamanhoTabuleiro.addEventListener('change', () => {
        tamanhoAtual = parseInt(tamanhoTabuleiro.value);
        inicializarJogo();
    });

    botaoTestar.addEventListener('click', () => {
        ordemPecas = criarOrdemTeste(tamanhoAtual);
        renderizar();
    });

    function criarOrdemTeste(tamanho) {
        const ordem = [];

        for(let i = 1; i < tamanho * tamanho - 1; i++) {
            ordem.push(i)
        }
    
        ordem.push(null);
        ordem.push(tamanho * tamanho - 1);
    
        return ordem;
    }

    function inicializarJogo() {
        ordemPecas = criarOrdemInicial(tamanhoAtual);
        embaralhar(ordemPecas);
        criarTabuleiro(tamanhoAtual);
        renderizar();
    }

    function criarOrdemInicial(tamanho) {
        const ordem = [];

        for(let i = 1; i < tamanho * tamanho - 1; i++) {
            ordem.push(i)
        }

        ordem.push(null);
        return ordem;    
    }

    function embaralhar(array) {
        for(let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]]
        }
    }

    function criarTabuleiro(tamanho) {
        containerPuzzle.style.gridTemplateColumns = `repeat(${tamanho}, 100px)`;
        containerPuzzle.style.gridTemplateRows = `repeat(${tamanho}, 100px)`;
        containerPuzzle.innerHTML = '';

        for(let i = 1; i <= tamanho * tamanho; i++) {
            const peca = document.createElement('div')
            peca.classList.add('peca');
            if(i === tamanho * tamanho) {
                peca.id = 'peca-vazia';
            } else {
                peca.id = `peca-${i}`;
                peca.innerText = i;
            }
            containerPuzzle.appendChild(peca);
        }
    }

    function renderizar() {
        const pecas = Array.from(document.querySelectorAll('.peca'));
        ordemPecas.forEach((valor, index) => {
            if (valor !== null) {
                pecas[valor - 1].style.order = index;
                pecas[valor - 1].style.backgroundColor = '#ffdab9';
            } else {
                const pecaVazia = document.getElementById('peca-vazia');
                pecaVazia.style.order = index;
                pecaVazia.style.backgroundColor = '#8b5a2b';
            }
        });
        verificarVitoria();
    }

    function verificarVitoria() {
        const ordemCorreta = criarOrdemInicial(tamanhoAtual);
        if(ordemPecas.every((val, index) => val === ordemCorreta[index])) {
            pontos += 10;
            localStorage.setItem('pontos_puzzle', pontos);
            pontuacao.innerText = `Pontos: ${pontos}`;
            modalVitoria.style.display = "flex";
        }
    }

    function jogadaValida(indexOrigem, indexDestino) {
        const colunas = tamanhoAtual;
        const linhaOrigem = Math.floor(indexOrigem / colunas);
        const colunaOrigem = indexOrigem % colunas;
        const linhaDestino = Math.floor(indexDestino / colunas);
        const colunaDestino = indexDestino % colunas;
        const distancia = Math.abs(linhaOrigem - linhaDestino) + Math.abs(colunaOrigem - colunaDestino);
        return distancia === 1;
    }

    document.addEventListener('click', (event) => {
        if(event.target.classList.contains('peca')) {
            const indexPeca = ordemPecas.indexOf(parseInt(event.target.innerText));
            const indexVazio = ordemPecas.indexOf(null);
            if(jogadaValida(indexPeca, indexVazio)) {
                [ordemPecas[indexPeca], ordemPecas[indexVazio]] = [ordemPecas[indexVazio], ordemPecas[indexPeca]];
                renderizar();
            }
        }
    });
    inicializarJogo();
});
