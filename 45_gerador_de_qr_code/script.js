document.getElementById('botaoGerar').addEventListener('click', function() {

    var texto = document.getElementById('entradaTexto').value;

    if(texto) {
        var contenedorQrCode = document.getElementById('qrcode');
        contenedorQrCode.innerHTML = '';
        var qrcode = new QRCode(contenedorQrCode, {
            text: texto,
            width: 256,
            height: 256,
        });

        document.getElementById('botaoBaixar').style.display = 'block';
    } else {
        alert('Por favor, digite algum texto ou URL para gerar o QR code.');
    }
});

document.getElementById('botaoBaixar').addEventListener('click', function() {
    var contenedorQrCode = document.getElementById('qrcode').getElementsByTagName('canvas')[0];
    var link = document.createElement('a');
    link.href = contenedorQrCode.toDataURL("image/png");
    link.download = 'qrcode.png';
    link.click();
})