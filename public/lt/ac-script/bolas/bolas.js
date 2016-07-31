//Configurar tamaño de gráficas
var width = 250,
    height = 250,
    margin = 10,
    radiusPie = Math.min(width, height) / 2,
    radioBolasSexo = radiusPie - 30
radioBolas = radiusPie - 20; // Radio para centro de bolas

var contGrafs = '.lt-cont-grafs';

// Paleta de color
var colorBolas = d3.scale.ordinal()
    .range(['#241C66', '#5FECE2', '#F7ED79', '#084FE5', '#B80D80', '#7CECB4', '#662482']);

function limpiar(l) {
    l.closest('.lt-ind').find('.lt-cont-grafs').html("");
}
/*
=====================
Cargar General
=====================
*/
function cargarGeneral() {

    var miBoton = $(this);

    limpiar(miBoton);

    var indCont = $(this).closest('.lt-ind');

    d3.xhr("/servicios/getmultiple")
    .header("Content-Type", "application/json")  
    .post(
     JSON.stringify({indicador: 40, vista: "general", tipografico: 'estrella'}), function(error, data) {
         data = JSON.parse(data.response);
        var datos = data,
            idInd = datos[0].indicador,
            numDatos = datos.length,
            dAnidadosG = d3.nest()
            .key(function(d) {
                return d.territorio;
            })
            .entries(datos);

        bolasEstructura("gnrl", datos, idInd);

        var dAnidadosTyG = d3.nest()
            .key(function(d) {
                return d.territorio;
            })
            .key(function(d) {
                return d.indicador;
            })
            .entries(datos);

        for (i = 0; i < dAnidadosTyG.length; i++) {
            var t = dAnidadosTyG[i].key.substring(0, 3),
                miDiv = "#lt-" + idInd + "-gnrl-" + t + "",
                miDato = dAnidadosTyG[i].values,
                escala = [2, 58]
            carga = -200;
            bolasSimples(miDiv, miDato, idInd, "gnrl", escala, carga);
        }
    }); //Fin de data
} //Fin de cargar general

function cargarSexo() {

    var miBoton = $(this);

    limpiar(miBoton);

    var indCont = $(this).closest('.lt-ind');

    d3.xhr("/servicios/getmultiple")
    .header("Content-Type", "application/json")  
    .post(
     JSON.stringify({indicador: 40, vista: "sexo", tipografico: 'estrella'}), function(error, data) {
data = JSON.parse(data.response);
        var datos = data;
        var idInd = datos[0].indicador;
        var numDatos = datos.length;

        //**En edad se anidada por edad
        var dAnidadosS = d3.nest()
            .key(function(d) {
                return d.sexo;
            })
            .entries(datos);

        //Crear botones
        var btnsSexo = d3.select(contGrafs).append('div')
            .attr('class', 'lt-nav-edad')
            .selectAll('div')
            .data(dAnidadosS)
            .enter()
            .append('a')
            .attr({
                'class': 'lt-btn-check lt-btn-check-sexo activo',
                'data-ltsexo': function(d) {
                    var sexo = d.key.substring(0, 1);
                    return 'sexo-' + sexo + '';
                },
                'href': '#'
            })
            .text(function(d) {
                return '' + d.key + '';
            });

        bolasEstructura("sexo", datos, idInd);

        var dAnidadosTyS = d3.nest()
            .key(function(d) {
                return d.territorio;
            })
            .key(function(d) {
                return d.sexo;
            })
            .entries(datos);

        for (i = 0; i < dAnidadosTyS.length; i++) {
            var t = dAnidadosTyS[i].key.substring(0, 3),
                miDiv = "#lt-" + idInd + "-sexo-" + t + "",
                miDato = dAnidadosTyS[i].values,
                escala = [2, 108]
            carga = -70;
            bolasSimples(miDiv, miDato, idInd, "sexo", escala, carga);
        }
    }); //Fin de data
} //Fin de cargar sexo

