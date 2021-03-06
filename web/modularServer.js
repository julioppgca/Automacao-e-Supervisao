// file: modularServer.js

// modulos
var http = require('http')
var   fs = require('fs');

// porta
const port = 3000

//tamanho de mensagem de monitoramento (mais detalhes na descrição de UltraMsg)
const monitsize = 28

// pagina principal
const mainPage = 'index.html'
const myStyle1  = 'style.css'
const myStyle2  = 'styleConfig.css'
const myStyle3  = 'styleMonit.css'

// Formata 1 em 01
const zeroFill = n => {
	return ('0' + n).slice(-2);
}

// Cria intervalo e monitora hora do sistema
const interval = setInterval(() => {
	// Pega o horário atual
	const now = new Date();

	// Formata a hora (hh:mm:ss)
	const dataHora = zeroFill(now.getHours()) + ':' + zeroFill(now.getMinutes()) + ':' + zeroFill(now.getSeconds());
	//console.log(dataHora); //hora mostrada no terminal
	Hora = dataHora;

	if(Hora == windop){
		//envia comando ao firmware para abrir janelas
		var mensagem = ':' + '14' + '1' + 'D' + '1' + '0204';//mensagem s/ lrc
		msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();//calcula lrc e armazena aqui
		var mensagemlrc = ':'+slaveAdr+slaveRW+slaveAD+slaveIO+slaveData+msglrc;//mensagem c/ lrc
		sPort.write(mensagemlrc)
		
		var mensagem = ':' + '21' + '1' + 'D' + '1' + '0204';//mensagem s/ lrc
		msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();//calcula lrc e armazena aqui
		var mensagemlrc = ':'+slaveAdr+slaveRW+slaveAD+slaveIO+slaveData+msglrc;//mensagem c/ lrc
		sPort.write(mensagemlrc)
		
	}else if(Hora == windhalf){
		//envia comando ao firmware para deixar janelas meio abertas
		var mensagem = ':' + '14' + '1' + 'D' + '1' + '0127';//mensagem s/ lrc
		msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();//calcula lrc e armazena aqui
		var mensagemlrc = ':'+slaveAdr+slaveRW+slaveAD+slaveIO+slaveData+msglrc;//mensagem c/ lrc
		sPort.write(mensagemlrc)
		
		var mensagem = ':' + '21' + '1' + 'D' + '1' + '0127';//mensagem s/ lrc
		msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();//calcula lrc e armazena aqui
		var mensagemlrc = ':'+slaveAdr+slaveRW+slaveAD+slaveIO+slaveData+msglrc;//mensagem c/ lrc
		sPort.write(mensagemlrc)
		
	}else if(Hora == windclose){
		//envia comando ao firmware para fechar janelas
		var mensagem = ':' + '14' + '1' + 'D' + '1' + '0051';//mensagem s/ lrc
		msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();//calcula lrc e armazena aqui
		var mensagemlrc = ':'+slaveAdr+slaveRW+slaveAD+slaveIO+slaveData+msglrc;//mensagem c/ lrc
		sPort.write(mensagemlrc)
		
		var mensagem = ':' + '21' + '1' + 'D' + '1' + '0051';//mensagem s/ lrc
		msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();//calcula lrc e armazena aqui
		var mensagemlrc = ':'+slaveAdr+slaveRW+slaveAD+slaveIO+slaveData+msglrc;//mensagem c/ lrc
		sPort.write(mensagemlrc)
	}
	
}, 1000);//a cada segundo...

