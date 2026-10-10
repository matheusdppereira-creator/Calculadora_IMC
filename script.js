document.addEventListener('DOMContentLoaded', () => {
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const weightLabel = document.getElementById('weight-label');
    const heightLabel = document.getElementById('height-label');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result-container');
    const imcValueDiv = document.getElementById('imc-value');
    const imcClassificationDiv = document.getElementById('imc-classification');
    const scaleIndicator = document.getElementById('scale-indicator');
    const weightReferenceDiv = document.getElementById('weight-reference');
    const educationalInfoDiv = document.getElementById('educational-info');
    const ageGuidelinesDiv = document.getElementById('age-guidelines');
    const ageGroupSelect = document.getElementById('age-group');
    const unitRadios = document.querySelectorAll('input[name="unit"]');
    const themeToggle = document.getElementById('theme-toggle');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    const printBtn = document.getElementById('print-btn');
    const shareBtn = document.getElementById('share-btn');

    let currentUnit = 'metric';

    // Gerenciamento de Tema (Modo Escuro / Claro)
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
        }
    });

    // Alternância de Unidades (Métrico vs Imperial)
    unitRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentUnit = e.target.value;
            if (currentUnit === 'imperial') {
                weightLabel.textContent = 'Peso (lbs):';
                heightLabel.textContent = 'Altura (polegadas):';
                weightInput.placeholder = 'Ex: 155';
                heightInput.placeholder = 'Ex: 69';
            } else {
                weightLabel.textContent = 'Peso (kg):';
                heightLabel.textContent = 'Altura (metros):';
                weightInput.placeholder = 'Ex: 70.5';
                heightInput.placeholder = 'Ex: 1.75';
            }
        });
    });

    // Carregar Histórico Salvo no LocalStorage
    loadHistory();

    calculateBtn.addEventListener('click', () => {
        let weight = parseFloat(weightInput.value);
        let height = parseFloat(heightInput.value);
        const ageGroup = ageGroupSelect.value;

        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            alert('Por favor, insira valores válidos.');
            return;
        }

        let imc = 0;
        let heightInMetersForRef = 0;

        // Conversão de unidades para o cálculo padrão (Métrico)
        if (currentUnit === 'imperial') {
            // Fórmula imperial: IMC = (Peso em lbs / (Altura em polegadas)²) * 703
            imc = (weight / (height * height)) * 703;
            heightInMetersForRef = height * 0.0254; // polegadas para metros
        } else {
            imc = weight / (height * height);
            heightInMetersForRef = height;
        }

        // Classificação e Limites (OMS)
        let classification = '';
        let color = '';
        let indicatorPercent = 0;

        if (imc < 18.5) {
            classification = 'Abaixo do peso';
            color = '#3182ce';
            indicatorPercent = Math.max(5, (imc / 18.5) * 20);
        } else if (imc >= 18.5 && imc < 25) {
            classification = 'Peso normal (Eutrofia)';
            color = '#38a169';
            indicatorPercent = 20 + ((imc - 18.5) / 6.5) * 25;
        } else if (imc >= 25 && imc < 30) {
            classification = 'Sobrepeso';
            color = '#d69e2e';
            indicatorPercent = 45 + ((imc - 25) / 5) * 25;
        } else if (imc >= 30 && imc < 40) {
            classification = 'Obesidade';
            color = '#e53e3e';
            indicatorPercent = 70 + ((imc - 30) / 10) * 25;
        } else {
            classification = 'Obesidade Grave';
            color = '#9b2c2c';
            indicatorPercent = 95;
        }

        imcValueDiv.textContent = `Seu IMC: ${imc.toFixed(2)}`;
        imcClassificationDiv.textContent = `Classificação: ${classification}`;
        imcClassificationDiv.style.color = color;
        scaleIndicator.style.left = `${indicatorPercent}%`;

        // Cálculo de Faixa de Peso de Referência (IMC 18.5 a 24.9)
        const minIdealWeight = (18.5 * (heightInMetersForRef * heightInMetersForRef));
        const maxIdealWeight = (24.9 * (heightInMetersForRef * heightInMetersForRef));
        
        let weightUnitLabel = currentUnit === 'imperial' ? 'lbs' : 'kg';
        let displayMin = currentUnit === 'imperial' ? (minIdealWeight * 2.20462).toFixed(1) : minIdealWeight.toFixed(1);
        let displayMax = currentUnit === 'imperial' ? (maxIdealWeight * 2.20462).toFixed(1) : maxIdealWeight.toFixed(1);

        weightReferenceDiv.innerHTML = `📌 <strong>Faixa de peso ideal (IMC 18.5 - 24.9):</strong> ${displayMin} ${weightUnitLabel} a ${displayMax} ${weightUnitLabel}`;

        // Orientações específicas por Idade
        let ageText = '';
        if (ageGroup === 'elderly') {
            ageText = '👴 <strong>Atenção (Idosos):</strong> Para maiores de 60 anos, faixas de IMC ligeiramente superiores (até 27) podem estar associadas a melhor longevidade, devendo ser avaliadas junto à composição muscular.';
        } else if (ageGroup === 'child') {
            ageText = '👶 <strong>Atenção (Crianças/Adolescentes):</strong> O IMC padrão de adultos não se aplica diretamente; o ideal é consultar curvas de crescimento específicas da caderneta de saúde.';
        } else {
            ageText = '🧑 <strong>Perfil Adulto:</strong> Diretrizes baseadas nos critérios padrão estabelecidos pela Organização Mundial da Saúde (OMS).';
        }
        ageGuidelinesDiv.innerHTML = ageText;

        educationalInfoDiv.innerHTML = `💡 <strong>O que significa?</strong> O IMC é calculado relacionando sua massa com sua altura ao quadrado. Valores fora da normalidade indicam maior propensão a riscos metabólicos, mas precisam de exames complementares (como bioimpedância ou exames de sangue).`;

        resultContainer.classList.remove('hidden');

        // Salvar no Histórico Local
        saveToHistory(imc.toFixed(2), classification);
    });

    function saveToHistory(imcVal, classVal) {
        let history = JSON.parse(localStorage.getItem('imc_history')) || [];
        const dateStr = new Date().toLocaleDateString('pt-BR');
        history.unshift({ date: dateStr, imc: imcVal, classification: classVal });
        if (history.length > 5) history.pop(); // Mantém os últimos 5
        localStorage.setItem('imc_history', JSON.stringify(history));
        loadHistory();
    }

    function loadHistory() {
        let history = JSON.parse(localStorage.getItem('imc_history')) || [];
        historyList.innerHTML = '';
        if (history.length > 0) {
            history.forEach(item => {
                const div = document.createElement('div');
                div.className = 'history-item';
                div.innerHTML = `<span>📅 ${item.date}</span> <strong>IMC: ${item.imc}</strong> <span>(${item.classification})</span>`;
                historyList.appendChild(div);
            });
            clearHistoryBtn.classList.remove('hidden');
        } else {
            historyList.innerHTML = '<span style="font-size: 0.8rem; color: var(--subtitle-color);">Nenhum cálculo recente salvo.</span>';
            clearHistoryBtn.classList.add('hidden');
        }
    }

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('imc_history');
        loadHistory();
    });

    // Impressão / Relatório
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // Compartilhamento
    shareBtn.addEventListener('click', () => {
        const text = `Meu IMC atual é ${imcValueDiv.textContent}. Calculado via Calculadora de IMC Avançada.`;
        if (navigator.share) {
            navigator.share({ title: 'Resultado IMC', text: text }).catch(() => {});
        } else {
            navigator.clipboard.writeText(text);
            alert('Resultado copiado para a área de transferência!');
        }
    });
});