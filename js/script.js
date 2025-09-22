document.addEventListener("DOMContentLoaded", () => {
  // Seleciona elementos principais da página
  const questoes = document.querySelectorAll(".questao");
  const valorPontuacao = document.getElementById("valor-pontuacao");
  const botaoReiniciar = document.getElementById("reiniciar");
  const botaoTema = document.getElementById("alternar-tema");
  const btnMenu = document.getElementById("btn-menu");
  const menu = document.getElementById("menu");

  // Recupera progresso salvo no navegador (localStorage)
  let progresso = JSON.parse(localStorage.getItem("progressoQuiz")) || {};
  let pontuacao = progresso.pontuacao || 0;

  // Mostra a pontuação atualizada
  if (valorPontuacao) valorPontuacao.textContent = pontuacao;

  // Mantém o tema escuro ativo caso já tenha sido escolhido
  if (localStorage.getItem("tema") === "escuro") {
    document.body.classList.add("escuro");
  }

  // Botão para alternar tema
  if (botaoTema) {
    botaoTema.addEventListener("click", () => {
      document.body.classList.toggle("escuro");

      if (document.body.classList.contains("escuro")) {
        localStorage.setItem("tema", "escuro");
        botaoTema.textContent = "☀️ Alternar Tema";
      } else {
        localStorage.setItem("tema", "claro");
        botaoTema.textContent = "🌙 Alternar Tema";
      }
    });

    // Ajusta o texto inicial do botão
    botaoTema.textContent = document.body.classList.contains("escuro")
      ? "☀️ Alternar Tema"
      : "🌙 Alternar Tema";
  }

  // ----- Lógica das questões do quiz -----
  questoes.forEach(questao => {
    const id = questao.dataset.id;
    const feedback = questao.querySelector(".feedback");
    let tentativas = progresso[id]?.tentativas ?? 3;
    let concluida = progresso[id]?.concluida ?? false;

    if (concluida && feedback) {
      feedback.textContent = progresso[id].mensagem;
      questao.querySelectorAll("button, select, .verificar").forEach(el => el.disabled = true);
    }

    // Questões de múltipla escolha
    questao.querySelectorAll("button").forEach(botao => {
      botao.addEventListener("click", () => {
        if (tentativas > 0 && !concluida) {
          if (botao.dataset.resposta === "1") {
            feedback.textContent = "Correto!";
            concluida = true;
            botao.style.background = "var(--destaque)";
            questao.querySelectorAll("button").forEach(el => el.disabled = true);
            pontuacao++;
          } else {
            tentativas--;
            feedback.textContent = tentativas > 0 ? "Tente novamente!" : "Incorreto. Resposta correta já exibida.";
            if (tentativas === 0) questao.querySelectorAll("button").forEach(el => el.disabled = true);
          }

          progresso[id] = { tentativas, concluida, mensagem: feedback.textContent };
          progresso.pontuacao = pontuacao;
          localStorage.setItem("progressoQuiz", JSON.stringify(progresso));
          if (valorPontuacao) valorPontuacao.textContent = pontuacao;
        }
      });
    });

    // Questões com select + botão "verificar"
    const botaoVerificar = questao.querySelector(".verificar");
    if (botaoVerificar) {
      botaoVerificar.addEventListener("click", () => {
        const seletor = questao.querySelector("select");
        if (tentativas > 0 && !concluida && seletor) {
          if (seletor.value === "certo") {
            feedback.textContent = "Correto!";
            concluida = true;
            seletor.disabled = true;
            botaoVerificar.disabled = true;
            pontuacao++;
          } else {
            tentativas--;
            feedback.textContent = tentativas > 0 ? "Tente novamente!" : "Incorreto. Resposta: No painel do provedor.";
            if (tentativas === 0) {
              seletor.disabled = true;
              botaoVerificar.disabled = true;
            }
          }

          progresso[id] = { tentativas, concluida, mensagem: feedback.textContent };
          progresso.pontuacao = pontuacao;
          localStorage.setItem("progressoQuiz", JSON.stringify(progresso));
          if (valorPontuacao) valorPontuacao.textContent = pontuacao;
        }
      });
    }
  });

  // Botão para reiniciar o quiz
  if (botaoReiniciar) {
    botaoReiniciar.addEventListener("click", () => {
      localStorage.removeItem("progressoQuiz");
      window.location.reload();
    });
  }

  // Menu sanduíche
  if (btnMenu && menu) {
    btnMenu.addEventListener("click", () => {
      menu.classList.toggle("show");
    });
  }
});