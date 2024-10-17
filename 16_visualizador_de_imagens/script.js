function mostrarImagem(caminho) {
    const imagemGrande = document.getElementById('imagem-grande');
    const imagemZoom = document.getElementById('imagem-zoom');
    imagemGrande.src = caminho;
    imagemZoom.src = caminho;
}

document.getElementById('imagem-grande').addEventListener('mousemove', function(e) {
    const zoomContainer = document.getElementById('zoom-container');
    const zoomImage = document.getElementById('imagem-zoom');
    const rect = this.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    zoomImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    zoomImage.style.transform = 'scale(2)';
    zoomContainer.style.display = 'block';
});

document.getElementById('imagem-grande').addEventListener('mouseleave', function() {
    const zoomImage = document.getElementById('imagem-zoom');
    zoomImage.style.transform = 'scale(1)';
    const zoomField = document.getElementById('zoom-container');
    zoomField.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    const listaImagens = document.getElementById('lista-imagens');
    const numImagens = 12;
    for(let i = 1; i <= numImagens; i++)  {
        const img = document.createElement('img');
        img.src = `./arqs_p16/imagem${i}.jpg`;
        img.alt = `Imagem ${i}`;

        img.classList.add('miniatura');
        img.onmouseover = () => mostrarImagem(img.src);
        listaImagens.appendChild(img);
    }
});