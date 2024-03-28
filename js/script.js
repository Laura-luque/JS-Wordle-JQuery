const wordle = (function () {
    const palabras = ["CIELO", "PERRO", "SILLA", "MANGO", "TOMAR", "COCER", "BOLSA", "LUNES", "MORIR", "CEPIL", "TENER", "CORTE", "ZANJA", "HUEVO", "LINEA", "MONTA", "GALLO", "POLLO", "LECHE", "FUEGO", "COLOR", "JABON", "FUMAR", "JAPON", "BOLSA", "MILKA", "PLATO", "COCER", "CANTO", "PISTA", "HACER", "PASAR", "POEMA", "GRITO", "CARGA", "CAMPO", "GUSTO", "SILLA", "HOJAS", "FRESA", "ROJO", "VOLAR", "PASAR", "SALIR", "PARED", "ZURDO", "ZURDO", "PASTA", "AMIGO", "FUGAZ", "VERDE", "CIELO", "PLUMA", "ZORRO", "ABRIR", "COFRE", "MANOS", "RELOJ", "FELIZ", "VELAS", "GENTE", "VIVIR", "BRAZO", "NUEVO", "BRAZO", "PRISA", "LEÑAR", "DIANA", "ALMAS", "LUCHA", "PISAR", "VERBO", "FLOTA", "SABER", "VIRAL", "TALAR", "TALON", "DARDO", "PLACA", "CACAO", "DULCE", "DONAR", "PATIO", "MALTA", "CESTA", "BANDA", "MEDIO", "GASTO", "CELOS", "COLZA", "PASOS", "HORNO", "CALVO", "MELON", "CAMPO", "CRUZA", "MANGO", "ZORRO"];

    let palabraElegida = '';
    let intentosRestantes = 5;
    let solucion = ["","","","",""];

    const comprobar = function (intento) {
        intento = intento.split("");
        const restoPalabras = [...palabraElegida];

        intento.forEach((letra, index) => {
            if (letra === palabraElegida[index]) {
                solucion[index] = 'v';
                restoPalabras.splice(restoPalabras.indexOf(letra), 1);
            }
        });
        intento.forEach((letra, index) => {
            if (letra !== palabraElegida[index]) {
                const restoIndex = restoPalabras.indexOf(letra);
                if (restoIndex !== -1) {
                    solucion[index] = 'a';
                    restoPalabras.splice(restoIndex, 1);
                } else {
                    solucion[index]='g';
                }
            }
        });

        if (solucion.every(letra => letra === 'v')) {
            console.log('HAS GANADO!!');
        } else {
            intentosRestantes--;
        }
        return solucion;
    }

    const init = function () {
        console.log('########-Wordle-########');
        do {
            randomIndex = Math.floor(Math.random() * palabras.length);
            palabraElegida = palabras[randomIndex];
        } while (!palabraElegida);
        mostrar(); // Para no dar pistas en consola, activar si se quiren pistas
    }

    const mostrar = function () {
        console.log(palabraElegida);
    }

    return {
        init: init,
        comprobar: comprobar,
        mostrar: mostrar,
        intentosRestantes: intentosRestantes
    };
})();

$(document).ready(function () {
    let indiceCuadrado = 0;
    let filaActual = 0;

    // Creación titulo
    let titulo = $('<h1>').text("Wordle");
    $('body').append(titulo);

    // Creación contenedor padre
    let contenedorPadre = $('<div>').attr('id', 'contenedorPadre');
    $('body').append(contenedorPadre);

    // Creación tablero juego letras
    let tablero = $('<div>').addClass('tablero');

    Array.from({ length: 6 }).forEach(() => {
        let filas = $('<div>').addClass('filas');

        Array.from({ length: 5 }).forEach(() => {
            let cuadrado = $('<div>').addClass('vacio');
            filas.append(cuadrado);
        });
        tablero.append(filas);
    });
    contenedorPadre.append(tablero);

    // Creación teclado
    let teclado = $('<div>').addClass('teclado');

    let teclasArriba = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    let teclasMedio = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'];
    let teclasAbajo = ['ENVIAR', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'];

    let banTeclas = ['ENVIAR', 'BACK'];

    let tecladoArriba = $('<div>').addClass('tecladoArriba');
    teclasArriba.forEach((e) => {
        let letra = $('<button>').addClass(e).text(e);
        tecladoArriba.append(letra);
    })
    teclado.append(tecladoArriba);

    let tecladoMedio = $('<div>').addClass('tecladoMedio');
    teclasMedio.forEach((e) => {
        let letra = $('<button>').addClass(e).text(e);
        tecladoMedio.append(letra);
    })
    teclado.append(tecladoMedio);

    let tecladoAbajo = $('<div>').addClass('tecladoAbajo');
    teclasAbajo.forEach((e) => {
        let letra = $('<button>').addClass(e).text(e);
        tecladoAbajo.append(letra);
    })
    teclado.append(tecladoAbajo);

    $('#contenedorPadre').append(teclado);

    $('div div div').eq(0).addClass('activa'); // Para seleccionar con la primera fila

    const botonesTeclado = $('.teclado button');
    const cuadrados = $('.tablero .vacio');

    const avanzarFila = function () {
        const filas = $('.filas');
        if (filaActual < filas.length - 1) {
            filas.eq(filaActual).removeClass('activa');
            filaActual++;
            filas.eq(filaActual).addClass('activa');

            const cuadradosFila = filas.eq(filaActual).find('.vacio');
            indiceCuadrado = cuadradosFila.length > 0 ? cuadradosFila.first().index() : 0;
        } else {
            console.log('Has llegado al final del juego');
        }
    };

    botonesTeclado.each(function () {
        $(this).on('click', function () {
            const letra = $(this).attr('class');
            if (banTeclas.includes(letra)) {
                return;
            } else {
                if (indiceCuadrado % 6 !== 5) {
                    const vacio = $('.activa .vacio').eq(indiceCuadrado % 6);
                    vacio.text(letra);
                    vacio.data('letra', letra);
                    vacio.removeClass('relleno-verde relleno-amarillo relleno-gris').addClass('relleno');
                    indiceCuadrado++;
                }
            }
        });
    });

    const botonBack = $('.tecladoAbajo .BACK');

    botonBack.on('click', () => {
        if (indiceCuadrado > 0) {
            const cuadrado = $('.activa .relleno').eq(indiceCuadrado-1);
            indiceCuadrado--;
            cuadrado.data('letra', '').text('').removeClass().addClass('vacio');
        }
    });

    const botonEnviar = $('.teclado .ENVIAR');

    botonEnviar.on('click', function () {
        const solucion = wordle.comprobar($('.activa').text());
        const cuadradosActivos = $('.tablero .activa .relleno');
    
        if (cuadradosActivos.length === 5) {
            cuadradosActivos.each(function (index) {
                $(this).removeClass('relleno-verde relleno-amarillo relleno-gris');
                if (solucion[index] === 'v') {
                    $(this).addClass('relleno-verde');
                } else if (solucion[index] === 'a') {
                    $(this).addClass('relleno-amarillo');
                } else {
                    $(this).addClass('relleno-gris');
                }
            });
            
            cuadradosActivos.hide().fadeIn(500);
    
            if (!solucion.every(letra => letra === 'v')) {
                avanzarFila();
            }
        } else {
            console.log('Fila no completa');
        }
    });

    //module pattern
    wordle.init();
});
