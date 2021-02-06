// Esto es para el modal
$('#myModal').on('shown.bs.modal', function() {
    $('#myInput').trigger('focus')
})

// Esto hace que rover pueda moverse con W D A S
var movimiento = function(event) {
    if (event.key == 'w') {
        up();
    }
    if (event.key == 'd') {
        right();
    }
    if (event.key == 'a') {
        left();
    }
    if (event.key == 's') {
        down();
    }
}

/*.............VARIABLES.............*/

var segundos = 60;
numerobombas = 3;
nivel = 1;
// Implementar la puntuación
puntuacion = 0;

numColums = 6;
numFilas = 7;
var minas = [];


// Nuestro objeto rover que será el robot que utilizamos en el juego
var rover = new Object();
rover.x = 5;
rover.y = 0;
rover.imagen = "img/rover.svg";

// Nuesta casilla de salida tambien la voy a considerar como un objeto
var salida = new Object();
salida.x = 0;
salida.y = 6;

/*.............FUNCIONES.............*/
//Función play para llamar a las demás funciones
function play() {
    window.addEventListener("keydown", movimiento);
    // Volvemos a poner el rover en su sítio, la casilla y las dimensiones del tablero
    minas = [];
    rover.x = 5;
    rover.y = 0;
    numColums = 6;
    numFilas = 7;
    salida.x = 0;
    salida.y = 6;
    segundos = 61;
    puntuacion = 0;
    numerobombas = 3;
    nivel = 1;
    crearTablero(numColums, numFilas);
    document.getElementById("puntuacion").innerHTML = puntuacion;
    document.getElementById("nivel").innerHTML = nivel;
    document.getElementById("minas").innerHTML = numerobombas;
    document.getElementById("botonesMoverse").style.visibility = "visible";
    document.getElementById("empezar").style.visibility = "hidden";
    document.getElementById("info").style.visibility = "visible";
    document.getElementById("pista").style.visibility = "visible";
    ponerBombasEnBlanco();
    ponerBombas();
    pintar();
    cronometro();

}
// Funcion para meter minas
function ponerBombas() {
    for (let i = 0; i < numerobombas; i++) {
        Bfila = Math.floor(Math.random() * numFilas);
        Bcolum = Math.floor(Math.random() * numColums);

        if ((minas[Bcolum][Bfila] == 1) || (Bcolum == rover.x && Bfila == rover.y) || (Bcolum == salida.x && Bfila == salida.y) || comprobarMinas(Bcolum, Bfila)) {
            while ((minas[Bcolum][Bfila] == 1) || (Bcolum == rover.x && Bfila == rover.y) || (Bcolum == salida.x && Bfila == salida.y) || comprobarMinas(Bcolum, Bfila)) {
                Bfila = Math.floor(Math.random() * numFilas);
                Bcolum = Math.floor(Math.random() * numColums);
            }
        }

        minas[Bcolum][Bfila] = 1;
    }
    // Esto nos muestra toda la matriz con minas por consola
    //console.log(minas);
}

function crearTablero(numColums, numFilas) {
    for (let i = 0; i < numColums; i++) {
        minas[i] = []
        for (let j = 0; j < numFilas; j++) {
            minas[i][j] = 0;
        }
    }

}


// Creación de la matríz con las minas
function ponerBombasEnBlanco() {
    for (let i = 0; i < minas.length; i++) {
        for (let j = 0; j < minas[i].length; j++) {
            minas[i][j] = 0;
        }
    }
}

// Comprueba según la posición que le hemos dado
// Si hay una mina cerca para no ponerla al lado
function comprobarMinas(Mcolum, Mfila) {
    aux = false;

    if (Mcolum > 0) {
        // Mira si arriba hay bomba
        if (minas[Mcolum - 1][Mfila] == 1) {

            aux = true;
        }
    }

    if (Mcolum < numColums - 1) {
        // Mira si abajo hay bomba
        if (minas[Mcolum + 1][Mfila] == 1) {
            aux = true;
        }
    }

    if (Mfila > 0) {
        // Mira si a la izquierda hay bomba
        if (minas[Mcolum][Mfila - 1] == 1) {
            aux = true;
        }
    }

    if (Mfila < numFilas - 1) {
        // Mira si a la derecha hay mina
        if (minas[Mcolum][Mfila + 1] == 1) {
            aux = true;
        }
    }

    return aux;

}