function cargarEdad() {

    var miBoton = $(this);

    limpiar(miBoton);

    var indCont = $(this).closest('.lt-ind');

    d3.xhr("/servicios/getmultiple")
    .header("Content-Type", "application/json")  
    .post(
     JSON.stringify({indicador: 40, vista: "edad", tipografico: 'estrella'}), function(error, data) {
data = JSON.parse(data.response);
        var datos = data;
        var idInd = datos[0].indicador;
        var numDatos = datos.length;

        //**En edad se anidada por edad
        var dAnidadosE = d3.nest()
            .key(function(d) {
                return d.edad;
            })
            .entries(datos);

        //Crear botones

        var btnsEdad = d3.select(contGrafs).append('div')
            .attr('class', 'lt-nav-edad')
            .selectAll('div')
            .data(dAnidadosE)
            .enter()
            .append('a')
            .attr({
                'class': 'lt-btn-check lt-btn-check-edad activo',
                'data-ltedad': function(d) {
                    var edad = d.key.replace(/\+/g, '');
                    return 'gEdad-' + edad + '';
                },
                'href': '#'
            })
            .text(function(d) {
                return '' + d.key + '';
            });

        bolasEstructura("edad", datos, idInd);

        var dAnidadosTyE = d3.nest()
            .key(function(d) {
                return d.territorio;
            })
            .key(function(d) {
                return d.edad;
            })
            .entries(datos);

        for (i = 0; i < dAnidadosTyE.length; i++) {
            var t = dAnidadosTyE[i].key.substring(0, 3),
                miDiv = "#lt-" + idInd + "-edad-" + t + "",
                miDato = dAnidadosTyE[i].values,
                escala = [2, 28]
            carga = -30;
            bolasSimples(miDiv, miDato, idInd, "edad", escala, carga);
        }
    }); //Fin de data
} //Fin de cargar edad

function bolasEstructura(vista, losDatos, idInd) {

    var dAnidados = d3.nest()
        .key(function(d) {
            return d.territorio;
        })
        .entries(losDatos);

    //Número de territorios = número de columnas
    var numCols = 12 / dAnidados.length;

    //Crear fila y columnas
    var ltCols = d3.select(contGrafs).append("div")
        .attr("class", "row lt-grafs")
        .selectAll("div")
        .data(dAnidados)
        .enter()
        .append("div")
        .attr("class", "col-sm-" + numCols + "");

    //Agregar título de territorio	
    ltCols.append('h5')
        .attr('class', 'lt-tit-territorio')
        .text(function(d) {
            return '' + d.key + '';
        });

    //Agregar div que contendrá cada gráfica svg
    //**En edad -gnrl- cambia por -edad-
    var ltGraf = ltCols.append("div")
        .attr("class", "lt-graf")
        .attr("id", function(d) {
            var terr = d.key.substring(0, 3);
            return "lt-" + idInd + "-" + vista + "-" + terr + "";
        });

    //Espacio para tooltip
    // Define the div for the tooltip
    var div = ltGraf.append("div")
        .attr("class", "lt-tooltip-bolas")
        .style("display", "none");

    //Svg contenedor
    var svg = ltGraf.append('svg')
        .attr('width', width)
        .attr('height', height);

    // Contenedor de torta	
    svg.append('g')
        .attr('class', 'lineas-pie')
        .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');

    // Contenedor de bolas			
    svg.append('g')
        .attr('class', 'cont-bolas')
        .attr('transform', 'translate(' + (width / 4) +
            ',' + (height / 4) + ')');

    //Agregar convenciones
    var conv = d3.select(contGrafs).append("div")
        .attr("class", "row lt-bolas-conv")
        .selectAll("div")
        .data(losDatos[0].datos)
        .enter()
        .append("div")
        .attr("class", "col-sm-4")
        .append('a')
        .attr('class', 'lt-btn-bolas')
        .attr('href', '#')
        .attr('data-ltbola', function(d, i) {
            return 'rta-bola-' + i + '';
        })

    conv.append('span')
        .attr('class', function(d, i) {
            return 'lt-color-conv lt-color-conv-' + i + '';
        });

    conv.append('span')
        .attr('class', 'lt-label-conv')
        .text(function(d) {
            return '' + d.respuesta + '';
        });


}

