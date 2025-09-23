document.addEventListener("DOMContentLoaded", () => {
  const questoes = document.querySelectorAll(".questao");
  const valorPontuacao = document.getElementById("valor-pontuacao");
  const botaoReiniciar = document.getElementById("reiniciar");
  const botaoTema = document.getElementById("alternar-tema");
  const btnMenu = document.getElementById("btn-menu");
  const menu = document.getElementById("menu");

  let progresso = JSON.parse(localStorage.getItem("progressoQuiz")) || {};
  let pontuacao = progresso.pontuacao || 0;
  if (valorPontuacao) valorPontuacao.textContent = pontuacao;

  if (localStorage.getItem("tema") === "escuro") document.body.classList.add("escuro");

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
    botaoTema.textContent = document.body.classList.contains("escuro")
      ? "☀️ Alternar Tema" : "🌙 Alternar Tema";
  }

  function marcarRespostaCorreta(questao) {
    const radiosCorretos = questao.querySelectorAll("input[type='radio'][value='1']");
    radiosCorretos.forEach(r => {
      const label = r.closest("label");
      if (label) label.classList.add("correta");
    });

    const corretasQ2 = ["HTML", "CSS", "JavaScript"];
    questao.querySelectorAll("input[type='checkbox']").forEach(cb => {
      const label = cb.closest("label");
      if (!label) return;
      if (corretasQ2.includes(cb.value)) label.classList.add("correta");
    });
  }

  function marcarSelecionadasErradas(questao, valoresSelecionados) {
    valoresSelecionados.forEach(v => {
      const input = questao.querySelector(`input[value="${v}"]`);
      if (input) {
        const label = input.closest("label");
        if (label && !label.classList.contains("correta")) label.classList.add("errada");
      }
    });
  }

  questoes.forEach(questao => {
    const id = questao.dataset.id;
    const feedback = questao.querySelector(".feedback");
    let tentativas = progresso[id]?.tentativas ?? 3;
    let concluida = progresso[id]?.concluida ?? false;
    let respostaEscolhida = progresso[id]?.respostaEscolhida ?? null;

    if (respostaEscolhida) {
      if (Array.isArray(respostaEscolhida)) {
        respostaEscolhida.forEach(v => {
          const input = questao.querySelector(`input[value="${v}"]`);
          if (input) input.checked = true;
        });
      } else {
        const input = questao.querySelector(`input[value="${respostaEscolhida}"]`);
        if (input) input.checked = true;
      }
    }

    if (concluida || tentativas === 0) {
      if (feedback) feedback.textContent = progresso[id]?.mensagem || "";
      marcarRespostaCorreta(questao);
      if (respostaEscolhida) {
        if (Array.isArray(respostaEscolhida)) {
          marcarSelecionadasErradas(questao, respostaEscolhida);
        } else {
          const sel = questao.querySelector(`input[value="${respostaEscolhida}"]`);
          if (sel) {
            const labelSel = sel.closest("label");
            if (labelSel && !labelSel.classList.contains("correta")) labelSel.classList.add("errada");
          }
        }
      }
      questao.querySelectorAll("input, select, button").forEach(el => el.disabled = true);
    }

    const botaoVerificar = questao.querySelector(".verificar");
    if (!botaoVerificar) return;

    botaoVerificar.addEventListener("click", () => {
      if (!(tentativas > 0 && !concluida)) return;

      // --- Q1: radio ---
      if (id === "q1") {
        const selecionado = questao.querySelector("input[type='radio']:checked");
        if (!selecionado) {
          if (feedback) feedback.textContent = "Selecione uma opção.";
          return;
        }

        respostaEscolhida = selecionado.value;

        if (selecionado.value === "1") {
          if (feedback) feedback.textContent = "Correto! HTML é uma linguagem de marcação.";
          concluida = true;
          const lab = selecionado.closest("label");
          if (lab) lab.classList.add("correta");
          pontuacao++;
        } else {
          tentativas--;
          if (feedback) feedback.textContent = tentativas > 0 ? "Tente novamente!" : "Incorreto. A resposta correta: Uma linguagem de marcação para estruturar páginas web.";
          const lab = selecionado.closest("label");
          if (lab) lab.classList.add("errada");
          if (tentativas === 0) marcarRespostaCorreta(questao);
        }

        if (concluida || tentativas === 0) {
          questao.querySelectorAll("input, button").forEach(el => el.disabled = true);
        }
      }

      // --- Q2: checkbox ---
      else if (id === "q2") {
        const selecionados = Array.from(questao.querySelectorAll("input[type='checkbox']:checked")).map(cb => cb.value);

        if (selecionados.length === 0) {
          if (feedback) feedback.textContent = "Selecione pelo menos uma opção.";
          return;
        }

        respostaEscolhida = selecionados.slice();

        const corretas = ["HTML", "CSS", "JavaScript"];
        const incorretas = selecionados.filter(v => !corretas.includes(v));
        const todasCorretasSelecionadas = corretas.every(c => selecionados.includes(c)) && selecionados.length === corretas.length;

        if (todasCorretasSelecionadas) {
          if (feedback) feedback.textContent = "Correto!";
          concluida = true;
          pontuacao++;
        } else {
          tentativas--;
          if (feedback) feedback.textContent = tentativas > 0 ? "Tente novamente!" : "Incorreto. As respostas certas são: HTML, CSS e JavaScript.";
          marcarSelecionadasErradas(questao, selecionados);
          if (tentativas === 0) marcarRespostaCorreta(questao);
        }

        if (concluida || tentativas === 0) {
          questao.querySelectorAll("input, button").forEach(el => el.disabled = true);
        }
      }

      // --- Q3: select ---
      else if (id === "q3") {
        const seletor = questao.querySelector("select");
        if (!seletor) return;

        if (seletor.value === "certo") {
          if (feedback) feedback.textContent = "Correto! CSS define o estilo visual e layout.";
          concluida = true;
          seletor.disabled = true;
          botaoVerificar.disabled = true;
          pontuacao++;
        } else {
          tentativas--;
          if (feedback) feedback.textContent = tentativas > 0 ? "Tente novamente!" : "Incorreto. Resposta correta: Definir o estilo visual e layout da página.";
          if (tentativas === 0) {
            seletor.disabled = true;
            botaoVerificar.disabled = true;
          }
        }
      }

      // Salva progresso
      progresso[id] = { tentativas, concluida, mensagem: feedback ? feedback.textContent : "", respostaEscolhida };
      progresso.pontuacao = pontuacao;
      localStorage.setItem("progressoQuiz", JSON.stringify(progresso));
      if (valorPontuacao) valorPontuacao.textContent = pontuacao;
    });
  });

  // Reiniciar
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