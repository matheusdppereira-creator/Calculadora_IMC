// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    
    // Selecionando os elementos do HTML
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultContainer = document.getElementById('result-container');
    const imcValueDiv = document.getElementById('imc-value');
    const imcClassificationDiv = document.getElementById('imc-classification');

    // Adicionando o evento de clique ao botão de cálculo
    calculateBtn.addEventListener('click', () => {
        // Obtendo e convertendo os valores inseridos para números decimais
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value);

        // Validação básica dos campos
        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            alert('Por favor, insira valores válidos para peso e altura!');
            return;
        }

        // Cálculo do IMC: Peso dividido pela altura ao quadrado
        const imc = weight / (height * height);

        // Classificação do IMC baseada nos padrões da OMS
        let classification = '';
        let colorClass = '';

        if (imc < 18.5) {
            classification = 'Abaixo do peso';
            colorClass = '#d69e2e'; // Amarelo/Laranja
        } else if (imc >= 18.5 && imc < 25) {
            classification = 'Peso normal (Eutrofia)';
            colorClass = '#38a169'; // Verde
        } else if (imc >= 25 && imc < 30) {
            classification = 'Sobrepeso';
            colorClass = '#dd6b20'; // Laranja forte
        } else if (imc >= 30 && imc < 35) {
            classification = 'Obesidade Grau I';
            colorClass = '#e53e3e'; // Vermelho claro
        } else if (imc >= 35 && imc < 40) {
            classification = 'Obesidade Grau II';
            colorClass = '#c53030'; // Vermelho escuro
        } else {
            classification = 'Obesidade Grau III (Mórbida)';
            colorClass = '#9b2c2c'; // Vinho
        }

        // Exibindo o resultado na tela
        imcValueDiv.textContent = `Seu IMC: ${imc.toFixed(2)}`;
        imcClassificationDiv.textContent = `Classificação: ${classification}`;
        imcClassificationDiv.style.color = colorClass;

        // Revela o container de resultados removendo a classe 'hidden'
        resultContainer.classList.remove('hidden');
    });

});