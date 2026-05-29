// Estado inicial do simulador
let saudeSolo = 100;
let riscoPragas = 0;
let gastosInsumos = 0;
let historicoCulturas = [];

function simular(cultura) {
    // Adiciona ao histórico do produtor
    historicoCulturas.push(cultura);
    
    // Verifica se houve repetição prejudicial (Monocultura)
    const ultimasDuas = historicoCulturas.slice(-2);
    const ehMonocultura = ultimasDuas.length === 2 && ultimasDuas[0] === ultimasDuas[1];

    if (ehMonocultura) {
        // Impactos negativos da monocultura
        saudeSolo -= 25;
        riscoPragas += 30;
        gastosInsumos += 800; // Aumenta custo com fertilizantes e venenos
    } else {
        // Benefícios da rotação planejada
        if (cultura === 'pastagem') {
            saudeSolo += 20;
            riscoPragas -= 15;
            gastosInsumos += 200;
        } else if (cultura === 'milho') {
            saudeSolo += 5;
            riscoPragas -= 5;
            gastosInsumos += 400;
        } else if (cultura === 'soja') {
            // Soja fixa nitrogênio, mas se feita de forma errada atrai pragas
            saudeSolo += 10;
            riscoPragas += 10;
            gastosInsumos += 300;
        }
    }

    // Mantém os limites entre 0 e 100
    saudeSolo = Math.max(0, Math.min(100, saudeSolo));
    riscoPragas = Math.max(0, Math.min(100, riscoPragas));

    atualizarInterface(ehMonocultura, cultura);
}

function atualizarInterface(ehMonocultura, ultimaCultura) {
    // Atualiza textos na tela
    document.getElementById('txt-saude').innerText = saudeSolo;
    document.getElementById('txt-pragas').innerText = riscoPragas;
    document.getElementById('txt-gastos').innerText = gastosInsumos;
    
    // Atualiza a linha visual do histórico
    const nomesFormatados = historicoCulturas.map(c => c.toUpperCase());
    document.getElementById('lista-historico').innerText = nomesFormatados.join(' ➡️ ');

    // Atualiza barras de progresso visuais e suas cores
    ajustarBarra('barra-saude', saudeSolo, true);
    ajustarBarra('barra-pragas', riscoPragas, false);

    // Altera a caixa de dicas com base no comportamento do usuário
    const painelFeedback = document.getElementById('alerta-feedback');
    
    if (saudeSolo <= 40) {
        painelFeedback.className = "feedback perigo";
        painelFeedback.innerHTML = "🚨 <strong>Solo esgotado!</strong> A monocultura severa degradou a terra. É urgente plantar Pastagem ou cobertura vegetal para recuperar a matéria orgânica.";
    } else if (ehMonocultura) {
        painelFeedback.className = "feedback alerta";
        painelFeedback.innerHTML = "⚠️ <strong>Alerta de Monocultura!</strong> Repetir o cultivo de " + ultimaCultura + " quebrou o equilíbrio natural. Pragas estão se multiplicando e os custos de produção subiram.";
    } else {
        painelFeedback.className = "feedback sucesso";
        painelFeedback.innerHTML = "💚 <strong>Excelente manejo!</strong> Você utilizou a rotação de culturas. Isso quebra o ciclo de pragas e repõe os nutrientes de maneira sustentável.";
    }
}

function ajustarBarra(id, valor, invertido) {
    const barra = document.getElementById(id);
    barra.style.width = valor + '%';
    
    // Define se verde é bom ou ruim dependendo do indicador
    if (invertido) { // Para saúde do solo (Alto = Bom)
        if (valor > 70) { barra.className = "progresso verde"; }
        else if (valor > 40) { barra.className = "progresso amarelo"; }
        else { barra.className = "progresso vermelho"; }
    } else { // Para risco de pragas (Baixo = Bom)
        if (valor < 30) { barra.className = "progresso verde"; }
        else if (valor < 60) { barra.className = "progresso amarelo"; }
        else { barra.className = "progresso vermelho"; }
    }
}

function resetarSimulador() {
    saudeSolo = 100;
    riscoPragas = 0;
    gastosInsumos = 0;
    historicoCulturas = [];
    
    document.getElementById('txt-saude').innerText = "100";
    document.getElementById('txt-pragas').innerText = "0";
    document.getElementById('txt-gastos').innerText = "0";
    document.getElementById('lista-historico').innerText = "Nenhuma plantação ainda";
    
    ajustarBarra('barra-saude', 100, true);
    ajustarBarra('barra-pragas', 0, false);
    
    const pf = document.getElementById('alerta-feedback');
    pf.className = "feedback info";
    pf.innerHTML = "<strong>Dica do Agrinho:</strong> Comece escolhendo a sua primeira cultura para entender como o manejo planejado protege a terra!";
}
