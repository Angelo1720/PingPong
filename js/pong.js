const canvas = document.querySelector('canvas');
contextoCanvas = canvas.getContext('2d');

// Puntaje
let puntajeIzq = 0;
let puntajeDer = 0;
let juegoTerminado = false;

// Generar un ángulo aleatorio entre 0 y 2π (360 grados)
const angulo = Math.random() * Math.PI * 2;

// Variables de control de movimiento
let movimientoArribaPaletaIzq = false;
let movimientoAbajoPaletaIzq = false;
let movimientoArribaPaletaDer = false;
let movimientoAbajoPaletaDer = false;

const PUNTAJE_MAXIMO = 10;

class Entidad {
    constructor(x, y, ancho, altura) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.altura = altura;

        this.dx = 0;
        this.dy = 0;
    }

    init() {

    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw() {
        contextoCanvas.fillStyle = this.color;
        contextoCanvas.fillRect(this.x, this.y, this.ancho, this.altura);
    }
}

class Paleta extends Entidad {
    constructor(x, y) {
        super(x, y, 20, 100);
        this.color = '#0C54F0';
        this.velocidad = 5;
    }

    init(tipo) {
        if (tipo === 'izq') {
            this.x = 10; // Posición inicial de la paleta izquierda
        } else if (tipo === 'der') {
            this.x = canvas.width - 30; // Posición inicial de la paleta derecha
        }
        this.y = canvas.height / 2 - this.altura / 2; // Posicionar en el centro vertical
    }

    update() {
        super.update();
    }

    moverPaleta(dy) {
        this.y += dy * this.velocidad;
        if (this.y < 0) this.y = 0; // Límite superior del canvas
        if (this.y + this.altura > canvas.height)
            this.y = canvas.height - this.altura; // Límite inferior del canvas
    }
}

let paletaIzq = new Paleta();
let paletaDer = new Paleta();

class Pelota extends Entidad {
    constructor(x, y) {
        super(x, y, 10, 10);
        //Mantener la velocidad de la pelota constante independientemente del ángulo
        this.direccionX = Math.cos(angulo) * this.velocidad;
        this.direccionY = Math.sin(angulo) * this.velocidad;
        this.velocidad = 7;
    }

    init() {
        //Inicia la pelota al medio de la cancha
        this.x = canvas.width / 2 - this.ancho / 2;
        this.y = canvas.height / 2 - this.altura / 2;

        // Calcular la dirección en base al ángulo
        this.direccionX = Math.cos(angulo);
        this.direccionY = Math.sin(angulo);
    }

    draw() {
        super.draw();
        contextoCanvas.beginPath();
        contextoCanvas.arc(this.x + this.ancho / 2, this.y + this.altura / 2, this.ancho, 0, Math.PI * 2);
        contextoCanvas.fill();
        contextoCanvas.closePath();
    }
}

let pelota = new Pelota();

function borrarLienzo() {
    contextoCanvas.clearRect(0, 0, canvas.width, canvas.height);
}

function init() {
    paletaIzq.init('izq');
    paletaDer.init('der');
    pelota.init();
}

//Manejo de teclado para mover las paletas
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') movimientoArribaPaletaDer = true;
    if (event.key === 'ArrowDown') movimientoAbajoPaletaDer = true;
    if (event.key === 'w') movimientoArribaPaletaIzq = true;
    if (event.key === 's') movimientoAbajoPaletaIzq = true;
});
document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp') movimientoArribaPaletaDer = false;
    if (event.key === 'ArrowDown') movimientoAbajoPaletaDer = false;
    if (event.key === 'w') movimientoArribaPaletaIzq = false;
    if (event.key === 's') movimientoAbajoPaletaIzq = false;
});

