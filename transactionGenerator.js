// Função para gerar um número aleatório com a quantidade de dígitos especificada
function generateRandomNumber(digits) {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Função para gerar uma linha do CSV
function generateCSVLine() {
  const from = generateRandomNumber(13);
  const to = generateRandomNumber(13);
  const amount = Math.floor(Math.random() * (10000000 - 10 + 1)) + 100;
  return `${from};${to};${amount}`;
}

// Função principal para gerar e exibir linhas CSV
function displayCSVLines(linesCount) {
  console.log('from;to;amount');
  for (let i = 0; i < linesCount; i++) {
    console.log(generateCSVLine());
  }
}

// Obter o número de linhas a partir dos argumentos da linha de comando
const linesCount = process.argv[2] ? parseInt(process.argv[2], 10) : 100;

// Verifica se o número de linhas é um número válido
if (isNaN(linesCount)) {
  console.error(
    'Por favor, forneça um número válido de linhas como argumento.',
  );
  process.exit(1);
}

displayCSVLines(linesCount);
