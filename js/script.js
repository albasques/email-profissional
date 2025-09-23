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
      questao.querySelectorAll("input, select, button").forEach(el => el.disabled = true);
    }

    const botaoVerificar = questao.querySelector(".verificar");

    // Questão 1 (radio)
    if (id === "q1" && botaoVerificar) {
      botaoVerificar.addEventListener("click", () => {
        if (tentativas > 0 && !concluida) {
          const selecionado = questao.querySelector("input[type='radio']:checked");
          if (!selecionado) {
            feedback.textContent = "Selecione uma opção.";
            return;
          }

          if (selecionado.value === "1") {
            feedback.textContent = "Correto!";
            concluida = true;
            pontuacao++;
          } else {
            tentativas--;
            feedback.textContent = tentativas > 0 ? "Tente novamente!" : "Incorreto. A resposta era: Transmitir credibilidade e profissionalismo.";
          }

          if (concluida || tentativas === 0) {
            questao.querySelectorAll("input, button").forEach(el => el.disabled = true);
          }

          progresso[id] = { tentativas, concluida, mensagem: feedback.textContent };
          progresso.pontuacao = pontuacao;
          localStorage.setItem("progressoQuiz", JSON.stringify(progresso));
          valorPontuacao.textContent = pontuacao;
        }
      });
    }

    // Questão 2 (checkbox múltipla resposta correta)
    if (id === "q2" && botaoVerificar) {
      botaoVerificar.addEventListener("click", () => {
        if (tentativas > 0 && !concluida) {
          const selecionados = Array.from(questao.querySelectorAll("input[type='checkbox']:checked")).map(cb => cb.value);

          if (selecionados.length === 0) {
            feedback.textContent = "Selecione pelo menos uma opção.";
            return;
          }

          // Respostas corretas
          const corretas = ["SPF", "DKIM"];
          const incorretas = selecionados.filter(v => !corretas.includes(v));

          if (incorretas.length === 0 && selecionados.length === corretas.length) {
            feedback.textContent = "Correto!";
            concluida = true;
            pontuacao++;
          } else {
            tentativas--;
            feedback.textContent = tentativas > 0 
              ? "Tente novamente!" 
              : "Incorreto. As respostas certas são: SPF e DKIM.";
          }

          if (concluida || tentativas === 0) {
            questao.querySelectorAll("input, button").forEach(el => el.disabled = true);
          }

          progresso[id] = { tentativas, concluida, mensagem: feedback.textContent };
          progresso.pontuacao = pontuacao;
          localStorage.setItem("progressoQuiz", JSON.stringify(progresso));
          valorPontuacao.textContent = pontuacao;
        }
      });
    }

    // Questão 3 (select já estava ok)
    if (id === "q3" && botaoVerificar) {
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
          valorPontuacao.textContent = pontuacao;
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