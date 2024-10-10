function mostrarPagina(pagina) {
    const secao = document.getElementById('conteudo');
    let conteudo = '';
    switch (pagina) {
        case 'inicio':
            conteudo = `
            <h2>Início</h2>
                <p>Bem-vindo ao meu currículo profissional! Sou um desenvolvedor
                Web Full Stack, com experiência em projetos de desenvolvimento 
                Web.</p>
                <p>Estou sempre em busca de novs desafios e oportunidades para
                aprender e crescer profissionalmente.</p>
            `;
            break;

        case 'experiencia':

        conteudo = `
            <h2>Experiência profissional</h2>
                <h3>Desenvolvedor Web Full Stack</h3>
                    <p>Empresa XYZ - 2018 até o presente</p>
                    <ul>
                        <li>Desenvolvimento e manutenção de sistemas Web utilizando tecnologicas como HTML, CSS, JavaScript, Node.js e MongoDB.</li>
                        <li>Colaboração em equipe para o desenvolvimento de novos recursos e funcionalidades.</li>
                        <li>Participação em reuniões de planejamento e revisão de código.</li>
                    </ul>
        `;
        break;

        case 'educacao':

            conteudo = `
                <h2>Educação</h2>
                <h3>Bacharelado em Ciência da Computação</h3>
                <p>Universidade ABC - Conclusão em 2017</p>
                    <ul>
                        <li>Principais disciplinas: Programação, Algoritmos e Estrutura de Dados, Banco de Dados, Redes de Computadores.</li>
                        <li>Participação em projeots de pesquisa e extensão relacionados à area de desenvolvimento de software.</li>
                    </ul>
            `;
            break;

        case 'habilidades':

        conteudo = `
            <h2>Habilidades</h2>
                <ul>
                    <li>HTML5, CSS3, JavaScript</li>
                    <li>Node.js, Express.js</li>
                    <li>React, Vue.js</li>
                    <li>MongoDB, MySQL</li>
                    <li>Git, GitHub</li>
                    <li>Metodologias Ágeis (Scrum, Kanban)</li>
                </ul>
        `;
        break;

        default:

        conteudo = `<h2>Página não encontrada</h2><p>A página solicitada não existe ou não foi encontrada.</p>
        `;
        break;
    }
    secao.innerHTML = conteudo;
}

mostrarPagina('inicio');