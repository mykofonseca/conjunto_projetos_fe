let tabuleiro = ['', '', '', '', '', '', '', '', '', ];
let jogadorAtual = 'X';
let jogoAtivo = true;
let pontuacaoJogador = 0;
let pontuacaoComputador = 0;
let pontuacaoEmpates = 0;

const COMBINACOES_VITORIA = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function fazerJogada(indiceCelula) {
    if(!jogoAtivo || tabuleiro[indiceCelula] !== '') return;
    tabuleiro[indiceCelula] = jogadorAtual;
    renderizarTabuleiro();
    if(verificarVitoria()) {
        jogoAtivo = false;
        atualizarPontuacoes(jogadorAtual);
        setTimeout(() => {
            alert(`${jogadorAtual} venceu`);
            reiniciarJogo();
        }, 100);

        return;
    } 

    if(verificarEmpate()) {
        jogoAtivo = false;
        atualizarPontuacoes('empate');
        setTimeout(() => {
            alert('Empate')
            reiniciarJogo();
        }, 100);
        return;
    }

    jogadorAtual = jogadorAtual === 'X' ? 'O' : 'X';

    if(jogadorAtual === 'O' && jogoAtivo) {
        setTimeout(() => {
            movimentoComputador();
        }, 500);
    }
}

function movimentoComputador() {
    let melhorPontuacao = -Infinity;
    let movimento;
    for(let i = 0; i < tabuleiro.length; i++) {
        if(tabuleiro[i] === '') {
            tabuleiro[i] = 'O';
            let pontuacao = minimax(tabuleiro, 0, false);
            tabuleiro[i] = '';
            if(pontuacao > melhorPontuacao) {
                melhorPontuacao = pontuacao;
                movimento = i;
            }
        }
    }
    fazerJogada(movimento);
}

function minimax(tabuleiro, profundidade, estaMaximizando) {
    let resultado = verificarVencedor();
    if(resultado !== null) {
        return resultado === 'O' ? 10 - profundidade : profundidade - 10;
    }

    if(estaMaximizando) {
        let melhorPontuacao = -Infinity;
        for(let i = 0; i < tabuleiro.length; i++) {
            if(tabuleiro[i] === '') {
                tabuleiro[i] = 'O';
                let pontuacao = minimax(tabuleiro, profundidade + 1, false);
                tabuleiro[i] = '';
                melhorPontuacao = Math.max(pontuacao, melhorPontuacao);
            }
        }
        return melhorPontuacao;
    } else {
        let melhorPontuacao = Infinity;
        for(let i = 0; i < tabuleiro.length; i++) {
            if (tabuleiro[i] === '') {
                tabuleiro[i] = 'X';
                let pontuacao = minimax(tabuleiro, profundidade + 1, true);
                tabuleiro[i] = '';
                melhorPontuacao = Math.min(pontuacao, melhorPontuacao);
            }
        }
        return melhorPontuacao;
    }
}

function verificarVencedor() {
    for(let combinacao of COMBINACOES_VITORIA) {
        const [a, b, c] = combinacao;
        if(tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[b] === tabuleiro[c]) {
            return tabuleiro[a];
        }
    }
    return null;
}

function verificarVitoria() {
    return verificarVencedor() !== null;
}

function verificarEmpate() {
    return !tabuleiro.includes('');
}

function atualizarPontuacoes(vencedor) {
    if(vencedor === 'empate') {
        pontuacaoEmpates++
    } else if (vencedor === 'X') {
        pontuacaoJogador++;
    } else {
        pontuacaoComputador++;
    }
    renderizarPontuacoes();
}

function renderizarPontuacoes() {
    document.getElementById('pontuacao-jogador').textContent = pontuacaoJogador;
    document.getElementById('pontuacao-computador').textContent = pontuacaoComputador;
    document.getElementById('pontuacao-empates').textContent = pontuacaoEmpates;
}

function renderizarTabuleiro() {
    for (let i = 0; i < tabuleiro.length; i++) {
        const celula = document.getElementsByClassName('celula')[i];
        celula.textContent = tabuleiro[i];
        }
} 

function reiniciarJogo() {
    tabuleiro = ['', '', '', '', '', '', '', '', ''];
    jogadorAtual = 'X';
    jogoAtivo = true;
    renderizarTabuleiro();
}

renderizarPontuacoes();