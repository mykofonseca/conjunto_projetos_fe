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
        })
    }
}

// linha 150, slide 73