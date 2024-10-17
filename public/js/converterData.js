
function converterData(data_user) {

    // Se o timestamp estiver em segundos, converta para milissegundos
  const timestampEmMilissegundos = (data_user.seconds || data_user) * 1000;
  
  // Crie um objeto Date a partir dos milissegundos
  const data = new Date(timestampEmMilissegundos);
  
  // Extraia o dia, mês e ano
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa do 0
  const ano = data.getFullYear();
  
  // Formate a data como DD-MM-YYYY
  return `${dia}-${mes}-${ano}`;
  }

  
