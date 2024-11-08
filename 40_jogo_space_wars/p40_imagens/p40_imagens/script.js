const telaJogo = document.getElementById('telaJogo');
const contexto = telaJogo.getContext('2d');
const somTiro = document.getElementById('somTiro');
const modal = document.getElementById('modal');
const mensagemModal = document.getElementById('mensagemModal');
const botaoContinuar = document.getElementById('botaoContinuar');
const botaoTerminar = document.getElementById('botaoTerminar');

class Objeto {
    constructor(x, y, largura, altura, cor) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.cor = cor;
    }
    desenhar() {
        contexto.fillStyle = this.cor;
        contexto.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

class Jogador extends Objeto {
    constructor(x, y, largura, altura, imagem) {
        super(x, y, largura, altura);
        this.imagem = imagem;
        this.velocidade = 0;
        this.vidas = parseInt(localStorage.getItem('vidas'), 10) || 3;
    }

    desenhar() {
        contexto.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    }

    atualizar() {
        this.x += this.velocidade;
        this.x = Math.max(0, Math.min(this.x, telaJogo.width - this.largura));
    }

    mover(direcao) {
        const velocidade = 5;
        this.velocidade = direcao === 'esquerda' ? -velocidade : velocidade;
    }

    parar() {
        this.velocidade = 0;
    }

    perderVida() {
        this.vidas--;
        document.getElementById('vidas').innerText = `Vidas: ${this.vidas}`;

        if (this.vidas === 0) {
            localStorage.setItem('vidas', 3);
            exibirModal('Você perdeu! Game Over', false);
        }
    }
}

class Bala extends Objeto {
    constructor(x, y, largura, altura, cor, velocidade) {
        super(x, y, largura, altura, cor);
        this.velocidade = velocidade;
    }

    atualizar() {
        this.y += this.velocidade;
    }
}

class Inimigo extends Objeto {
    constructor(x, y, largura, altura, imagem) {
        super(x, y, largura, altura);
        this.imagem = imagem;
        this.chanceTiro = 0.0003;
        this.direcao = 1;
    }

    desenhar() {
        contexto.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    }

    atualizar() {
        this.x += this.direcao;
        if (Math.random() < this.chanceTiro) {
            this.atirar();
        }
    }

    atirar() {
        balasInimigas.push(new Bala(this.x + this.largura / 2 - 2, this.y + this.altura, 4, 10, 'blue', 2));
    }
}

function exibirModal(mensagem, podeContinuar) {
    mensagemModal.innerText = mensagem;
    if (podeContinuar) {
        botaoContinuar.style.display = 'inline-block';
    } else {
        botaoContinuar.style.display = 'none';
    }
    modal.style.display = 'flex';
}

class GradeInimigos {
    constructor(linhas, colunas, espacamentoInimigo, larguraInimigo, alturaInimigo) {
        this.linhas = linhas;
        this.colunas = colunas;
        this.espacamentoInimigo = espacamentoInimigo;
        this.larguraInimigo = larguraInimigo;
        this.alturaInimigo = alturaInimigo;
        this.inimigos = [];
        this.criarInimigos();
        this.velocidade = 1;
        this.direcao = 1;
        this.pontuacao = 0;
    }

    criarInimigos() {
        this.inimigos = [];
        for (let linha = 0; linha < this.linhas; linha++) {
            for (let coluna = 0; coluna < this.colunas; coluna++) {
                this.inimigos.push(new Inimigo(
                    coluna * (this.larguraInimigo + this.espacamentoInimigo),
                    linha * (this.alturaInimigo + this.espacamentoInimigo),
                    this.larguraInimigo,
                    this.alturaInimigo,
                    imagemInimigo
                ));
            }
        }
    }

    atualizar() {
        let atingiuParede = false;
        this.inimigos.forEach(inimigo => {
            inimigo.atualizar();
            if (inimigo.x <= 0 || inimigo.x + inimigo.largura >= telaJogo.width) {
                atingiuParede = true;
            }
        });

        if (atingiuParede) {
            this.direcao *= -1;
            const offsetY = this.alturaInimigo + this.espacamentoInimigo;
            this.inimigos.forEach(inimigo => {
                inimigo.direcao = this.direcao;
                inimigo.y += offsetY;
            });
        }

        this.inimigos.forEach(inimigo => {
            if (
                inimigo.x < jogador.x + jogador.largura &&
                inimigo.x + inimigo.largura > jogador.x &&
                inimigo.y + inimigo.altura > jogador.y &&
                inimigo.y < jogador.y + jogador.altura
            ) {
                jogador.perderVida();
            }

            if (inimigo.y + inimigo.altura >= telaJogo.height) {
                jogador.perderVida();
            }
        });

        if (this.inimigos.length === 0 && jogador.vidas > 0) {
            chefe = new Chefe(telaJogo.width / 2 - 200, 0, 400, 200, imagemChefe);
        }
    }

    desenhar() {
        this.inimigos.forEach(inimigo => inimigo.desenhar());
    }

    aumentarPontuacao() {
        this.pontuacao++;
        const pontuacaoFormatada = this.pontuacao.toLocaleString('pt-BR');
        document.getElementById('pontuacao').innerText = `Pontuação: ${pontuacaoFormatada}`;
        localStorage.setItem('pontuacao', this.pontuacao);
    }
}

class Chefe extends Objeto {
    constructor(x, y, largura, altura, imagem) {
        super(x, y, largura, altura);
        this.imagem = imagem;
        this.vidas = 100;
        this.chanceTiro = 0.02;
        this.direcao = 1;
        this.velocidade = 2;
    }

    desenhar() {
        contexto.drawImage(this.imagem, this.x, this.y, this.largura, this.altura);
    }

    atualizar() {
        this.x += this.direcao * this.velocidade;
        if (this.x <= 0 || this.x + this.largura >= telaJogo.width) {
            this.direcao *= -1;
        }

        if (Math.random() < this.chanceTiro) {
            this.atirar();
        }
    }

    atirar() {
        balasInimigas.push(new Bala(this.x + this.largura / 2 - 2, this.y + this.altura, 4, 10, 'blue', 2));
    }

    levarDano() {
        this.vidas--;
        if (this.vidas <= 0) {
            gradeInimigos.pontuacao += 100;
            const pontuacaoFormatada = gradeInimigos.pontuacao.toLocaleString('pt-BR');
            document.getElementById('pontuacao').innerText = `Pontuação: ${pontuacaoFormatada}`;
            localStorage.setItem('pontuacao', gradeInimigos.pontuacao);
            localStorage.setItem('vidas', jogador.vidas);
            document.location.reload();
        }
    }
}

const imagemJogador = new Image();
imagemJogador.src = 'nave.png';
const imagemInimigo = new Image();
imagemInimigo.src = 'inimigo.png';
const imagemChefe = new Image();
imagemChefe.src = 'chefe.png';

const jogador = new Jogador(telaJogo.width / 2 - 15, telaJogo.height - 30, 30, 10, imagemJogador);
const balasJogador = [];
const gradeInimigos = new GradeInimigos(10, 12, 10, 30, 20);
const balasInimigas = [];
let chefe = null;

function loopJogo() {
    contexto.clearRect(0, 0, telaJogo.width, telaJogo.height);
    jogador.atualizar();
    jogador.desenhar();

    balasJogador.forEach((bala, indice) => {
        bala.atualizar();
        if (bala.y + bala.altura < 0) {
            balasJogador.splice(indice, 1);
        } else {
            bala.desenhar();
        }
    });

    balasInimigas.forEach((bala, indice) => {
        bala.atualizar();
        if (bala.y > telaJogo.height) {
            balasInimigas.splice(indice, 1);
        } else {
            bala.desenhar();
        }
    });

    if (gradeInimigos.inimigos.length > 0) {
        gradeInimigos.atualizar();
        gradeInimigos.desenhar();
    }

    if (chefe) {
        chefe.atualizar();
        chefe.desenhar();
    }

    balasJogador.forEach((bala, indiceBala) => {
        if (chefe &&
            bala.x < chefe.x + chefe.largura &&
            bala.x + bala.largura > chefe.x &&
            bala.y < chefe.y + chefe.altura &&
            bala.y + bala.altura > chefe.y
        ) {
            chefe.levarDano();
            balasJogador.splice(indiceBala, 1);
        }

        gradeInimigos.inimigos.forEach((inimigo, indiceInimigo) => {
            if (
                bala.x < inimigo.x + inimigo.largura &&
                bala.x + bala.largura > inimigo.x &&
                bala.y < inimigo.y + inimigo.altura &&
                bala.y + bala.altura > inimigo.y
            ) {
                gradeInimigos.inimigos.splice(indiceInimigo, 1);
                balasJogador.splice(indiceBala, 1);
                gradeInimigos.aumentarPontuacao();
            }
        });
    });

    balasInimigas.forEach((bala, indice) => {
        if (
            bala.x < jogador.x + jogador.largura &&
            bala.x + bala.largura > jogador.x &&
            bala.y < jogador.y + jogador.altura &&
            bala.y + bala.altura > jogador.y
        ) {
            balasInimigas.splice(indice, 1);
            jogador.perderVida();
        }
    });

    if (jogador.vidas > 0) {
        requestAnimationFrame(loopJogo);
    }
}

botaoTerminar.addEventListener('click', () => {
    localStorage.setItem('vidas', 3);
    document.location.reload();
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        jogador.mover('esquerda');
    } else if (e.key === 'ArrowRight') {
        jogador.mover('direita');
    } else if (e.key === ' ' && balasJogador.length < 3) {
        balasJogador.push(new Bala(jogador.x + jogador.largura / 2 - 2, jogador.y, 4, 10, 'red', -4));
        somTiro.currentTime = 0;
        somTiro.play();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        jogador.parar();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const pontuacaoSalva = localStorage.getItem('pontuacao');
    if (pontuacaoSalva !== null) {
        const pontuacaoFormatada = parseInt(pontuacaoSalva, 10).toLocaleString('pt-BR');
        document.getElementById('pontuacao').innerText = `Pontuação: ${pontuacaoFormatada}`;
        gradeInimigos.pontuacao = parseInt(pontuacaoSalva, 10);
    }

    const vidasSalvas = parseInt(localStorage.getItem('vidas'), 10) || 3;
    jogador.vidas = vidasSalvas;
    document.getElementById('vidas').innerText = `Vidas: ${jogador.vidas}`;
});

loopJogo();