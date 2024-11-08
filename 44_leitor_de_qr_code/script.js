document.getElementById('selecionarArquivo').addEventListener('change', function(evento) {
    const arquivo = evento.target.files[0];

    if(!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = function(evento) {

        const img = new Image();
        img.onload = function() {

            const canvas = document.getElementById('canvas');
            const contexto = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            contexto.drawImage(img, 0, 0, img.width, img.height);

            const dadosImagem = contexto.getImageData(0, 0, canvas.width, canvas.height);

            const codigo = jsQR(dadosImagem.data, canvas.width, canvas.height);

            if(codigo) {
                document.getElementById('resultado').innerText = `Código QR lido: ${codigo.data}`;
            } else {
                document.getElementById('resultado').innerText = 'Não foi possível ler o QR Code. Tente novamente';
            }
        };

        img.src = evento.target.result;
    }

    leitor.readAsDataURL(arquivo);
})