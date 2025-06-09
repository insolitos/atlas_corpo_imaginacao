// Dados da aplicação
const appData = {
    quiz: [
        {
            pergunta: "Em que ano foi defendida a tese de doutoramento que originou o Atlas do Corpo e da Imaginação?",
            opcoes: ["2001", "2006", "2013", "2020"],
            resposta_correta: 1,
            explicacao: "A tese foi defendida em 2006 na Faculdade de Motricidade Humana da Universidade Técnica de Lisboa."
        },
        {
            pergunta: "Quantos membros compõem o coletivo Os Espacialistas?",
            opcoes: ["3", "4", "5", "6"],
            resposta_correta: 1,
            explicacao: "Os Espacialistas são compostos por quatro membros: Luís Baptista, João Cerdeira, Diogo Castro e Sérgio Serol."
        },
        {
            pergunta: "Qual é o subtítulo da obra Atlas do Corpo e da Imaginação?",
            opcoes: ["Fragmentos e Pensamento", "Teoria, fragmentos e imagens", "Corpo e Espaço", "Imaginação e Realidade"],
            resposta_correta: 1,
            explicacao: "O subtítulo completo é 'Teoria, fragmentos e imagens', indicando a natureza multidisciplinar da obra."
        },
        {
            pergunta: "Quantas partes principais divide a estrutura do Atlas?",
            opcoes: ["3", "4", "5", "6"],
            resposta_correta: 1,
            explicacao: "O Atlas divide-se em quatro partes: O corpo no método, O corpo no mundo, O corpo no corpo e O corpo na imaginação."
        },
        {
            pergunta: "Qual filósofo francês é citado por Tavares em relação aos conceitos de interior e exterior?",
            opcoes: ["Michel Foucault", "Roland Barthes", "Gaston Bachelard", "Jacques Roubaud"],
            resposta_correta: 2,
            explicacao: "Gaston Bachelard é citado por suas reflexões sobre 'o interior e o exterior' e o pensamento sobre ser e não-ser."
        }
    ],
    temas_conceituais: [
        {
            nome: "Corpo",
            conexoes: ["Método", "Mundo", "Imaginação", "Tecnologia", "Identidade"]
        },
        {
            nome: "Fragmento",
            conexoes: ["Linguagem", "Pensamento", "Narrativa", "Tempo", "Memória"]
        },
        {
            nome: "Espaço",
            conexoes: ["Arquitetura", "Arte", "Corpo", "Fotografia", "Lugar"]
        },
        {
            nome: "Pensamento",
            conexoes: ["Filosofia", "Literatura", "Método", "Investigação", "Conceitos"]
        },
        {
            nome: "Imaginação",
            conexoes: ["Criatividade", "Arte", "Sonho", "Ficção", "Poesia"]
        }
    ]
};

// Estado da aplicação
let currentQuestionIndex = 0;
let quizScore = 0;
let selectedOption = null;

// Elementos DOM
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebarClose');
const navLinks = document.querySelectorAll('.nav-link');

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeQuiz();
    initializeMapaConceitual();
    initializeScrollAnimations();
});

