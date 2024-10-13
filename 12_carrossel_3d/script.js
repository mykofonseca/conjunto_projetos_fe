document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll ('.slide');
    const btnAnterior = document.querySelector('.anterior');
    const btnProximo = document.querySelector('.proximo');

    let anguloAtual = 0;

    const anguloPorSlide = 360 / slides.length;

    function atualizarSlides() {
        slides.forEach((slide, index) => {
            const angulo = anguloAtual + index * anguloPorSlide;
            const radianos = angulo * Math.PI / 180;
            const elevacao = Math.cos(radianos) * 600;

            slide.style.transform = `rotateY(${angulo}deg) translateZ(700px) translateY(${elevacao < 0 ? Math.abs(elevacao) : 0}px)`;
        });
    }

    btnAnterior.addEventListener('click', () => {
        anguloAtual -= anguloPorSlide;
        atualizarSlides();
    });

    btnProximo.addEventListener('click', () => {
        anguloAtual += anguloPorSlide;
        atualizarSlides();
    });

    atualizarSlides();
    setInterval(() => {
        anguloAtual += anguloPorSlide;
        atualizarSlides();
    }, 5000);
});