function bolasSimples(miDiv, miDato, idInd, laVista, escala, carga) {

    var arrayPlano = [];

    var centros = [];

    var porcionPie = 100 / miDato.length;

    var pieArray = miDato.map(function(obj) {
        var rObj = {
            key: obj.key,
            porcion: porcionPie,
            vista: laVista,
            values: obj.values
        };
        return rObj;
    });


    //Parte de generar Pie
    //Radio del pie
    var arc = d3.svg.arc()
        .outerRadius(radiusPie - margin)
        .innerRadius(0);

    var labelArc = d3.svg.arc()
        .outerRadius(radiusPie - 5)
        .innerRadius(radiusPie - margin);

    var pie = d3.layout.pie()
        .value(function(d) {
            return d.porcion;
        })
        .sort(null);

    var g = d3.select(miDiv).select('.lineas-pie').selectAll("g")
        .data(pie(pieArray))
        .enter().append("g")
        .attr('class', function(d) {
            var desG = (d.data.vista === "edad") ? 'gEdad-' + d.data.key.replace(/\+/g, '') :
                (d.data.vista === "sexo") ? 'sexo-' + d.data.key.substring(0, 1) :
                "";

            return 'lt-bolas-porcion ' + desG;
        });



    //Dibujar las porciones
    var porcion = g.append("path")
        .attr("d", arc);

    //Dibujar las lineas de los labels	
    g.append("path")
        .attr("d", labelArc);

    //Agregar labels
    g.append("text")
        .text(function(d) {
            return d.data.key;
        })
        .attr('text-anchor', 'middle')
        .attr("transform", function(d) {
            var midAngle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;

            return "translate(" + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] + ") rotate(" + (midAngle * 180 / Math.PI) + ")";
        })
        .attr("dy", ".35em");

    //Circulos de referencia
    g.append('circle')
        .attr('r', '3')
        .attr('fill', 'red')
        .attr('class', 'lt-bolas-circ-referencia')
        .attr("cx", function(d) {
            centros.push(arc.centroid(d));
            return arc.centroid(d)[0];
        }).attr("cy", function(d) {
            return arc.centroid(d)[1];
        });

    //Formatear centros para la función tick
    var centrosMap = centros.map(function(obj, i) {
        var nX = obj[0],
            nY = obj[1],
            h = Math.sqrt(nX * nX + nY * nY);

        nX = nX / h * radioBolas;
        nY = nY / h * radioBolas;

        var rObj = {
            x: nX,
            y: nY
        };
        return rObj;
    });
    //Fin de generar Pie

    miDato.forEach(function(a, ia) {
        a.values.forEach(function(p, ip) {
            p.datos.forEach(function(h, ih) {
                arrayPlano.push({
                    indicador: p.indicador,
                    clave: a.key,
                    territorio: p.territorio,
                    respuesta: h.respuesta,
                    rtaClase: 'rta-bola-' + ih,
                    nDes: ia,
                    valor: h.valor,
                    vista: laVista
                });
            });

        });
    });

    var escalaBolas = d3.scale.linear()
        .domain([0, 1])
        .range(escala);

    //Función para impedir que los grandes tapen a los chiquitos
    arrayPlano.sort(function(a, b) {
        return b.valor - a.valor
    });

    var force = d3.layout.force()
        .nodes(arrayPlano)
        .links([])
        .charge(carga)
        .gravity(0.1)
        .friction(0.8)
        .size([width, height])
        .on("tick", tick) //Aqui está el error
        .start();

    var node = d3.select(miDiv).select('.cont-bolas').selectAll("circle")
        .data(arrayPlano)
        .enter()
        .append("circle")
        .attr("class", function(d) {
            var rta = d.rtaClase,
                desG = (d.vista === "edad") ? 'gEdad-' + d.clave.replace(/\+/g, '') :
                (d.vista === "sexo") ? 'sexo-' + d.clave.substring(0, 1) :
                "";
            return "node " + rta + ' ' + desG;
        })
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        })
        .attr('data-' + laVista, function(d) {
            var desG = (d.vista === "edad") ? 'gEdad-' + d.clave.replace(/\+/g, '') :
                (d.vista === "sexo") ? 'sexo-' + d.clave.substring(0, 1) :
                "general";
            return desG;
        })
        .attr('data-rta', function(d) {
            return d.rtaClase;
        })
        .attr("r", function(d) {
            return escalaBolas(d.valor);
        })
        .style('cursor', 'pointer');
    //.call(force.drag);

    /* var bola = node.append("circle")
         .attr("r", function(d) {
             return escalaBolas(d.valor);
         });*/

    /*
		node.on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(formatTime(d.date) + "<br/>"  + d.close)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });*/
    //var tip = $(this).closest('.lt-graf').find('.tooltip');

    function tooltipBolas(e, circ) {
		var tip = $(circ).closest('.lt-graf').children('.lt-tooltip-bolas'),
            porc = Math.round(e.valor * 100) + '%',
            rta = e.respuesta,
        	data = $(circ).data('rta'),
            clave = e.clave,
            xC = parseInt($(circ).attr('cx')),
            yC = parseInt($(circ).attr('cy')),
            rC = parseInt($(circ).attr('r')),
            infoTool = (e.vista === "edad") ? '<p class="lt-bTool-p">' + porc + '</p><p class="lt-bTool-c"> Tienen: ' + clave + ' años</p><p class="lt-bTool-r">' + rta + '</p>' :
            (e.vista === "sexo") ? '<p class="lt-bTool-p">' + porc + '</p><p class="lt-bTool-c"> Sexo: ' + clave + '</p><p class="lt-bTool-r">' + rta + '</p>' :
            '<p class="lt-bTool-p">' + porc + '</p><p class="lt-bTool-r">' + rta + '</p>';
        
		tip.css({
            left: xC + 62.5 + 'px',
            bottom: 240 - yC + rC - 45 + 'px'
        });
		//console.log(xC);
        tip.show();
        tip.html(infoTool);
    }
    node.on("mouseover", function(d) {
		tooltipBolas(d, this);
        
    }).on("mouseout", function(d) {
        var tip = $(this).closest('.lt-graf').children('.lt-tooltip-bolas');
        tip.hide();
    });


    function tick(e) {
        var k = 0.1 * e.alpha;

        // Push nodes toward their designated focus.
        arrayPlano.forEach(function(o, i) {
            o.y += (centrosMap[o.nDes].y - o.y) * k;
            o.x += (centrosMap[o.nDes].x - o.x) * k;
        });

        /*
        node.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
		*/

        node.attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });

    }
}

