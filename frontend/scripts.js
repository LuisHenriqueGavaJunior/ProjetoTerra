document.addEventListener("DOMContentLoaded", carregarCulturas);

function carregarCulturas() {
    fetch('http://localhost:3000/culturas')
        .then(response => response.json())
        .then(culturas => {
            const dropdown = document.getElementById('culturaAnterior');
            culturas.forEach(cultura => {
                const option = document.createElement('option');
                option.value = cultura.id;
                option.textContent = cultura.nome;
                dropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar culturas:', error);
        });
}

function buscarSugestoes() {
  const culturaId = document.getElementById('culturaAnterior').value;
  if (!culturaId) {
      alert("Por favor, selecione uma cultura.");
      return;
  }

  const url = `http://localhost:3000/recomendacao/${culturaId}`;
  
  fetch(url)
      .then(response => response.json())
      .then(data => {
          const sugestoesDiv = document.getElementById('sugestoes');
          sugestoesDiv.innerHTML = ''; 
          
          if (data.length === 0) {
              sugestoesDiv.innerHTML = '<p>Nenhuma sugestão encontrada.</p>';
          } else {
              data.forEach(sugestao => {
                  const card = document.createElement('div');
                  card.classList.add('sugestao-card');

                  card.innerHTML = `
                      <h3 class="sugestao-title">${sugestao.cultura_recomendada}</h3>
                      <p class="sugestao-motivo">${sugestao.motivo}</p>
                  `;

                  sugestoesDiv.appendChild(card);
              });
          }
      })
      .catch(error => {
          console.error('Erro ao buscar sugestões:', error);
          sugestoesDiv.innerHTML = "<p>Erro ao buscar sugestões.</p>";
      });
}



const modal = document.getElementById("myModal");
const modalText = document.getElementById("modal-text");
const closeModal = document.getElementsByClassName("close")[0];

function openModal(culturaId) {
  fetch(`http://localhost:3000/dicas/${culturaId}`)
      .then(response => response.json())
      .then(data => {
          if (data.length > 0) {
              const culturaInfo = data[0]; 
              let pragasInfo = new Set();  
              let solosInfo = new Set();

              data.forEach(item => {
                  if (item.praga_nome) {
                      pragasInfo.add(`<p><strong>Praga: ${item.praga_nome}</strong> <br>
                      -Período de ataque: ${item.periodo_ataque}<br> 
                      -Alimentação: ${item.alimentacao}</p>`);
                  }
                  if (item.solo_tipo) {
                      solosInfo.add(`<p><strong>Solo:</strong> ${item.solo_tipo}: ${item.solo_recomendacao}</p>`);
                  }
              });

              modalText.innerHTML = `
                  <h2>${culturaInfo.cultura_nome}</h2>
                  ${Array.from(pragasInfo).join('') || '<p>Nenhuma praga associada.</p>'}
                  <p><strong>Tipo de Fertilizante:</strong> ${culturaInfo.tipo_fertilizante}</p>
                  <p><strong>Frequência de Adubação:</strong> ${culturaInfo.adubacao_frequencia}</p>
                  <p><strong>Matéria Orgânica:</strong> ${culturaInfo.materia_organica}</p>

                  ${Array.from(solosInfo).join('') || '<p>Nenhum tipo de solo recomendado.</p>'}
                  <p><strong>Clima Ideal:</strong> <br>
                  -Temperatura: ${culturaInfo.temperatura} <br>
                  -Umidade: ${culturaInfo.umidade} <br>
                  -Chuvas: ${culturaInfo.chuvas}</p>
              `;
          } else {
              modalText.innerHTML = "<p>Nenhuma informação disponível.</p>";
          }

          modal.style.display = "flex";
      })
      .catch(error => {
          console.error('Erro ao carregar informações:', error);
          modalText.innerHTML = "<p>Erro ao carregar informações.</p>";
      });
}


closeModal.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.querySelectorAll('.card').forEach(button => {
    button.onclick = function() {
        const culturaId = button.getAttribute('data-cultura-id');
        openModal(culturaId);
    };
});