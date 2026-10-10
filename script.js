// Inicializa os ícones do Lucide
lucide.createIcons();

// Timer do Shot Clock
let shotTime = 24.0;
const shotClockEl = document.getElementById('shotClock');
setInterval(() => {
  shotTime -= 0.1;
  if (shotTime <= 0) shotTime = 24.0;
  if (shotClockEl) {
    shotClockEl.textContent = shotTime.toFixed(1) + 's';
  }
}, 100);

function syncFromRange(type, val) {
  if (type === 'height') {
    document.getElementById('heightInput').value = val;
    document.getElementById('heightDisplay').textContent = val;
    document.getElementById('heightMeters').textContent = (val / 100).toFixed(2);
  } else {
    document.getElementById('weightInput').value = val;
    document.getElementById('weightDisplay').textContent = val;
    document.getElementById('weightLbs').textContent = (val * 2.20462).toFixed(1);
  }
  runCalculationLive();
}

function syncFromInput(type, val) {
  if (type === 'height') {
    const parsed = Math.max(100, Math.min(250, Number(val) || 178));
    document.getElementById('heightRange').value = parsed;
    document.getElementById('heightDisplay').textContent = parsed;
    document.getElementById('heightMeters').textContent = (parsed / 100).toFixed(2);
  } else {
    const parsed = Math.max(30, Math.min(250, Number(val) || 70));
    document.getElementById('weightRange').value = parsed;
    document.getElementById('weightDisplay').textContent = parsed;
    document.getElementById('weightLbs').textContent = (parsed * 2.20462).toFixed(1);
  }
  runCalculationLive();
}

function calculateIMC(e) {
  if (e) e.preventDefault();
  runCalculationLive();
}

function runCalculationLive() {
  const heightCm = parseFloat(document.getElementById('heightInput').value) || 178;
  const weightKg = parseFloat(document.getElementById('weightInput').value) || 74.5;

  const heightM = heightCm / 100;
  const imc = weightKg / (heightM * heightM);
  const roundedIMC = imc.toFixed(1);

  document.getElementById('imcScore').textContent = roundedIMC;

  const minIdeal = (18.5 * (heightM * heightM)).toFixed(1);
  const maxIdeal = (24.9 * (heightM * heightM)).toFixed(1);
  document.getElementById('idealWeightRange').textContent = `${minIdeal} - ${maxIdeal} kg`;

  const statusTitle = document.getElementById('statusTitle');
  const statusSubtitle = document.getElementById('statusSubtitle');
  const statusDesc = document.getElementById('statusDescription');
  const courtIndicator = document.getElementById('courtIndicator');
  
  const tipAgility = document.getElementById('tipAgility');
  const tipStrength = document.getElementById('tipStrength');
  const tipNutrition = document.getElementById('tipNutrition');

  const minScale = 15;
  const maxScale = 40;
  let percentage = ((imc - minScale) / (maxScale - minScale)) * 100;
  percentage = Math.max(2, Math.min(98, percentage));
  courtIndicator.style.left = `${percentage}%`;

  if (imc < 18.5) {
    statusTitle.textContent = "ARMADOR ÁGIL / FORA DO GARRAFÃO";
    statusTitle.className = "font-athletic text-3xl sm:text-4xl text-cyan-400 tracking-wide leading-tight mb-1 drop-shadow";
    statusSubtitle.textContent = "ABAIXO DO PESO • FOCO EM GANHO DE MASSA MAGRA";
    statusDesc.textContent = "Velocidade impressionante em quadra, mas você precisa de mais massa muscular para aguentar o contato físico nos bloqueios e disputas sob a tabela.";
    
    tipAgility.textContent = "Mantenha a agilidade com treinos de drible e footwork veloz, sem exagerar em aeróbicos longos.";
    tipStrength.textContent = "Hipertrofia prioritária: treinos de força pesados (supino, agachamento, terra) com cargas progressivas.";
    tipNutrition.textContent = "Superávit calórico limpo: aumente carboidratos complexos, pastas de oleaginosas e 2g/kg de proteína diária.";
  } 
  else if (imc >= 18.5 && imc < 25.0) {
    statusTitle.textContent = "TITULAR / ALL-STAR (EM FORMA!)";
    statusTitle.className = "font-athletic text-3xl sm:text-4xl text-emerald-400 tracking-wide leading-tight mb-1 drop-shadow";
    statusSubtitle.textContent = "PESO NORMAL • FÍSICO DE ELITE NA TEMPORADA";
    statusDesc.textContent = "Equilíbrio perfeito de potência aeróbica, potência de salto e resistência muscular. Você está no auge da temporada regular!";
    
    tipAgility.textContent = "Treinos de agilidade com escada de coordenação e saltos de caixa para aprimorar impulsão vertical.";
    tipStrength.textContent = "Manutenção de potência atlética: movimentos olímpicos, calistenia e fortalecimento do core.";
    tipNutrition.textContent = "Dieta de alto rendimento: micronutrientes, hidratação ativa e refeições equilibradas pré e pós-jogo.";
  } 
  else if (imc >= 25.0 && imc < 30.0) {
    statusTitle.textContent = "ALA-PIVÔ ROBUSTO";
    statusTitle.className = "font-athletic text-3xl sm:text-4xl text-amber-400 tracking-wide leading-tight mb-1 drop-shadow";
    statusSubtitle.textContent = "SOBREPESO • GRANDE FORÇA, MAS EXIGE REFINAMENTO";
    statusDesc.textContent = "Excelente presença física para cavar faltas e lutar por rebotes, mas uma leve redução de gordura aumentará sua velocidade de transição e protegerá seus joelhos.";
    
    tipAgility.textContent = "Treinos aeróbicos de baixo impacto: natação, bike ergométrica e circuitos funcionais para queimar calorias.";
    tipStrength.textContent = "Circuitos com repetições moderadas e menor tempo de descanso para elevar o gasto metabólico basal.";
    tipNutrition.textContent = "Leve déficit calórico: priorize vegetais fibrosos, reduza ultraprocessados e controle bebidas açucaradas.";
  } 
  else {
    statusTitle.textContent = "PIVÔ DE IMPACTO / FOCO NO TREINAMENTO";
    statusTitle.className = "font-athletic text-3xl sm:text-4xl text-red-400 tracking-wide leading-tight mb-1 drop-shadow";
    statusSubtitle.textContent = "OBESIDADE • TEMPO TÉCNICO PARA REFORMULAR A ROTINA";
    statusDesc.textContent = "Muita massa corporal para batalhar na tinta, porém o excesso sobrecarrega articulações (joelhos e tornozelos). Hora de montar um plano tático com especialistas!";
    
    tipAgility.textContent = "Caminhadas aceleradas e hidroginástica; evite saltos de alto impacto repetitivos por enquanto.";
    tipStrength.textContent = "Musculação controlada para preservação de massa magra e ativação do metabolismo sem estresse articular.";
    tipNutrition.textContent = "Acompanhamento nutricional individualizado focado em déficit sustentável e reeducação alimentar constante.";
  }
}

function shareStats() {
  const imc = document.getElementById('imcScore').textContent;
  const title = document.getElementById('statusTitle').textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(`🏀 Dunk IMC Stats: Meu IMC é ${imc} (${title})! Veja sua posição em quadra no Championship Body Check.`);
    alert("Estatísticas copiadas para a área de transferência!");
  }
}

// Inicialização imediata ao carregar a página
runCalculationLive();   