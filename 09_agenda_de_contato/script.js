document.addEventListener('DOMContentLoaded', function() {
    renderizarContatos();
});

function salvarContatos(contatos) {
    localStorage.setItem('contatos', JSON.stringify(contatos));
}

function obterContatos() {
    return JSON.parse(localStorage.getItem('contatos') || '[]');
}

function adicionarContato() {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;

    const novoContato = { id: Date.now(), nome, email, telefone };
    const contatos = obterContatos();

    contatos.push(novoContato);
    salvarContatos(contatos);
    renderizarContatos();
    limparCampos();
}

function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
}

function renderizarContatos(contatos = obterContatos()) {
    const tbody = document.getElementById('tabelaContatos').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    contatos.forEach(function(contato) {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `<td>${contato.nome}</td>
                        <td>${contato.email}</td>
                        <td>${contato.telefone}</td>
                        <td>
                            <button onclick="editarContato(${contato.id})">Alterar</button> 
                            <button onclick="excluirContato(${contato.id})">Excluir</button> 
                        </td>`;

        tbody.appendChild(tr);
    });

    atualizarTotalContatos(contatos.length);
}

function atualizarTotalContatos(total) {
    document.getElementById('totalContatos').textContent = `Total de Contatos: ${total}`;
}

function editarContato(id) {
    const contatos = obterContatos();
    const contato = contatos.find(c => c.id === id);

    if(contato) {
        document.getElementById('nome').value = contato.nome;
        document.getElementById('email').value = contato.email;
        document.getElementById('telefone').value = contato.telefone;

        excluirContato(id);
    }
}

function excluirContato(id) {
    let contatos = obterContatos();
    contatos = contatos.filter(contato => contato.id !== id);
    salvarContatos(contatos);
    renderizarContatos();
}

function filtrarContatos() {
    const filtro = document.getElementById('filtro').value.toLowerCase();
    const contatos = obterContatos();
    const filtrados = contatos.filter(contato => 
        contato.nome.toLowerCase().includes(filtro) ||
        contato.email.toLowerCase().includes(filtro) ||
        contato.telefone.includes(filtro)
    );
    renderizarContatos(filtrados);
}