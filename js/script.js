const conteudo = document.querySelector('.content');
const abas = document.querySelectorAll('.abas h2');
const sessoes = document.querySelectorAll('.sessao');
var sessao_aberta = 1; // relogio

// FUNÇÃO ALTERNAR ABAS
for (let i=0; i<abas.length; ++i) {
    abas[i].addEventListener('click', () => {
        if (i != sessao_aberta){
            // removendo configuração anterior
            abas[sessao_aberta].classList.remove('selected');
            sessoes[sessao_aberta].classList.remove('selected');
            
            // adicionando nova configuração
            abas[i].classList.add('selected');
            sessoes[i].classList.add('selected');

            sessao_aberta = i;
        }
    })
}

// SESSÃO RELÓGIO
const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Dezembro'];
const display_relogio = document.querySelector('.relogio h1');
const data_relogio = document.querySelector('.relogio h2');
relogio(); // para atualização imediata
var relogio_interval = setInterval(relogio, 1000);

function relogio(){
    let date = new Date();
    display_relogio.innerHTML = date.toLocaleTimeString();
    data_relogio.innerHTML = dias[date.getDay()]+', '+date.getDate()
    +' de '+meses[date.getMonth()]+' de '+date.getFullYear(); 
}

// SESSÃO TEMPORIZADOR
const display_temporizador = document.querySelector('.temporizador h1');
const botoes_temporizador = document.querySelectorAll('.temporizador .buttonlist i');
const seletores_tpr = document.querySelectorAll('.temporizador input');
const som_alarme = document.querySelector('audio');
var tpr_timer = [0,0,0]; // hora, minuto, segundo
var tpr_interval;
var tpr_status = 'stop'; // stop, pause, play, alarm

/// botao play
function play_temporizador(){
    if (tpr_status == 'play') return;
    
    if (tpr_status == 'stop'){
        tpr_timer = [seletores_tpr[0].value, seletores_tpr[1].value, seletores_tpr[2].value];
    }
    let timerzerado = tpr_timer[0]+tpr_timer[1]+tpr_timer[2] == 0;

    if (timerzerado){
        stop_temporizador();
        return;
    }
    
    botoes_temporizador[1].style.display = 'none';
    botoes_temporizador[0].style.display = 'inline-block';
    botoes_temporizador[2].style.display = 'inline-block';
    
    tpr_status = 'play';
    display_temporizador.innerHTML = atualizardisplay(tpr_timer);
    tpr_interval = setInterval(temporizador, 1000);
}

/// botao stop
function stop_temporizador(){
    if (tpr_status == 'stop') return;
    if (tpr_status == 'alarm'){
        som_alarme.pause();
        som_alarme.currentTime = 0;
        conteudo.style.animation = 'none';
    }

    clearInterval(tpr_interval);
    tpr_timer = [0,0,0];
    tpr_status = 'stop';

    display_temporizador.innerHTML = atualizardisplay(tpr_timer);
    botoes_temporizador[1].style.display = 'inline-block';
    botoes_temporizador[0].style.display = 'none';
    botoes_temporizador[2].style.display = 'none';
}

/// botao pause
function pause_temporizador(){
    clearInterval(tpr_interval);
    tpr_status = 'pause';
    botoes_temporizador[1].style.display = 'inline-block';
    botoes_temporizador[2].style.display = 'none';
}

function alarmar_temporizador() {
    clearInterval(tpr_interval);
    tpr_status = 'alarm';
    conteudo.style.animation = 'alarme 1s ease 0s infinite';
    botoes_temporizador[2].style.display = 'none';
    som_alarme.volume = '0.2';
    som_alarme.loop = true;
    som_alarme.play();
}

function temporizador(){
    let alarmar = false;
    tpr_timer[2] -= 1;

    if (tpr_timer[2] < 0 && tpr_timer[1] > 0){
        tpr_timer[2] = 59;
        tpr_timer[1] -= 1;
    }
    else if (tpr_timer[2] < 0 && tpr_timer[1] == 0 && tpr_timer[0] > 0){
        tpr_timer[2] = 59;
        tpr_timer[1] = 59;
        tpr_timer[0] -= 1;
    }
    else if (tpr_timer[0] == 0 && tpr_timer[1] ==  0 && tpr_timer[2] == 0) {
        alarmar = true;
    }

    display_temporizador.innerHTML = atualizardisplay(tpr_timer);
    if (alarmar) alarmar_temporizador();
}

// SESSÃO CRONÔMETRO
const display_cronometro = document.querySelector('.cronometro h1');
const botoes_cronometro = document.querySelectorAll('.cronometro .buttonlist i');


// ATUALIZAÇÃO DE DISPLAY
const zeroPad = (num, places) => String(num).padStart(places, '0')

function atualizardisplay(array){
    return zeroPad(array[0], 2)+':'+zeroPad(array[1], 2)+':'+zeroPad(array[2], 2);
}