const palavras = [
    'CASA', 'BOLA', 'GATO', 'CHUVA', 'SOL', 'AMIGO', 'LUA', 'FOGO', 'VENTO', 'PATO',
    'LIVRO', 'MESA', 'TOALHA', 'JANELA', 'CARRO', 'ESCOLA', 'FLORESTA', 'PRAIA', 
    'COMPUTADOR', 'TELEFONE', 'CADERNO', 'LAMPADA', 'ESPADA', 'DINHEIRO', 'PERFUME', 
    'CHAVE', 'QUADRO', 'PLANTA', 'FILME', 'MUSICA','REVISTA', 'BOTAO', 'CAIXA', 'SAPATO', 
    'CACHORRO', 'PASSARINHO', 'CEBOLA', 'TOMATE', 'CELULAR', 'RELOGIO', 'GARRAFA', 'COPO',
    'CANETA', 'LENCOL', 'TRAVESSEIRO', 'COLHER', 'GARFO', 'PRATO', 'CORTINA', 'ESPONJA'
];

let palavraAleatorioa = '';
let tentativaAtual = '';
let pontuacao = 0;

function novaPalavra() {
    palavraAleatorioa = palavras[pontuacao % palavras.length];
    document.getElementById('palavra').innerText = embaralharPalavra(palavraAleatorioa);
    document.getElementById('resultado').innerText = '';
    tentativaAtual = '';
}

function embaralharPalavra(palavra) {
    let palavraEmbaralhada = '';
    const palavraArray = palavra.split('');
    while (palavraArray.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * palavraArray.length);
        palavraEmbaralhada += palavraArray.splice(indiceAleatorio, 1)[0];
    }
    return palavraEmbaralhada;
}

function criarTecladoVirtual() {
    const tecladoContainer = document.getElementById('teclado-virtual');
    const linhasTeclado = [
        'QWERTYUIOP',
        'ASDFGHJKLÇ',
        'ZXCVBNM'
    ];
    linhasTeclado.forEach(linha => {
        const linhaDiv = document.createElement('div');
        linha.split('').forEach(letra => {
            const botao = document.createElement('button');
            botao.innerText = letra;
            botao.classList.add('tecla');
            botao.onclick = () => adicionarLetra(letra);
            linhaDiv.appendChild(botao);
        });
        tecladoContainer.appendChild(linhaDiv);
    });
    const botaoApagar = document.createElement('button');
    botaoApagar.innerText = 'Apagar';
    botaoApagar.classList.add('tecla', 'tecla-apagar');
    botaoApagar.onclick = apagarUltimaLetra;
    tecladoContainer.appendChild(botaoApagar);
}

function adicionarLetra(letra) {
    tentativaAtual += letra;
    atualizarTentativa();
}

function apagarUltimaLetra() {
    tentativaAtual = tentativaAtual.slice(0, -1);
    atualizarTentativa();
}

function atualizarTentativa() {
    document.getElementById('resultado').innerText = tentativaAtual;
}

function verificarTentativa() {
    if(tentativaAtual === palavraAleatorioa) {
        pontuacao +=1;
        atualizarPontuacao();
        document.getElementById('resultado').innerText = 'Parabéns, você acertou!';
        setTimeout(novaPalavra, 2000);
    } else {
        mostrarModal('modal-erro');
    } 
    tentativaAtual = '';
    atualizarTentativa();
}

function atualizarPontuacao() {
    document.getElementById('pontuacao').innerText = `Pontuação: ${pontuacao}`;
    localStorage.setItem('anagramaPontos', pontuacao);
}

function carregarPontuacao() {
    const pontuacaoSalva = localStorage.getItem('anagramaPontos');

    if(pontuacaoSalva) {
        pontuacao = parseInt(pontuacao);
    }

    atualizarPontuacao();
}

function mostrarModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function mostrarDica() {
    document.getElementById('dica-palavra').innerText = palavraAleatorioa;
    mostrarModal('modal-dica');
}

carregarPontuacao();
novaPalavra();
criarTecladoVirtual();