document.addEventListener("DOMContentLoaded", () => {
  // Seleciona elementos principais da página
  const questoes = document.querySelectorAll(".questao");
  const valorPontuacao = document.getElementById("valor-pontuacao");
  const botaoReiniciar = document.getElementById("reiniciar");
  const botaoTema = document.getElementById("alternar-tema");

  // Recupera progresso salvo no navegador (localStorage)
  let progresso = JSON.parse(localStorage.getItem("progressoQuiz")) || {};
  let pontuacao = progresso.pontuacao || 0;

  // Mostra a pontuação atualizada, se o elemento existir
  if (valorPontuacao) valorPontuacao.textContent = pontuacao;

  // Mantém o tema escuro ativo caso já tenha sido escolhido
  if (localStorage.getItem("tema") === "escuro") {
    document.body.classList.add("escuro");
  }

  // Função do botão para alternar o tema da página
  if (botaoTema) {
    botaoTema.addEventListener("click", () => {
      document.body.classList.toggle("escuro");

      // Salva no localStorage qual tema foi escolhido
      if (document.body.classList.contains("escuro")) {
        localStorage.setItem("tema", "escuro");
        botaoTema.textContent = "☀️ Alternar Tema"; // Mostra ícone de sol
      } else {
        localStorage.setItem("tema", "claro");
        botaoTema.textContent = "🌙 Alternar Tema"; // Mostra ícone de lua
      }
    });

    // Ajusta o texto inicial do botão conforme o tema já ativo
    botaoTema.textContent = document.body.classList.contains("escuro")
      ? "☀️ Alternar Tema"
      : "🌙 Alternar Tema";
  }

  // ----- Lógica das questões do quiz -----
  questoes.forEach(questao => {
    const id = questao.dataset.id; // Cada questão tem um ID único
    const feedback = questao.querySelector(".feedback");
    let tentativas = progresso[id]?.tentativas ?? 3; // 3 tentativas por padrão
    let concluida = progresso[id]?.concluida ?? false;

    // Se a questão já foi concluída antes, exibe a mensagem salva e bloqueia interações
    if (concluida) {
      feedback.textContent = progresso[id].mensagem;
      questao.querySelectorAll("button, select, .verificar").forEach(el => el.disabled = true);
    }

    // Eventos para botões de resposta (questões de múltipla escolha)
    questao.querySelectorAll("button").forEach(botao => {
      botao.addEventListener("click", () => {
        if (tentativas > 0 && !concluida) {
          if (botao.dataset.resposta === "1") {
            // Resposta correta
            feedback.textContent = "Correto!";
            concluida = true;
            botao.style.background = "var(--destaque)";
            questao.querySelectorAll("button").forEach(el => el.disabled = true);
            pontuacao++;
          } else {
            // Resposta incorreta
            tentativas--;
            feedback.textContent = tentativas > 0 ? "Tente novamente!" : "Incorreto. Resposta correta já exibida.";
            if (tentativas === 0) {
              questao.querySelectorAll("button").forEach(el => el.disabled = true);
            }
          }
          // Salva o estado da questão no localStorage
          progresso[id] = { tentativas, concluida, mensagem: feedback.textContent };
          progresso.pontuacao = pontuacao;
          localStorage.setItem("progressoQuiz", JSON.stringify(progresso));
          if (valorPontuacao) valorPontuacao.textContent = pontuacao;
        }
      });
    });

    // Evento para questões com select + botão "verificar"
    const botaoVerificar = questao.querySelector(".verificar");
    if (botaoVerificar) {
      botaoVerificar.addEventListener("click", () => {
        const seletor = questao.querySelector("select");
        if (tentativas > 0 && !concluida) {
          if (seletor.value === "certo") {
            // Resposta correta
            feedback.textContent = "Correto!";
            concluida = true;
            seletor.disabled = true;
            botaoVerificar.disabled = true;
            pontuacao++;
          } else {
            // Resposta errada
            tentativas--;
            feedback.textContent = tentativas > 0 ? "Tente novamente!" : "Incorreto. Resposta: No painel do provedor.";
            if (tentativas === 0) {
              seletor.disabled = true;
              botaoVerificar.disabled = true;
            }
          }
          // Atualiza progresso no localStorage
          progresso[id] = { tentativas, concluida, mensagem: feedback.textContent };
          progresso.pontuacao = pontuacao;
          localStorage.setItem("progressoQuiz", JSON.stringify(progresso));
          if (valorPontuacao) valorPontuacao.textContent = pontuacao;
        }
      });
    }
  });

  // Botão para reiniciar o quiz: apaga progresso salvo e recarrega a página
  if (botaoReiniciar) {
    botaoReiniciar.addEventListener("click", () => {
      localStorage.removeItem("progressoQuiz");
      window.location.reload();
    });
  }

  // Menu sanduíche
  const btnMenu = document.getElementById("btn-menu");
  const menu = document.getElementById("menu");

  btnMenu.addEventListener("click", () => {
    menu.classList.toggle("show");
  });

});