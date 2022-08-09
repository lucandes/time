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
            document.title = abas[i].textContent;

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
    display_temporizador.innerHTML = atualizardisplay(tpr_timer, 3);
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

    display_temporizador.innerHTML = atualizardisplay(tpr_timer, 3);
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
    // retorna o foco para a sessão temporizador
    if (sessao_aberta != 0){
        let event = new MouseEvent('click');
        abas[0].dispatchEvent(event);
    }

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

    display_temporizador.innerHTML = atualizardisplay(tpr_timer, 3);
    if (alarmar) alarmar_temporizador();
}

// SESSÃO CRONÔMETRO
const display_cronometro = document.querySelector('.cronometro h1');
const botoes_cronometro = document.querySelectorAll('.cronometro .buttonlist i');
const lista_voltas = document.querySelector('.cronometro .voltas ul');
var crn_interval;
var crn_timer = [0,0,0,0];
var crn_voltas_contador = 0;
var crn_timer_total = [0,0,0,0];
var crn_status = 'stop'; //stop, pause, play

function play_cronometro (){
    // exibindo botões VOLTA e PAUSA
    botoes_cronometro[0].style.display = 'block';
    botoes_cronometro[3].style.display = 'block';

    // escondendo botões PLAY E STOP
    botoes_cronometro[1].style.display = 'none';
    botoes_cronometro[2].style.display = 'none';

    crn_interval = setInterval(() => {
        cronometro(crn_timer);
        cronometro(crn_timer_total);
        display_cronometro.innerHTML = atualizardisplay(crn_timer, 4);
    }, 10);

    crn_status = 'play';
}

function pause_cronometro (){
    // escondendo botões VOLTA e PAUSA
    botoes_cronometro[0].style.display = 'none';
    botoes_cronometro[3].style.display = 'none';
    
    // exibindo botões PLAY E STOP
    botoes_cronometro[1].style.display = 'block';
    botoes_cronometro[2].style.display = 'block';

    clearInterval(crn_interval);
    crn_status = 'pause';
}

function stop_cronometro (){
    // escondendo botão STOP
    botoes_cronometro[1].style.display = 'none';

    // resetando timer e histórico
    crn_timer = [0,0,0,0];
    crn_timer_total = [0,0,0,0];
    crn_voltas = []

    display_cronometro.innerHTML = atualizardisplay(crn_timer, 4);
    Array.from(lista_voltas.children).forEach((element) => {
        lista_voltas.removeChild(element);
    })
    crn_voltas_contador = 0;
    crn_status = 'stop';
}

function volta_cronometro(){
    let newli = document.createElement('li');
    
    newli.appendChild(document.createTextNode(++crn_voltas_contador+'. '
    +atualizardisplay(crn_timer,4)+' / '
    +atualizardisplay(crn_timer_total,4)));

    lista_voltas.appendChild(newli);
    crn_timer = [0,0,0,0];
}

function cronometro (timer_array){
    timer_array[3] += 10;

    if (timer_array[3] == 1000){
        timer_array[3] = 0;
        timer_array[2] += 1;
    }

    if (timer_array[2] == 60){
        timer_array[2] = 0;
        timer_array[1] += 1;
    }

    if (timer_array[1] == 60){
        timer_array[1] = 0;
        timer_array[0] += 1;
    }
}

// ATUALIZAÇÃO DE DISPLAY
const zeroPad = (num, places) => String(num).padStart(places, '0')

function atualizardisplay(array, len){
    if (len == 3) return zeroPad(array[0], 2)+':'+zeroPad(array[1], 2)+':'+zeroPad(array[2], 2);
    if (len == 4) return zeroPad(array[0], 2)+':'+zeroPad(array[1], 2)+':'+zeroPad(array[2], 2)+'.'+zeroPad((array[3] / 10), 2);
}