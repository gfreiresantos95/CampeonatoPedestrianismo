/**
* Valida o CPF usando o algoritmo do Dígito Verificador (Módulo 11).
* @param {string} cpf - O CPF a ser validado (string de 11 dígitos).
* @returns {boolean} - Retorna true se o CPF for matematicamente válido.
*/
function validarCPF(cpf) {
    // 1. Limpa o CPF de caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g, '');

    // 2. Verifica se tem 11 dígitos e rejeita sequências repetidas (ex: "111.111.111-11")
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    // 3. Cálculo do 1º Dígito Verificador
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    // 4. Cálculo do 2º Dígito Verificador
    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) {
        resto = 0;
    }

    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
}

/**
* Função principal para aplicar a máscara e validação visual no campo CPF.
* @param {HTMLInputElement} i - O elemento input.
*/
function maskCPF(i) {
    // Lógica da máscara (mantida)
    let v = i.value.replace(/\D/g, '');
    v = v.substring(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    i.value = v;

    // Lógica da validação visual (chamada no oninput para feedback rápido)
    // O onblur será usado para a validação final (ver seção B)
    i.classList.remove('input-valido', 'input-invalido');

    if (v.length === 11) {
        if (validarCPF(v)) {
            i.classList.add('input-valido');
        } else {
            i.classList.add('input-invalido');
        }
    }
}

/**
* Aplica a máscara de Celular ((##) 9####-####) e aceita apenas números.
* @param {HTMLInputElement} i - O elemento input.
*/
function maskCelular(i) {
    // 1. Remove qualquer caractere que não seja dígito
    let v = i.value.replace(/\D/g, '');

    // 2. Limita o tamanho máximo de números (11 dígitos para o formato completo)
    v = v.substring(0, 11);

    // 3. Aplica a máscara em tempo real: (##) 9####-####
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2'); // Adiciona parênteses e espaço: (00) 000000000
    v = v.replace(/(\d{5})(\d)/g, '$1-$2');   // Adiciona o traço: (00) 00000-0000

    i.value = v;
}

/**
* Valida o formato básico de um e-mail.
* @param {HTMLInputElement} i - O elemento input.
*/
function validarEmail(i) {
    const email = i.value;
    // Regex simples para verificar a estrutura basica: texto@texto.texto
    const regexEmail = /^\S+@\S+\.\S+$/;

    // Remove classes de feedback anteriores
    i.classList.remove('input-valido', 'input-invalido');

    if (email === "") {
        // Se estiver vazio, não faz nada (a validação 'required' do HTML cuida disso)
        return;
    }

    if (regexEmail.test(email)) {
        // Formato OK
        i.classList.add('input-valido');
    } else {
        // Formato Inválido
        i.classList.add('input-invalido');
        // Opcional: Avisar o usuário (se o input for type="text", mas type="email" já avisa)
        // alert("Por favor, insira um endereço de e-mail válido.");
    }

    // Validação extra: verifica se Email e Confirmação de E-mail são iguais
    if (i.id === 'conf-email' || i.id === 'email') {
        const emailInput = document.getElementById('email');
        const confEmailInput = document.getElementById('conf-email');

        if (emailInput.value !== '' && confEmailInput.value !== '' && emailInput.value !== confEmailInput.value) {
            confEmailInput.classList.remove('input-valido');
            confEmailInput.classList.add('input-invalido');
            // Opcional: mostrar uma mensagem de erro abaixo dos campos
        } else if (emailInput.value === confEmailInput.value && emailInput.value !== '') {
            confEmailInput.classList.add('input-valido');
            confEmailInput.classList.remove('input-invalido');
        }
    }
}

/**
* Valida se os campos de Senha e Confirmação de Senha são iguais.
* Aplica as classes 'input-valido' ou 'input-invalido' para feedback visual.
*/
function validarSenhas() {
    const senha = document.getElementById('senha');
    const confSenha = document.getElementById('conf-senha');
    const senhaValor = senha.value;
    const confSenhaValor = confSenha.value;

    // Limpa classes de ambos os campos
    senha.classList.remove('input-valido', 'input-invalido');
    confSenha.classList.remove('input-valido', 'input-invalido');

    // REGRA 1: Verifica se as senhas estão vazias (ignora a validação)
    if (senhaValor === '' && confSenhaValor === '') {
        return;
    }

    // REGRA 2: Requisito Mínimo de Senha (Ex: 6 caracteres)
    const minLength = 6;
    let senhaValida = senhaValor.length >= minLength;
    let confSenhaValida = confSenhaValor.length >= minLength;

    // Aplica feedback baseado no comprimento mínimo (se ainda não forem iguais)
    if (senhaValor !== confSenhaValor) {
        if (senhaValida) {
            senha.classList.add('input-valido');
        } else if (senhaValor.length > 0) {
            senha.classList.add('input-invalido');
        }
    }

    // REGRA 3: Verifica se as senhas são iguais
    if (senhaValor === confSenhaValor && senhaValida) {
        // Se forem iguais e ambas cumprirem o mínimo
        senha.classList.add('input-valido');
        confSenha.classList.add('input-valido');
        senha.classList.remove('input-invalido');
        confSenha.classList.remove('input-invalido');
    } else if (confSenhaValor.length > 0) {
    // Se Confirmação tiver algo digitado, mas não for igual
    confSenha.classList.add('input-invalido');
    }
}

/**
* Valida se a data de nascimento indica que o usuário tem no mínimo 16 anos.
* @param {HTMLInputElement} input - O elemento input da data de nascimento.
*/
function validarIdade(input) {
    const dataNascStr = input.value;
    input.classList.remove('input-valido', 'input-invalido');

    if (!dataNascStr) {
        // Ignora a validação se o campo estiver vazio
        return;
    }

    // Converte a data de nascimento para um objeto Date
    const dataNascimento = new Date(dataNascStr);

    // Obtém a data de hoje
    const hoje = new Date();

    // Data limite: Calcula a data de 16 anos atrás
    // Subtrai 16 anos da data atual (Hoje)
    const dataLimite = new Date(hoje.getFullYear() - 16, hoje.getMonth(), hoje.getDate());

    // Se a data de nascimento for anterior ou igual à data limite, a pessoa tem 16 anos ou mais.
    // Ex: Se hoje é 24/10/2025, a data limite é 24/10/2009.
    // Uma pessoa nascida em 23/10/2009 ou antes é válida.
    // Uma pessoa nascida em 25/10/2009 ou depois é inválida.
    let isValido = dataNascimento <= dataLimite;

    if (isValido) {
        input.classList.add('input-valido');
        // Você pode adicionar uma mensagem de erro aqui caso use um span de feedback
        // Ex: document.getElementById('erro-idade').textContent = "";
    } else {
        input.classList.add('input-invalido');
        // Ex: document.getElementById('erro-idade').textContent = "Idade mínima de 16 anos não atingida.";
        // Opcional: Impedir a submissão (se for no evento submit do formulário)
        // Por enquanto, o feedback visual é suficiente.
    }
}

/**
* Aplica a máscara de CEP no formato #####-###
* @param {HTMLInputElement} i - O elemento input do CEP.
*/
function maskCEP(i) {
    let v = i.value.replace(/\D/g, ''); // 1. Remove tudo o que não for dígito
    v = v.substring(0, 8); // 2. Limita a 8 dígitos (sem o hífen)
    v = v.replace(/(\d{5})(\d)/, '$1-$2'); // 3. Coloca o hífen após o 5º dígito

    i.value = v;

    // Lógica da validação visual
    i.classList.remove('input-valido', 'input-invalido');

    // Se o campo tiver 9 caracteres (formato completo, ex: 12345-678), é válido
    if (i.value.length === 9) {
        i.classList.add('input-valido');
    } else if (i.value.length > 0) {
        // Se estiver incompleto, mas tiver algo digitado
        i.classList.add('input-invalido');
    }
}

    /**
     * Realiza a busca de endereço pelo CEP usando a API ViaCEP e preenche os campos.
     * @param {string} cep - O valor do CEP.
     */
    function buscarCEP(cep) {
        const cepLimpo = cep.replace(/\D/g, '');

        // Elementos do formulário
            const inputCep = document.getElementById('cep');
            const inputLogradouro = document.getElementById('logradouro');
            const inputBairro = document.getElementById('bairro'); // *NOVO*
            const inputCidade = document.getElementById('cidade');
            const inputEstado = document.getElementById('estado');
            const inputNumero = document.getElementById('numero'); // *NOVO*
            const inputComplemento = document.getElementById('complemento'); // *NOVO*

            // 1. Limpa e remove validação se o campo estiver incompleto
            if (cepLimpo.length !== 8) {
                // Limpar campos de endereço preenchidos automaticamente/manualmente
                inputLogradouro.value = '';
                inputBairro.value = '';
                inputCidade.value = '';
                inputEstado.value = '';

                // Limpar campos de preenchimento manual, se necessário, ao mudar o CEP
                inputNumero.value = '';
                inputComplemento.value = '';

                inputCep.classList.remove('input-valido', 'input-invalido');
                return;
            }

            // Feedback visual de busca
            inputLogradouro.value = 'Buscando...';
            inputBairro.value = 'Buscando...'; // Adicionar feedback
            inputCidade.value = 'Buscando...';
            inputEstado.value = '...';
            inputCep.classList.remove('input-valido', 'input-invalido');

            const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        // Preenchimento dos campos em caso de sucesso
                        inputLogradouro.value = data.logradouro;
                        inputBairro.value = data.bairro; // PREENCHE O BAIRRO
                        inputCidade.value = data.localidade;
                        inputEstado.value = data.uf;

                        // Limpa e foca no Número (pois é manual)
                        inputNumero.value = '';
                        inputComplemento.value = '';
                        inputNumero.focus(); // Direciona o usuário para o próximo campo manual

                        // Aplica a validação positiva (Borda Verde)
                        inputCep.classList.add('input-valido');

                    } else {
                        // ... (lógica de CEP não encontrado) ...
                    }
                })
                .catch(error => {
                    // ... (lógica de erro) ...
                });
    }

    /**
     * Remove qualquer caractere que não seja um dígito do valor do input.
     * É usado principalmente para o campo 'Número' do endereço.
     * @param {HTMLInputElement} input - O elemento input.
     */
    function limparNaoNumeros(input) {
        // Substitui globalmente (g) tudo que não for dígito (\D) por vazio ('')
        input.value = input.value.replace(/\D/g, '');
    }

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