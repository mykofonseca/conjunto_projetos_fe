document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.galeria-slide img');
    const imagemSelecionada = document.getElementById('imagem-selecionada');
    const descricaoImagem = document.getElementById('descricao-imagem');

    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            imagemSelecionada.src = slide.src;
            descricaoImagem.textContent = slide.dataset.descricao;
        });
    });

    function atualizarImagem(slide) {
        imagemSelecionada.src = slide.src;
        descricaoImagem.textContent = slide.dataset.descricao;
    }

    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            atualizarImagem(slide);
        });
    });

    if(slides.length > 0) {
        atualizarImagem(slides[0]);
    }
})