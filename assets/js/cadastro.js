document.addEventListener('DOMContentLoaded', () => {
    const cepInput = document.getElementById('cep');
    const btnBuscarCep = document.getElementById('btn-buscar-cep');
    const formRegister = document.getElementById('register-form-full');
    const feedbackBox = document.getElementById('feedback-register');

    const fields = {
        logradouro: document.getElementById('logradouro'),
        bairro: document.getElementById('bairro'),
        cidade: document.getElementById('cidade'),
        estado: document.getElementById('estado'),
    };

    /**
     * Limpa os campos de endereço
     */
    function clearAddressFields() {
        for (const key in fields) {
            fields[key].value = '';
        }
    }

    /**
     * Exibe mensagem de feedback
     */
    function showFeedback(message, isSuccess) {
        feedbackBox.innerHTML = message;
        feedbackBox.classList.remove('hidden', 'success', 'error');
        feedbackBox.classList.add(isSuccess ? 'success' : 'error');
    }

    /**
     * Busca o endereço na API ViaCEP
     */
    async function searchCep() {
        const cepValue = cepInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (cepValue.length !== 8) {
            clearAddressFields();
            showFeedback('CEP inválido. Digite 8 dígitos.', false);
            return;
        }

        clearAddressFields();
        showFeedback('Buscando CEP...', true);

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
            const data = await response.json();

            feedbackBox.classList.add('hidden'); // Esconde a mensagem de "Buscando"

            if (data.erro) {
                showFeedback('CEP não encontrado.', false);
                return;
            }

            fields.logradouro.value = data.logradouro || '';
            fields.bairro.value = data.bairro || '';
            fields.cidade.value = data.localidade || '';
            fields.estado.value = data.uf || '';

            // Foca no campo 'numero' após o preenchimento automático
            document.getElementById('numero').focus();

        } catch (error) {
            showFeedback('Erro ao conectar com o serviço de CEP.', false);
        }
    }

    // Event Listeners
    btnBuscarCep.addEventListener('click', searchCep);
    // Permite buscar também ao sair do campo (onblur)
    cepInput.addEventListener('blur', searchCep);

    // -----------------------------------------------------------------------
    // Validação Básica do Formulário
    // -----------------------------------------------------------------------
    formRegister.addEventListener('submit', function(e) {
        e.preventDefault();

        const senha = document.getElementById('senha').value;
        const confSenha = document.getElementById('conf-senha').value;
        const email = document.getElementById('email').value;
        const confEmail = document.getElementById('conf-email').value;

        if (senha !== confSenha) {
            showFeedback('As senhas não conferem. Por favor, verifique.', false);
            document.getElementById('senha').focus();
            return;
        }

        if (email !== confEmail) {
            showFeedback('Os e-mails não conferem. Por favor, verifique.', false);
            document.getElementById('email').focus();
            return;
        }

        // Simulação de Sucesso
        showFeedback('🎉 Cadastro realizado com sucesso! Você será redirecionado para o login.', true);

        // Em um projeto real, você enviaria os dados ao backend aqui.
        setTimeout(() => {
            // window.location.href = 'index.html';
            console.log("Redirecionando para index.html");
        }, 3000);
    });
});