# Como Configurar uma Conta de E-mail Profissional

**Repositório:** https://github.com/albasques/email-profissional  
**Demo Online:** https://albasques.github.io/email-profissional/

---

## Processo Criativo
O projeto foi pensado como um curso autoinstrucional, dividido em três partes principais:  
1. **Introdução** — breve apresentação do tema.  
2. **Guia** — explicação passo a passo para configurar um e-mail profissional.  
3. **Exercícios** — quiz interativo para fixar o conteúdo.  

O foco foi criar uma experiência simples e fluida, garantindo clareza, acessibilidade e responsividade, principalmente para dispositivos móveis.  
Além disso, adicionei micro-feedbacks visuais no quiz (mensagens de correto/incorreto), estimulando a interação ativa do usuário.

---

## Decisões Técnicas
- **HTML5 semântico** para melhorar acessibilidade e SEO.  
- **CSS com variáveis** para alternar entre tema claro e escuro.  
- **JavaScript Vanilla** para manipulação de DOM, quiz interativo, armazenamento em `localStorage` e integração com API externa.  
- **Deploy via GitHub Pages** por ser gratuito, rápido e prático.  

---

## Uso de IA
Foram utilizadas ferramentas de IA como apoio para:  
- Criar a estrutura inicial de HTML, CSS e JS.  
- Refatorar variáveis e organizar o código em português.  
- Sugerir boas práticas de responsividade e contraste.  

**Justificativa:** a IA foi usada como suporte, economizando tempo em tarefas repetitivas e acelerando ajustes técnicos.  
Todo o código foi revisado, adaptado e testado manualmente.

---

## Desafios
- **Persistência de progresso no quiz**: resolvido com uso de `localStorage`.  
- **Contraste no tema escuro**: ajustes de cores para garantir boa legibilidade.  
- **Deploy estático**: superado com GitHub Pages, dispensando backend.  

---

## Estrutura do Projeto

```plaintext
email-profissional/
├── index.html
├── guia.html
├── exercicios.html
├── css/
│   └── estilo.css
├── js/
│   └── script.js
└── img/
    └── email.webp