function update() {
    // Controlar movimiento de la paleta izquierda (W y S)
    if (movimientoArribaPaletaIzq) paletaIzq.moverPaleta(-1);
    if (movimientoAbajoPaletaIzq) paletaIzq.moverPaleta(1);

    // Controlar movimiento de la paleta derecha (Flechas arriba y abajo)
    if (movimientoArribaPaletaDer) paletaDer.moverPaleta(-1);
    if (movimientoAbajoPaletaDer) paletaDer.moverPaleta(1);

    // Movimiento de la pelota
    pelota.x += pelota.direccionX * pelota.velocidad;
    pelota.y += pelota.direccionY * pelota.velocidad;

    // Colisiones con el borde superior e inferior
    if (pelota.y <= 0 || pelota.y + pelota.altura >= canvas.height) {
        pelota.direccionY *= -1; // Cambia la dirección vertical
    }

    // Colisiones con las paletas
    if (pelota.x <= paletaIzq.x + paletaIzq.ancho &&
        pelota.x + pelota.ancho >= paletaIzq.x &&
        pelota.y <= paletaIzq.y + paletaIzq.altura &&
        pelota.y + pelota.altura >= paletaIzq.y) {
        pelota.direccionX *= -1; // Cambia la dirección horizontal
        pelota.velocidad += 1;
        paletaIzq.velocidad += 0.5;
    }
    if (pelota.x <= paletaDer.x + paletaDer.ancho &&
        pelota.x + pelota.ancho >= paletaDer.x &&
        pelota.y <= paletaDer.y + paletaDer.altura &&
        pelota.y + pelota.altura >= paletaDer.y) {
        pelota.direccionX *= -1; // Cambia la dirección horizontal
        pelota.velocidad += 1;
        paletaDer.velocidad += 0.5;
    }

    function resetearPelota() {
        pelota.x = canvas.width / 2 - pelota.ancho / 2;
        pelota.y = canvas.height / 2 - pelota.altura / 2;

        // Generar un nuevo ángulo de movimiento aleatorio
        const nuevoAngulo = Math.random() * Math.PI * 2;
        pelota.direccionX = Math.cos(nuevoAngulo);
        pelota.direccionY = Math.sin(nuevoAngulo);
        pelota.velocidad = 3; // Restablecer la velocidad
    }

    // Verificar si la pelota sale del canvas
    if (pelota.x + pelota.ancho < 0) { // Sale por la izquierda
        puntajeDer += 1;
        resetearPelota();
    } else if (pelota.x > canvas.width) { // Sale por la derecha
        puntajeIzq += 1;
        resetearPelota();
    }

    // Verificar si alguien ganó
    if (puntajeIzq >= PUNTAJE_MAXIMO || puntajeDer >= PUNTAJE_MAXIMO) {
            juegoTerminado = true; // Terminar el juego
            console.log(puntajeIzq >= PUNTAJE_MAXIMO ? "¡Ganó el jugador izquierdo!" : "¡Ganó el jugador derecho!");
        }

}

function draw() {
    borrarLienzo();

    //Dibujo la cancha
    contextoCanvas.fillStyle = '#A1F00C';
    contextoCanvas.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujo la red en el centro
    contextoCanvas.fillStyle = '#3E4E70';
    let tamanoSegmentoRed = 20;  // Tamaño de cada segmento de la red
    for (let i = 0; i < canvas.height; i += tamanoSegmentoRed * 2) {
        contextoCanvas.fillRect(canvas.width / 2 - 1, i, 4, tamanoSegmentoRed);
    }

    // Mostrar puntajes
    contextoCanvas.fillStyle = '#3E4E70';
    contextoCanvas.font = '30px Arial';
    contextoCanvas.fillText(puntajeIzq, canvas.width / 4, 50); // Puntaje del jugador izquierdo
    contextoCanvas.fillText(puntajeDer, (canvas.width / 4) * 3, 50); // Puntaje del jugador derecho

    //Dibujo las paletas y la pelota
    paletaIzq.draw();
    paletaDer.draw();
    pelota.draw();

}

function gameloop() {
    update();
    draw();
    requestAnimationFrame(gameloop);
}

init();
gameloop();