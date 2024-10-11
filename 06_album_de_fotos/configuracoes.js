document.getElementById('seletorArquivo').addEventListener('change', function(e) {
    const arquivos = e.target.files;
    const galeria = document.getElementById('galeria');
    Array.from(arquivos).forEach(arquivo => {
        if(arquivo.type.startsWith('image/')) {
            const leitor = new FileReader();
            leitor.onload = function(e) {
                const descricao = prompt("Insira uma descrição para a imagem '" + arquivo.name + "':");
                const div = document.createElement('div');
                div.classList.add('imagem');
                const img = new Image();
                img.src = e.target.result;
                img.alt = arquivo.name;
                img.onclick = function() { abrirModal(e.target.result, descricao); };
                div.appendChild(img);
                galeria.appendChild(div);
            };
            leitor.readAsDataURL(arquivo);
        }
    });
});

function abrirModal(src, descricao) {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.querySelector('img').src = src;
    modal.querySelector('.descricao').textContent = descricao || "Sem descrição.";
    window.imagemAtual = src;
}

function fecharModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function removerImagem(event) {
    event.stopPropagation();
    const imagens = document.querySelectorAll('#galeria .imagem img');
    imagens.forEach(img => {
        if(img.src === window.imagemAtual) {
            img.parentElement.remove()
        }
    });
    fecharModal();
};