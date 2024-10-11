
let caixa = document.querySelector('.caixa');
function abrirImagem(numero) {
    let url = `imagem.html?imagem=Imagem${numero}.jpg&descricao=${numero}`;
    window.open(url, '_blank');
}