/*---- Converte String para ArrayBUffer -----*/
var convertStringToArrayBuffer = function (str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0; i < str.length; i++) {
      bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/*---- soma dois valores somente com operadores binários -----*/
function somabin(a, b){
	var uncommonBits = a ^ b;
	var commonBits = a & b;

	if(commonBits == 0)
	  return uncommonBits

	return somabin(uncommonBits, (commonBits << 1));
}

/*---- Converte string hexadecimal para ascii -----*/
function hex_to_ascii(str1)
{
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
	  str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}

/*---- Calcula LRC -----*/
function calculateLRC(str) {
	var buffer = convertStringToArrayBuffer(str);
	var testeray = new Uint8Array(Buffer.from(buffer));

	var lrc = 0;
	var exant = 0;
	for (var i = 0; i < str.length; i++) {
	var ex = hex_to_ascii(testeray[i].toString(16));
	if(i%2!=0){
	var duex = exant.concat('',ex);
	var decim = parseInt(duex, 16);
	lrc += decim & 0xFF;
	}
	exant = ex;
	}
	lrc = (somabin((lrc ^ 0xFF), 1) & 0xFF);
//deadBand
	return lrc;
}

//função para delays, deve ser async e com uso de await
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
/* Exemplo de chamada:
chama em outro lugar a later()
async function later()
	{
		await sleep(3000);
		socket.emit('conrai2', [slaveOut, global2]);
		global2 = '';
	}
*/

function handlebaud(text){//300 a 2000000
	var tam = (text.toString()).length;
	switch (tam){
		case 0:
			return ('erro');
			
		case 1:
			return ('000000' + text);
      
	    case 2:
			return ('00000' + text);

		case 3:
			return ('0000' + text);

		case 4:
			return ('000' + text);
			
		case 5:
			return ('00' + text);
			
		case 6:
			return ('0' + text);
			
		case 7:
			return (text);

		default:
			return ('0000000');
	}
}

/*função que define a quantidade de caracteres recebidos e transforma em 4*/
function handleSize(text){
  var tam = (text.toString()).length;
  switch (tam){
    case 1:
      return ('000' + text);
      
    case 2:
      return ('00' + text);

    case 3:
      return ('0' + text);

    case 4:
      return (text);

    default:
      return ('0000');
  }
}

//recebe minutos e retorna em formato HHMM
function convertMinToHHMM(min){
	console.log("recebido " + min + " minuto(s)")
	if((min/60) >= 1){//calcula hora
		var hour = (parseInt(min/60).toString()).toString();
		if(hour.length < 2) hour = '0' + hour;
		var minute = (min%60).toString();
		if(minute.length < 2) minute = '0' + minute;
		var retorno = hour + minute;
		return retorno;
	}else{
		var hour = "00";
		var minute = min.toString();
		var retorno = hour + minute;
		if(minute.length < 2)
		{
			return retorno = hour + '0' + minute
		}
		return retorno;
	}
}

/*função que reorganiza mensagens de horário, recebendo no formato 'HH:MM', e retornando como 'HHMM' */
function handleTime(text){
  var str = (text.toString()).split(':');
  var hour = str[0];
  var min = str[1];
  return (msg=hour+min);
}

//faz isso daki a 1 segundo
async function later(profirmware)
{
	await sleep(300);
	sPort.write(profirmware);
}

async function later2(profirmware)
{
	await sleep(400);
	sPort.write(profirmware);
}

// servidor ouvindo em 'port'
var app = http.createServer(function(req, res) {
    
    var content = '';   // conteúdo da resposta
    var type = '';      // tipo da resposta: text/html, text/css
    
    if(req.url === '/') {   // requisição na raiz, carrega página principal
        content = fs.readFileSync(mainPage);      
        type = 'text/html';
    }
    else if(req.url === '/style.css') {
        content = fs.readFileSync(myStyle1);	// load css
        type = 'text/css';
    }
    
    console.log(req.url) // tipo de requisição realizada
    res.writeHead(200, {'Content-Type': type}); // responde com tipo
    res.end(content + '\n'); // envia conteúdo 
}).listen(port)

var socket = require('socket.io').listen(app);

//nota: a tratar endereços de envio, ou formas de envio específicas para a serial quanto às msg de configuração
socket.on('connection', function(client) {
  /////////////     MENSAGENS DE AÇÃO     /////////////
  //valores recebidos na ordem da variavel mensagem, contendo sliders e inputs da pagina de ação
	client.on('state', function(Data){//envia na porta serial a msg c/ lrc, com base nos dados recebidos (Data) na conexão state
        console.log('Setado ' + Data);
		slaveAdr = Data[0] //end. escravo
		slaveRW = Data[1] //op. leitura/escrita
		slaveAD = Data[2] //port analógica/digital
		slaveIO = Data[3] //Input / Output
        slaveData = handleSize(Data[4]) //dados: 0000 / 0001 / 0255 / 1024...
		var mensagem = ':' + slaveAdr + slaveRW + slaveAD + slaveIO + slaveData;//mensagem s/ lrc
		msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();//calcula lrc e armazena aqui
		var mensagemlrc = mensagem+msglrc;//mensagem c/ lrc
		console.log("msg de acao: " +mensagemlrc);
		//sPort.write()
		later(mensagemlrc);
		//nada a retornar...
  })
  
  //cancelar alarme
  client.on('Deactivate', function(Data){//envia mensagem ao firmware para desativar alarme
    console.log('Recebido da web: ' + Data);
    if(Data == pass){//senha correta, envia comando ao firmware para desligar alarme
		var mensagem = ':' + '03' + '1' + 'D' + '1' + '0000';//mensagem s/ lrc
		msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();//calcula lrc e armazena aqui
		var mensagemlrc = mensagem+msglrc;//mensagem c/ lrc
		sPort.write(mensagemlrc)
		console.log('Senha correta, à desativar alarme...');
		socket.emit('DeactivateLog', [])
	}else{//senha incorreta, manda mensagem de erro na comunicação DeactivateLog
		console.log('Senha incorreta, enviando msg de erro ao front...');
		socket.emit('DeactivateLogError', [passerror])
	}
  })
  
  //abrir porta
  client.on('OpDoor', function(Data){//envia mensagem ao firmware para abrir a porta
    if(Data == pass){//senha correta, envia comando ao firmware para abrir...
		var mensagem = ':' + '02' + '1' + 'D' + '1' + '0000';//mensagem s/ lrc
		msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();//calcula lrc e armazena aqui
		var mensagemlrc = mensagem+msglrc;//mensagem c/ lrc
		sPort.write(mensagemlrc)
		console.log('Senha correta, à abrir a porta...');
		socket.emit('OpDoorLog', [])
	}else{//senha incorreta, manda mensagem de erro na comunicação DeactivateLog
		console.log('Senha incorreta, enviando msg de erro ao front...');
		socket.emit('OpDoorLogError', [passerror])
	}
  })
  
  //AC modo automático
  client.on('autoAC', function(Data){//envia temperatura padrão do AC da sala de estar, com base no dado ACdeg armazenado na conexão autoAC
	var mensagem = ':' + '12' + '1' + 'A' + '1' + ACdeg;//mensagem s/ lrc
    msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();
	var mensagemlrc = mensagem+msglrc;//mensagem c/ lrc
    //sPort.write(mensagemlrc)
    console.log('temperatura de AC da Sala de estar '+ACdeg+' setada');
	later2(mensagemlrc)
    //nada a retornar...
  })

  /////////////     MENSAGENS DE CONFIGURAÇÃO     /////////////

  //ENTRADA PRINCIPAL
  client.on('Entry', function(Data){//armazena em variavel senha e envia ao firmware o time de fechamento da porta com base nos dados recebidos (Data) na conexão Entry
    console.log('Recebido da web: ' + Data);
    pass = Data[0];
    var dct = handleSize(Data[1]);
    doorCloseTime = convertMinToHHMM(parseInt(dct));//transforma em numero e converte no formato HHMM
	var mensagem = ':' + '01' + '1' + 'D' + '0' + doorCloseTime;//mensagem s/ lrc
    console.log('Senha '+pass+' e tempo de destravamento '+doorCloseTime+' armazenados');
    msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();
	var mensagemlrc = mensagem+msglrc;//mensagem c/ lrc
    sPort.write(mensagemlrc)
    //nada a retornar...
  })
  
  //SALA DE ESTAR
  client.on('LivRoom', function(Data){//armazena em variavel a temperatura padrão do AC da sala de estar, com base nos dados recebidos (Data) na conexão LivRoom
    console.log('Recebido da web:' + Data);
    ACdeg = Data+"00";
	var mensagem = ':' + '12' + '1' + 'A' + '1' + ACdeg;//mensagem s/ lrc
    msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();
	var mensagemlrc = mensagem+msglrc;//mensagem c/ lrc
    sPort.write(mensagemlrc)
    console.log('temperatura de AC da Sala de estar '+ACdeg+' armazenada e setada');
    //nada a retornar...
  })

  client.on('Windows', function(Data){//armazena em variaveis os horários de controle das janelas, com base nos dados recebidos (Data) na conexão Windows
    console.log('Recebido da web:' + Data);
	windhalf = Data[0] + ":00";
	windop = Data[1] + ":00";
	windclose = Data[2] + ":00";
    console.log('Hora de abertura '+windop+', de intermedio '+windhalf+', e fechamento '+windclose+ ' armazenadas');
    //nada a retornar...
  })

  //QUARTO E BANHEIRO
  client.on('Heater', function(Data){//armazena em variavel o valor da banda morta com base nos dados recebidos (Data) na conexão Heater
    console.log('Recebido da web: ' + Data);
    var aux = Data;
    deadBand = handleSize(aux);
	console.log('Enviando Deadband: ' + deadBand);
	var mensagem = ':' + '25' + '1' + 'A' + '0' + deadBand;//mensagem s/ lrc
    msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();
	var mensagemlrc = mensagem+msglrc;//mensagem c/ lrc
	console.log('Enviando dead band: ' + deadBand);
	sPort.write(mensagemlrc)
    //nada a retornar...
  })
  
  client.on('baud', function(Data){
	  console.log('Recebido baudrate: ' + Data);
	  var aux = Data;
	  tempbaud = handlebaud(aux);
	  console.log('Enviando baudrate: ' + tempbaud);
	  var mensagem = ':' + '3' + tempbaud;//mensagem s/ lrc
	  msglrc = ((calculateLRC(((Buffer.from(mensagem)).toString()).slice(1))).toString(16)).toUpperCase();
	  var mensagemlrc = mensagem+msglrc;//mensagem c/ lrc
	  sPort.write(mensagemlrc);
	  perareset(parseInt(tempbaud));
  })
  
  //comunicação de monitoramento lá embaixo...
})

async function perareset()
{
	await sleep(5000);
	BAUD = tempbaud;
}


var BAUD = 9600;
var tempbaud = BAUD;

/***** Porta Serial *****/
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const sPort = new SerialPort('COM4', {
  baudRate: BAUD
})
const parser = new Readline();
sPort.pipe(parser);

/* DEFINIÇÔES DE VARIAVEIS GLOBAIS */

//Variáveis da mensagem Firmware/backend

var msglrc = '00'; //contém o LRC
var slaveAdr = '00'; //endereço do escravo: Comodo+Objeto
var slaveRW = '0'; //0 ou 1, leitura ou escrita
var slaveAD = 'D'; //A ou D, analógico ou digital
var slaveIO = 'I'; //I(nput) para entrada, O(utput) para saída
var slaveData = '0000'; //dados do escravo, como pwm 0255, on/off 0001/0000, ou outro valor a ser convertido 0000-1023
//var mensagem = ':' + slaveAdr + slaveRW + slaveAD + slaveIO + slaveData; //+(LRC) formato padrão de mensagem

//Senha de acesso (front end)
var pass = '0000'; //padrão é '0000', deve conter 4 digitos
//tempo de fechamento da porta, em minutos
var doorCloseTime = '0001'; //padrão 1 minuto

//temperatura padrão do ar condicionado (25ºC)
var ACdeg = '0025';

//horarios de controle das janelas (formato: HHMM)
var windop = '08:00:00'; //abre totalmente as 8:00
var windhalf = '12:00:00'; //meio abertas as 12:00
var windclose = '18:00:00'; //fecha totalmente as 18:00

//valor da banda morta, que controla o aquecedor
var deadBand = '0';

//mensagem de monitoração: conterá um array de strings com dados de sensores e atuadores monitorados
var UltraMsg; //tamanho e formato: 4 caracteres * 7 itens contendo 28 caracteres no total

//mensagens de erro
var passerror = "senha incorreta";
var windalert = "Vento muito forte, janelas sendo fechadas para sua segurança."

//Hora atual
var Hora = 0;

var end01; //dispositivo de endereço 01, Porta de entrada: entrada sensor digital 24v
var end02; //dispositivo de endereço 02, Solenoide da Porta: Saída Digital 24V
var end03; //dispositivo de endereço 03, Alarme sonoro: Saída digital 5v
var end11; //dispositivo de endereço 11, Sensor Temperatura Sala de Estar: Entrada Digital 5V
var end12; //dispositivo de endereço 12, AC sala de estar remoto: (manual mode): saída analógica 5V
var end13; //dispositivo de endereço 13, Luz de estar: saída analógica 5V
var end14; //dispositivo de endereço 14, Janela de estar e jantar: sensor entrada analógico 5v de posição, Duas portas digitais de saída 24V
var end17; //dispositivo de endereço 17, Wind Speed: sensor entrada analógico 5V
var end21; //dispositivo de endereço 21, Janela do Quarto: Duas portas digitais de saída 24V, sensor de entrada analógico 5v de posição
var end24; //dispositivo de endereço 24, Luz quarto: saída analógica 5V
var end25; //dispositivo de endereço 25, Sensor de Temperatura: Entrada LM35 Analógico 4-20V
var end26; //dispositivo de endereço 26, Aquecedor: Saída Digital controlado pelo sensor de temperatura
var estado; //auxiliar

//dado anterior das janelas
var lastjanelaestar="0000";
var lastjanelaquarto="0000";
var boolnaomuda = "0";

sPort.open(function (err) {
  if(err) {
      console.log(err.message)
  }
  console.log('Porta Serial Aberta')
})


/** SE MENSAGEM >=28 E ??
 * OU SÓ SE MENSAGEM == 28??
 * SEI LA
 */
//recebendo do controlador
//tratamento de mensagens recebidas do arduino (respostas)
parser.on('data', (data) => {
  console.log('Recebido do arduino: ' + data);
  if(data.length >= monitsize){	//>=28
    /////////////     MENSAGENS DE MONITORAMENTO     /////////////
    //Formato segue conforme a descrição no arquivo disponível no docs, de item a item
    //link do docs: https://docs.google.com/document/d/10i8FvYkEybzUDhKXuwmf3X4So2C-hNTiveFeKyaUtrA/edit
	//aqui: organizar valor recebido e inserir em UltraMsg
    
	//XX0D10000
	//n precisa pegar o xx, nem Leitura/escrita, nem digital/analógico, nem entrada/saída, pois td estará na ordem de cima pra baixo
	//dos endereços no docs, ou seja, 01,02,03,11,12,13,14,15,16,17,21,22,23,24,25,26
	//pensando nisso, serão enviados apenas os dados, separadamente, de forma q o html receberá um vetor de dados na mesma ordem descrita,
	//formando 9 variaveis de tamanho 4 (36 caracteres)
    UltraMsg = data;
	estado = UltraMsg.slice(0, 4);//end01 recebe 4 primeiros caracteres (0,1,2,3) da string tam 36 (0-3 to 32-35)
	switch(estado)//estados da porta
	{
		case "0000":
			end01 = "Aberto";
			break;
		case "0001":
			end01 = "Fechado";
			break;
		case "0002":
			end01 = "Trancado";
			break;
		default:
			end01 = "Indefinido";
	}
	
	estado = UltraMsg.slice(4, 8); //end 11 temperatura sala de estar
	var aux = estado.split('');
	end11 = aux[2]+aux[3]+" ºC";
	
	
	estado = UltraMsg.slice(8, 12); //end 14 pos. janela estar/jantar 0-1024
	var aux = estado.split('');
	if(Number(aux[0]) > 0){
		end14 = aux[0]+aux[1]+aux[2]+aux[3];
	}else if(Number(aux[1]) > 0){
		end14 = aux[1]+aux[2]+aux[3];
	}else if(Number(aux[2]) > 0){
		end14 = aux[2]+aux[3];
	}else{
		end14 = aux[3];
	}
	if(lastjanelaestar == end14){
		end14 = boolnaomuda;
	}else{
		lastjanelaestar = end14;
	}
	
	
	estado = UltraMsg.slice(12, 16); //end 17 wind speed (em Km/h)
	aux = estado.split('');
	end17 = aux[1] + aux[2] + aux[3] + " Km/h"
	
	
	estado = UltraMsg.slice(16, 20); //end 21 pos. janela quarto/banheiro 0-1024
	var aux = estado.split('');
	if(Number(aux[0]) > 0){
		end21 = aux[0]+aux[1]+aux[2]+aux[3];
	}else if(Number(aux[1]) > 0){
		end21 = aux[1]+aux[2]+aux[3];
	}else if(Number(aux[2]) > 0){
		end21 = aux[2]+aux[3];
	}else{
		end21 = aux[3];
	}
	if(lastjanelaquarto == end21){
		end21 = boolnaomuda;
	}else{
		lastjanelaquarto = end21;
	}
	
	
	estado = UltraMsg.slice(20, 24); //end 25 temperatura quarto/banheiro
	var aux = estado.split('');
	end25 = aux[2]+aux[3]+" ºC";
	
	
	estado = UltraMsg.slice(24, 28);//end26 aquecedor
	switch(estado)//estados da porta
	{
		case "0000":
			end26 = "Desligado";
			break;
		case "0001":
			end26 = "Ligado";
			break;
		default:
			end26 = "Indefinido";
	}
	//console.log("Enviando ultramsg...")
	socket.emit('Monit', [end01, end11, end14, end17, end21, end25, end26]);//comunicação 'Monit', dado: end01 a end26
  }else{
	//if(data == ":170A0")//WIND ALERT AQUIIIIIIIIIIII
	var test = data.split('');//se receber msg (unica) do endereço do sensor, manda wind alert
	if(test[1] == '1' && test[2] == '7'){
		console.log("Enviando wind alert");
		socket.emit('WindLog', [windalert]);
	}
	//msg padrão ":+9+2(LRC) === 0/1,2/3/4/5/6,7,8,9/10,11"
  }
})
