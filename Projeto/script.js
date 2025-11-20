let dados = [];

async function buscarDados() {
    let resposta = await fetch('data.json');
    dados = await resposta.json();
    console.log(dados);
}