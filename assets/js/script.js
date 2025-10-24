// Seletores de Elementos
const authForms = document.querySelectorAll('.auth-form');
const links = document.querySelectorAll('[data-form]'); // Seleciona links (Esqueceu a senha / Voltar)
const loginForm = document.getElementById('login-form');
const feedbackBox = document.getElementById('feedback-message');

/**
 * Função para alternar entre os formulários
 * @param {string} targetFormId - O ID do formulário que deve ser exibido (ex: 'login', 'recover')
 */
function switchForm(targetFormId) {
    // 1. Oculta todos os formulários
    authForms.forEach(form => {
        form.classList.remove('active');
        form.classList.add('hidden');
    });

    // 2. Exibe o formulário alvo
    const targetForm = document.getElementById(`${targetFormId}-form`);
    if (targetForm) {
        targetForm.classList.remove('hidden');
        targetForm.classList.add('active');
    }

    // 3. Oculta qualquer mensagem de feedback anterior
    feedbackBox.classList.add('hidden');
    feedbackBox.innerHTML = '';
}

// ----------------------------------------------------
// 1. Event Listeners para a Navegação (Links "Esqueceu a senha?" e "Voltar")
// ----------------------------------------------------
links.forEach(element => {
    element.addEventListener('click', function(e) {
        e.preventDefault(); // Impede o comportamento padrão de link/botão
        const target = this.getAttribute('data-form');
        switchForm(target);
    });
});


// ----------------------------------------------------
// 2. Simulação de Feedback e Validação no Login
// ----------------------------------------------------

/**
 * Função para mostrar uma mensagem de feedback na tela
 * @param {string} message - O texto da mensagem.
 * @param {boolean} isSuccess - true para sucesso, false para erro.
 */
function showFeedback(message, isSuccess) {
    feedbackBox.innerHTML = message;
    feedbackBox.classList.remove('hidden', 'success', 'error');
    if (isSuccess) {
        feedbackBox.classList.add('success');
    } else {
        feedbackBox.classList.add('error');
    }
}


// Adiciona o event listener para a submissão do formulário de login
loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o recarregamento da página

    const emailInput = document.getElementById('login-email').value.trim();
    const passwordInput = document.getElementById('login-password').value.trim();

    // Validação básica
    if (emailInput.length === 0 || passwordInput.length === 0) {
        showFeedback('Por favor, preencha todos os campos.', false);
        return;
    }

    // SIMULAÇÃO: Se for um "sucesso" (ex: email 'corredor@teste.com' e senha '123456')
    if (emailInput === 'corredor@teste.com' && passwordInput === '123456') {
        showFeedback('✅ Login realizado com sucesso! Redirecionando...', true);

        // Em um projeto real, você redirecionaria:
        setTimeout(() => {
            // window.location.href = 'dashboard.html';
            console.log("Redirecionando para dashboard.html");
        }, 1500);
        loginForm.reset();

    }
    // SIMULAÇÃO: Se for um "erro"
    else {
        showFeedback('❌ E-mail/CPF ou Senha incorretos. Tente novamente.', false);
    }

});

// ----------------------------------------------------
// 3. Inicialização
// ----------------------------------------------------

// Garante que a tela de login seja a primeira a ser exibida
switchForm('login');