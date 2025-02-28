const fileInput = document.getElementById('file-input');
const audio = document.getElementById('audio');
const rewindButton = document.getElementById('rewind');
const playPauseButton = document.getElementById('play-pause');
const forwardButton = document.getElementById('forward');
const musicList = document.getElementById('music-list');
const loginButton = document.getElementById('login-button');
const loginContainer = document.getElementById('login-container');
const musicListContainer = document.getElementById('music-list-container');
const musicPlayer = document.getElementById('music-player');
const userInfo = document.getElementById('user-info');
const userNameDisplay = document.getElementById('user-name');
const userPlanDisplay = document.getElementById('user-plan');

let storedMusic = JSON.parse(localStorage.getItem('music')) || [];
let currentMusicIndex = -1; // Índice da música atual
let userPlan = 'free'; // Plano do usuário (padrão é gratuito)
let userName = ''; // Nome do usuário
const premiumDuration = 7; // Duração do plano premium em dias

// Limpa todas as músicas do localStorage ao recarregar a página
localStorage.removeItem('music');

// Função para carregar músicas do localStorage
function loadMusic() {
    musicList.innerHTML = ''; // Limpa a lista antes de carregar
    storedMusic.forEach((music, index) => {
        const li = document.createElement('li');
        li.textContent = `Música ${index + 1}: ${music.name}`;
        li.dataset.url = music.url; // Armazena a URL da música
        li.addEventListener('click', () => {
            currentMusicIndex = index; // Atualiza o índice da música atual
            audio.src = li.dataset.url; // Define a fonte do áudio
            audio.play(); // Toca a música ao clicar na lista
            updatePlayPauseButton(); // Atualiza o botão de play/pause
        });
        musicList.appendChild(li);
    });
}

// Função para adicionar nova música
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const fileURL = URL.createObjectURL(file);
        const musicName = file.name;

    // Verificar se o usuário é gratuito e se já existem 10 músicas
    if (userPlan === 'free' && storedMusic.length >= 10) {
        alert('Você já atingiu o limite de 10 músicas no plano gratuito.');
        return;
    }

    // Adicionar nova música ao localStorage
    storedMusic.push({ name: musicName, url: fileURL });
    localStorage.setItem('music', JSON.stringify(storedMusic));

    // Atualizar a lista de músicas
    loadMusic();
});

// Tocar ou pausar o áudio
playPauseButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        updatePlayPauseButton(); // Atualiza o botão de play/pause
    } else {
        audio.pause();
        updatePlayPauseButton(); // Atualiza o botão de play/pause
    }
});

// Voltar 10 segundos
rewindButton.addEventListener('click', () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10); // Volta 10 segundos, mas não permite valores negativos
});

// Avançar 10 segundos
forwardButton.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10); // Avança 10 segundos, mas não ultrapassa a duração
});

// Atualiza o botão de play/pause
function updatePlayPauseButton() {
    if (audio.paused) {
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Muda o ícone para "Play"
    } else {
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Muda o ícone para "Pausar"
    }
}

// Tocar a próxima música quando a atual terminar
audio.addEventListener('ended', () => {
    currentMusicIndex++;
    if (currentMusicIndex < storedMusic.length) {
        const nextMusic = storedMusic[currentMusicIndex];
        audio.src = nextMusic.url; // Define a fonte do áudio
        audio.play(); // Toca a próxima música
        updatePlayPauseButton(); // Atualiza o botão de play/pause
    } else {
        currentMusicIndex = -1; // Reseta o índice se não houver mais músicas
    }
});

// Função de login
loginButton.addEventListener('click', () => {
    userName = document.getElementById('username').value;
    userPlan = document.getElementById('plan').value;

    if (userName) {
        loginContainer.style.display = 'none'; // Esconde a tela de login
        musicListContainer.style.display = 'block'; // Mostra a lista de músicas
        musicPlayer.style.display = 'block'; // Mostra o tocador musical
        userInfo.style.display = 'block'; // Mostra a informação do usuário

        // Atualiza a exibição do nome e plano do usuário
        userNameDisplay.textContent = `Usuário: ${userName}`;
        userPlanDisplay.textContent = `Plano: ${userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}`; // Capitaliza a primeira letra do plano

        // Verifica se o plano é premium e se a data de expiração está definida
        if (userPlan === 'premium') {
            const activationDate = localStorage.getItem('premiumActivationDate');
            const currentDate = new Date();
            
            if (!activationDate) {
                // Se não houver data de ativação, define a data atual
                localStorage.setItem('premiumActivationDate', currentDate.toISOString());
            } else {
                const expirationDate = new Date(activationDate);
                expirationDate.setDate(expirationDate.getDate() + premiumDuration);
                
                if (currentDate > expirationDate) {
                    alert('Seu plano premium expirou. Você agora está no plano gratuito.');
                    userPlan = 'free'; // Muda o plano para gratuito
                    userPlanDisplay.textContent = `Plano: Gratuito`;
                }
            }
        }

        loadMusic(); // Carrega as músicas armazenadas
    } else {
        alert('Por favor, insira um nome de usuário.');
    }
});