// === NAVEGAÇÃO ===
function initializeNavigation() {
    // Toggle do menu lateral
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Fechar menu lateral
    sidebarClose.addEventListener('click', function() {
        sidebar.classList.remove('active');
        menuToggle.classList.remove('active');
    });

    // Navegação suave entre seções
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Fechar menu lateral em dispositivos móveis
                sidebar.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

// === QUIZ INTERATIVO ===
function initializeQuiz() {
    displayQuestion();
    
    document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
    document.getElementById('restartQuiz').addEventListener('click', restartQuiz);
}

function displayQuestion() {
    const question = appData.quiz[currentQuestionIndex];
    const questionText = document.getElementById('questionText');
    const quizOptions = document.getElementById('quizOptions');
    const progressFill = document.getElementById('progressFill');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    
    // Atualizar texto da pergunta
    questionText.textContent = question.pergunta;
    
    // Limpar opções anteriores
    quizOptions.innerHTML = '';
    selectedOption = null;
    
    // Criar opções
    question.opcoes.forEach((opcao, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = opcao;
        optionDiv.addEventListener('click', () => selectOption(index, optionDiv));
        quizOptions.appendChild(optionDiv);
    });
    
    // Atualizar barra de progresso
    const progress = ((currentQuestionIndex + 1) / appData.quiz.length) * 100;
    progressFill.style.width = progress + '%';
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    
    // Esconder elementos de feedback e controles
    document.getElementById('quizFeedback').style.display = 'none';
    document.getElementById('nextQuestion').style.display = 'none';
    document.getElementById('restartQuiz').style.display = 'none';
}

function selectOption(index, optionElement) {
    // Remover seleção anterior
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Selecionar nova opção
    optionElement.classList.add('selected');
    selectedOption = index;
    
    // Verificar resposta
    checkAnswer();
}

function checkAnswer() {
    if (selectedOption === null) return;
    
    const question = appData.quiz[currentQuestionIndex];
    const isCorrect = selectedOption === question.resposta_correta;
    const feedback = document.getElementById('quizFeedback');
    const options = document.querySelectorAll('.quiz-option');
    
    // Desabilitar todas as opções
    options.forEach((option, index) => {
        option.style.pointerEvents = 'none';
        if (index === question.resposta_correta) {
            option.classList.add('correct');
        } else if (index === selectedOption && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    // Mostrar feedback
    feedback.style.display = 'block';
    feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedback.innerHTML = `
        <strong>${isCorrect ? 'Correto!' : 'Incorreto!'}</strong><br>
        ${question.explicacao}
    `;
    
    // Atualizar pontuação
    if (isCorrect) {
        quizScore++;
    }
    
    // Mostrar botão de próxima pergunta ou reiniciar
    if (currentQuestionIndex < appData.quiz.length - 1) {
        document.getElementById('nextQuestion').style.display = 'inline-block';
    } else {
        showQuizResults();
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

function showQuizResults() {
    const feedback = document.getElementById('quizFeedback');
    const percentage = Math.round((quizScore / appData.quiz.length) * 100);
    
    feedback.innerHTML = `
        <h3>Quiz Concluído!</h3>
        <p><strong>Pontuação: ${quizScore}/${appData.quiz.length} (${percentage}%)</strong></p>
        <p>${getScoreMessage(percentage)}</p>
    `;
    feedback.className = 'quiz-feedback correct';
    
    document.getElementById('restartQuiz').style.display = 'inline-block';
}

function getScoreMessage(percentage) {
    if (percentage >= 80) {
        return "Excelente! Você demonstra um conhecimento profundo sobre a obra de Gonçalo M. Tavares.";
    } else if (percentage >= 60) {
        return "Bom trabalho! Você tem um conhecimento sólido sobre o Atlas do Corpo e da Imaginação.";
    } else if (percentage >= 40) {
        return "Não está mal! Continue explorando a obra para aprofundar seus conhecimentos.";
    } else {
        return "Continue estudando! A obra de Tavares oferece muitas camadas de interpretação para descobrir.";
    }
}

function restartQuiz() {
    currentQuestionIndex = 0;
    quizScore = 0;
    selectedOption = null;
    displayQuestion();
}

// === MAPA CONCEITUAL ===
function initializeMapaConceitual() {
    const mapaContainer = document.getElementById('mapaConceitual');
    const conceitoInfo = document.getElementById('conceitoInfo');
    const conceitoNome = document.getElementById('conceitoNome');
    const conceitoConexoes = document.getElementById('conceitoConexoes');
    
    // Criar nós conceituais
    appData.temas_conceituais.forEach((tema, index) => {
        const node = document.createElement('div');
        node.className = 'conceito-node';
        node.textContent = tema.nome;
        node.style.animationDelay = `${index * 0.1}s`;
        
        node.addEventListener('click', function() {
            // Remover estado ativo de outros nós
            document.querySelectorAll('.conceito-node').forEach(n => {
                n.classList.remove('active');
            });
            
            // Ativar nó atual
            this.classList.add('active');
            
            // Mostrar informações do conceito
            conceitoNome.textContent = tema.nome;
            conceitoConexoes.innerHTML = '';
            
            tema.conexoes.forEach(conexao => {
                const li = document.createElement('li');
                li.textContent = conexao;
                conceitoConexoes.appendChild(li);
            });
            
            conceitoInfo.style.display = 'block';
            
            // Scroll suave para as informações
            conceitoInfo.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        });
        
        mapaContainer.appendChild(node);
    });
}

// === ANIMAÇÕES DE SCROLL ===
function initializeScrollAnimations() {
    // Observer para animações de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar cards e elementos animáveis
    const animatedElements = document.querySelectorAll('.card, .parte-card, .pensador-card, .galeria-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// === FUNCIONALIDADES EXTRAS ===

// Smooth scroll para navegação interna
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Highlight da seção ativa na navegação
function updateActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Listener para scroll
window.addEventListener('scroll', updateActiveNavigation);

// Animação de hover para cards da estrutura
document.addEventListener('DOMContentLoaded', function() {
    const parteCards = document.querySelectorAll('.parte-card');
    
    parteCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Função para copiar texto (funcionalidade extra)
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Texto copiado com sucesso');
    }, function(err) {
        console.error('Erro ao copiar texto: ', err);
    });
}

// Easter egg: Konami Code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.toString() === konamiSequence.toString()) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    const body = document.body;
    body.style.animation = 'rainbow 2s infinite';
    
    setTimeout(() => {
        body.style.animation = '';
        alert('🎉 Parabéns! Você descobriu o segredo do Atlas! 🎉\n\n"O corpo é uma geografia que se inventa a cada movimento." - Gonçalo M. Tavares');
    }, 2000);
}

// CSS para o easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    .nav-link.active {
        background: var(--color-primary);
        color: var(--color-btn-primary-text);
    }
`;
document.head.appendChild(style);

// Função para validar formulários (se necessário no futuro)
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim() === '') {
        errors.push('Nome é obrigatório');
    }
    
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
        errors.push('Email válido é obrigatório');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Função para debug (remover em produção)
function debugInfo() {
    console.log('Atlas do Corpo e da Imaginação - Debug Info');
    console.log('Quiz questions:', appData.quiz.length);
    console.log('Conceptual themes:', appData.temas_conceituais.length);
    console.log('Current quiz score:', quizScore);
    console.log('Current question index:', currentQuestionIndex);
}

// Disponibilizar função de debug globalmente
window.debugAtlas = debugInfo;