// Creación del tablero en el cual vamos a jugar
function pintar() {
    var tablero = document.getElementById("zona_juego");
    var fila = "";
    for (i = 0; i < minas.length; i++) {

        fila += ("<div class= 'd-flex'>");

        for (j = 0; j < minas[i].length; j++) {

            if (rover.x == i && rover.y == j) {
                if (rover.x == salida.x && rover.y == salida.y) {
                    fila += "<div class='ganar'></div>";
                } else if (comprobarMinasRover2posiciones() || comprobarMinasRover1posicion()) {
                    if (comprobarMinasRover1posicion()) {
                        fila += "<div class='roverRojo' id='muñeco'></div>";
                    } else {
                        fila += "<div class='roverAmarrillo' id='muñeco'></div>";
                    }
                } else {
                    fila += "<div class='rover' id='muñeco'></div>";
                }
                //Esto es para ver las minas, después hay que quitarlo
                /*} else if (minas[i][j] == 1) {
                    fila += "<div class='minita'></div>";*/
            } else if (salida.x == i && salida.y == j) {
                fila += "<div class='salida'></div>";
            } else if (minas[i][j] == 888) {
                fila += "<div class='camino'></div>";
            } else {
                fila += "<div class='tablero'></div>";
            }

        }

        fila += "</div>";
    }
    tablero.innerHTML = fila;

}

// Comprobar minas alrededor de rover
// En este caso las que están a dos posiciones
function comprobarMinasRover2posiciones() {
    aux = false;

    if (rover.x + 2 < numColums && minas[rover.x + 2][rover.y] == 1) {
        aux = true;
    }

    if (rover.x - 2 >= 0 && minas[rover.x - 2][rover.y] == 1) {
        aux = true;
    }

    if (rover.y + 2 < numFilas && minas[rover.x][rover.y + 2] == 1) {
        aux = true;
    }

    if (rover.y - 2 >= 0 && minas[rover.x][rover.y - 2] == 1) {
        aux = true;
    }

    return aux;

}
// Comprobrar las minas a 1 posición 
function comprobarMinasRover1posicion() {
    aux = false;

    if (rover.x + 1 < numColums && minas[rover.x + 1][rover.y] == 1) {
        aux = true;
    }

    if (rover.x - 1 >= 0 && minas[rover.x - 1][rover.y] == 1) {
        aux = true;
    }

    if (rover.y + 1 < numFilas && minas[rover.x][rover.y + 1] == 1) {
        aux = true;
    }

    if (rover.y - 1 >= 0 && minas[rover.x][rover.y - 1] == 1) {
        aux = true;
    }
    return aux;

}

// Función para el bajar el tiempo en el inicio tenemos un tiempo máximo y luego va disminuyendo
function cronometro() {
    crono = setInterval(function() {
        segundos--;
        document.getElementById("tiempo").innerHTML = segundos;
        if (segundos == 0) {
            clearInterval(crono);
            segundos = 60;
            document.getElementById("tiempo").innerHTML = segundos;
            document.getElementById("nivelfinal").innerHTML = nivel;

            // Poner aquí un modal en vez de un alert 
            $('#timeout').modal('show');
            document.getElementById("puntuacionfinal").innerHTML = puntuacion;
            document.getElementById("botonesMoverse").style.visibility = "hidden";
            document.getElementById("empezar").style.visibility = "visible";
            document.getElementById("pista").style.visibility = "hidden";
            window.removeEventListener("keydown", movimiento);
        }
    }, 1000)
}

// Funcion para moverse. se llama también a la función blink
function up() {
    if (rover.x == 0 || minas[rover.x - 1][rover.y] == 888) {
        blink();
    } else {
        minas[rover.x][rover.y] = 888;
        rover.x -= 1;
        pintar();
        explotar();
        finalizar();

    }
}

function left() {
    if (rover.y == 0 || minas[rover.x][rover.y - 1] == 888) {
        blink();
    } else {
        minas[rover.x][rover.y] = 888;
        rover.y -= 1;

        pintar();
        explotar();
        finalizar();

    }
}

function down() {
    if (rover.x == numColums - 1 || minas[rover.x + 1][rover.y] == 888) {
        blink();
    } else {
        minas[rover.x][rover.y] = 888;
        rover.x += 1;

        pintar();
        explotar();
        finalizar();

    }
}

function right() {
    if (rover.y == numFilas - 1 || minas[rover.x][rover.y + 1] == 888) {
        blink();
    } else {
        minas[rover.x][rover.y] = 888;
        rover.y += 1;
        pintar();
        explotar();
        finalizar();

    }
}

// Funcion que verifica si rover esta sobre la mina y explota
function explotar() {

    if (minas[rover.x][rover.y] == 1) {
        //document.getElementById("muñeco").style.backgroundImage = "url('./img/skull.svg')";
        document.getElementById("muñeco").style.backgroundColor = "black";
        document.getElementById("botonesMoverse").style.visibility = "hidden";
        document.getElementById("empezar").style.visibility = "visible";
        document.getElementById("pista").style.visibility = "hidden";
        $('#explotar').modal('show');
        document.getElementById("nivelfinalexplo").innerHTML = nivel;
        document.getElementById("puntuacionfinalexplo").innerHTML = puntuacion;
        clearInterval(crono);
        window.removeEventListener("keydown", movimiento);

    }

}

