const cardContainer = document.querySelector('.card-container');
const inputBusca = document.querySelector('header div input');
const filtroTipo = document.getElementById('filtro-tipo');
let dados = [];

// Função para renderizar os cards na tela
function renderizarCards(cardsParaRenderizar) {
    // Limpa o container antes de adicionar novos cards para evitar duplicatas
    cardContainer.innerHTML = '';

    if (cardsParaRenderizar.length === 0) {
        cardContainer.innerHTML = '<p class="nenhum-resultado">Nenhum resultado encontrado.</p>';
        return;
    }

    for (const item of cardsParaRenderizar) {
        const article = document.createElement('article');
        article.classList.add('card');

        // Cria a lista de usos a partir do array
        const usosHtml = `<ul>${item.usos.map(uso => `<li>${uso}</li>`).join('')}</ul>`;

        article.innerHTML = `
            <h2>${item.nome}</h2>
            <p>${item.descricao}</p>
            <p><strong>Usos comuns:</strong></p>
            ${usosHtml}
            <a href="${item.link}" target="_blank">Leia mais</a>`;

        cardContainer.appendChild(article);
    }
}

// Função para filtrar os dados com base no termo de busca
function aplicarFiltros() {
    const termoBusca = inputBusca.value.toLowerCase();
    const tipoSelecionado = filtroTipo.value;

    let dadosFiltrados = dados;

    // 1. Filtra por tipo
    if (tipoSelecionado !== 'todos') {
        dadosFiltrados = dadosFiltrados.filter(item => item.tipo === tipoSelecionado);
    }

    // 2. Filtra pelo termo de busca (no resultado do filtro anterior)
    if (termoBusca) {
        dadosFiltrados = dadosFiltrados.filter(item =>
            item.nome.toLowerCase().includes(termoBusca) ||
            item.descricao.toLowerCase().includes(termoBusca) ||
            item.usos.some(uso => uso.toLowerCase().includes(termoBusca))
        );
    }

    renderizarCards(dadosFiltrados);
}

// Popula o dropdown de filtro com os tipos únicos do JSON
function popularFiltroTipo() {
    const tipos = new Set(dados.map(item => item.tipo)); // Usa Set para pegar valores únicos
    for (const tipo of tipos) {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        filtroTipo.appendChild(option);
    }
}

// Carrega os dados do JSON e exibe todos os cards inicialmente
async function carregarDadosIniciais() {
    const resposta = await fetch('data.json');
    dados = await resposta.json();
    popularFiltroTipo();
    renderizarCards(dados);
}

// Adiciona os event listeners para a busca
document.getElementById('botao-busca').addEventListener('click', aplicarFiltros);
filtroTipo.addEventListener('change', aplicarFiltros);
inputBusca.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        aplicarFiltros();
    }
});

// Inicia o carregamento dos dados assim que a página é carregada
document.addEventListener('DOMContentLoaded', carregarDadosIniciais);