//Fin gráfica bolas simples
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-gnrl', cargarGeneral);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-sexo', cargarSexo);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-edad', cargarEdad);
$('.lt-btn-desagregar-gnrl').trigger('click');

//BOTONES SEXO
$('div.lt-cont-grafs').on('click', 'a.lt-btn-check-sexo', function(e) {
    e.preventDefault();
    var indActual = $(this).closest('.lt-cont-grafs');
    var btnActual = $(this).data('ltsexo');
    var grafActual = indActual.find('.' + btnActual + '');
    grafActual.toggle(500);
    $(this).toggleClass('activo');
});
//BOTONES EDAD
$('.lt-cont-grafs').on('click', 'a.lt-btn-check-edad', function(e) {
    e.preventDefault();
    var indActual = $(this).closest('.lt-cont-grafs');
    var btnActual = $(this).data('ltedad');
    var filaActual = indActual.find('.' + btnActual + '');
    //var nActivos = $(this).closest('.lt-nav-edad').children('.activo').length;
    //console.log(nActivos);
    filaActual.toggle(500);
    $(this).toggleClass('activo');
});
//Botones de Bolas
$('.lt-cont-grafs').on('click', 'a.lt-btn-bolas', function(e) {
    e.preventDefault();
    var indActual = $(this).closest('.lt-cont-grafs'),
		btns = indActual.find('.lt-btn-bolas'),
		bolas = indActual.find('.node'),
    	btnActual = $(this).data('ltbola'),
		miBola = indActual.find('.'+btnActual);
	
	
	
	if($(this).hasClass('activo')) { 
		bolas.removeClass('desactivado');
		$(this).removeClass('activo');
	} else {
		btns.removeClass('activo');
		bolas.addClass('desactivado');
		miBola.removeClass('desactivado');
		$(this).addClass('activo');
	}
});