// La función blink pone el background a negro durante un tiempo
// y luego vuelve a pintar lo que está en la clase pintar
function blink() {

    setTimeout(function() {
        document.getElementById("muñeco").style.background = 'black';
    }, 200);

    setTimeout(function() {
        pintar();
    }, 500);
}

// Función para finalizar el juego 
function finalizar() {
    if (rover.x == salida.x && rover.y == salida.y && !explotar()) {
        puntuar();
        clearInterval(crono);
        document.getElementById("botonesMoverse").style.visibility = "hidden";
        document.getElementById("pista").style.visibility = "hidden";

        $('#victoria').modal('show');
    }
}

// Funcion para puntuar
function puntuar() {
    time = document.getElementById("tiempo");
    puntuacion = segundos * 10 + puntuacion;
    document.getElementById("puntuacion").innerHTML = puntuacion;
}

// Funcion para el boton de pista
function pista() {
    Afila = Math.floor(Math.random() * numFilas);
    Acolum = Math.floor(Math.random() * numColums);

    puntuacion -= 20;
    document.getElementById("puntuacion").innerHTML = puntuacion;
    document.getElementById("pista").style.visibility = "hidden";

    while (minas[Acolum][Afila] != 1) {
        Afila = Math.floor(Math.random() * numFilas);
        Acolum = Math.floor(Math.random() * numColums);
    }

    var tablero = document.getElementById("zona_juego");
    var fila = "";
    for (i = 0; i < minas.length; i++) {

        fila += ("<div class= 'd-flex'>");

        for (j = 0; j < minas[i].length; j++) {

            if (rover.x == i && rover.y == j) {
                if (rover.x == salida.x && rover.y == salida.y) {
                    fila += "<div class='ganar'></div>";
                } else if (comprobarMinasRover2posiciones() || comprobarMinasRover1posicion()) {
                    if (comprobarMinasRover1posicion()) {
                        fila += "<div class='roverRojo' id='muñeco'></div>";
                    } else {
                        fila += "<div class='roverAmarrillo' id='muñeco'></div>";
                    }
                } else {
                    fila += "<div class='rover' id='muñeco'></div>";
                }

                // Esto es para ver las minas, después hay que quitarlo
                /*} else if (minas[i][j] == 1) {
                    fila += "<div class='minita'></div>";*/
            } else if (Acolum == i && Afila == j) {
                fila += "<div class='bomba'></div>";
            } else if (salida.x == i && salida.y == j) {
                fila += "<div class='salida'></div>";
            } else if (minas[i][j] == 888) {
                fila += "<div class='camino'></div>";
            } else {
                fila += "<div class='tablero'></div>";
            }

        }

        fila += "</div>";
    }
    tablero.innerHTML = fila;

}
// Función como la de play() pero con mejoras respecto al juego original.
function siguienteNivel() {
    window.addEventListener("keydown", movimiento);
    ponerBombasEnBlanco();
    numerobombas++;
    nivel++;
    segundos = 61;
    condiNiveles(nivel);
    crearTablero(numColums, numFilas);
    document.getElementById("puntuacion").innerHTML = puntuacion;
    document.getElementById("nivel").innerHTML = nivel;
    document.getElementById("minas").innerHTML = numerobombas;
    document.getElementById("botonesMoverse").style.visibility = "visible";
    document.getElementById("empezar").style.visibility = "hidden";
    document.getElementById("info").style.visibility = "visible";
    document.getElementById("pista").style.visibility = "visible";
    ponerBombas();
    pintar();
    cronometro();
}

// Condiciones para los siguientes niveles
// La posición de rover, salida y el tamaño del tablero cambian 
function condiNiveles(nivel) {
    switch (nivel) {
        case 1:
        case 2:
            rover.x = 5;
            rover.y = 0;
            numColums = 6;
            numFilas = 7;
            salida.y = 6;
            break;

        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
            rover.x = 6;
            rover.y = 0;
            numColums = 7;
            numFilas = 8;
            salida.y = 7;
            break;
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
            rover.x = 7;
            rover.y = 0;
            numColums = 8;
            numFilas = 9;
            salida.y = 8;
            break;
        case 18:
        case 19:
        case 20:

            rover.x = 8;
            rover.y = 0;
            numColums = 9;
            numFilas = 10;
            salida.y = 9;
            break;
        case 21:
        case 22:
        case 23:
            rover.x = 9;
            rover.y = 0;
            numColums = 10;
            numFilas = 11;
            salida.y = 10;
            break;
        case 24:
        case 25:
        case 26:
            rover.x = 10;
            rover.y = 0;
            numColums = 11;
            numFilas = 12;
            salida.y = 11;
            break;
        case 27:
        case 28:
        case 29:
            rover.x = 11;
            rover.y = 0;
            numColums = 10;
            numFilas = 13;
            salida.y = 12;
            break;
    }
}