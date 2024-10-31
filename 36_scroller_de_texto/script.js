document.addEventListener('DOMContentLoaded', function() {
    const scrollers = document.querySelectorAll('.conteudo-led');
    scrollers.forEach(conteudoTexto => {
        conteudoTexto.addEventListener('mouseover', function() {
            this.style.animationPlayStats = 'paused';
        });
        conteudoTexto.addEventListener('mouseout', function() {
            this.style.animationPlayStats = 'running';
        });
    });
});