// JavaScript Document
function bolasEstructura(losDatos, elCont, idInd, vista) {

    var dAnidados = d3.nest()
        .key(function(d) {
            return d.territorio;
        })
        .entries(losDatos);

    //Número de territorios = número de columnas
    var numCols = 12 / dAnidados.length;

    //Crear fila y columnas
    var ltCols = elCont.append("div")
        .attr("class", "row lt-grafs bolas-vista-"+vista)
        .selectAll("div")
        .data(dAnidados)
        .enter()
        .append("div")
        .attr("class", "col-md-" + numCols + "");

    //Agregar título de territorio	
    ltCols.append('h5')
        .attr('class', 'lt-tit-territorio')
        .text(function(d) {
            return '' + d.key + '';
        });

    //Agregar div que contendrá cada gráfica svg
    
    var ltGraf = ltCols.append("div")
        .attr("class", "lt-graf")
        .attr("id", function(d) {
            var terr = d.key.substring(0, 3);
            return "lt-" + idInd + "-" + vista + "-" + terr + "";
        })
		.style('width', wBol+'px');
	
    //Espacio para tooltip
    // Define the div for the tooltip
    var div = ltGraf.append("div")
        .attr("class", "lt-tooltip-bolas")
        .style("display", "none");

	//Svg contenedor
    var svg = ltGraf.append('svg')
        .attr('width', wBol)
        .attr('height', hBol);

    // Contenedor de torta	
    svg.append('g')
        .attr('class', 'lineas-pie')
        .attr('transform', 'translate(' + (wBol / 2) +
            ',' + (hBol / 2) + ')');

    // Contenedor de bolas			
    svg.append('g')
        .attr('class', 'cont-bolas')
        .attr('transform', 'translate(' + (wBol / 4) +
            ',' + (hBol / 4) + ')');

    //Agregar convenciones
    var conv = elCont.append("div")
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
        .outerRadius(radiusPie - mBol - 5)
        .innerRadius(0);

    var labelArc = d3.svg.arc()
        .outerRadius(radiusPie - 2)
        .innerRadius(radiusPie - mBol - 2);

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
                (d.data.vista === "sexo") ? 'gSexo-' + d.data.key.substring(0, 1) :
                "";

            return 'lt-bolas-porcion ' + desG;
        });


	//Dibujar las lineas de los labels	
    g.append("path")
        .attr("d", labelArc)
		.attr("class", 'linea-ext-bolas');
		
    //Dibujar las porciones
    var porcion = g.append("path")
        .attr("d", arc)
		.attr("class", 'linea-int-bolas');
    

    //Agregar labels
    g.append("text")
        .text(function(d) {
            return d.data.key;
        })
		.attr('class', 'label-bolas')
        .attr('text-anchor', 'middle')
        .attr("transform", function(d) {
            var midAngle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 + d.endAngle / 2 + Math.PI;
			var rota = (d.data.vista === 'sexo') ? -180 : 180;
            return "translate(" + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] + ") rotate(" + (midAngle * rota / Math.PI) + ")";
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
            h = Math.sqrt(nX * nX + nY * nY),
			des = (laVista == 'edad') ? 90 : (laVista == 'sexo') ? 75 : 1;

        nX = nX / h * des;
        nY = nY / h * des;

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
        .friction(0.9)
        .size([wBol, hBol])
        .on("tick", tick) //Aqui está el error
        .start();

    var node = d3.select(miDiv).select('.cont-bolas').selectAll("circle")
        .data(arrayPlano)
        .enter()
        .append("circle")
        .attr("class", function(d) {
            var rta = d.rtaClase,
                desG = (d.vista === "edad") ? 'gEdad-' + d.clave.replace(/\+/g, '') :
                (d.vista === "sexo") ? 'gSexo-' + d.clave.substring(0, 1) :
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
                (d.vista === "sexo") ? 'gSexo-' + d.clave.substring(0, 1) :
                "general";
            return desG;
        })
        .attr('data-rta', function(d) {
            return d.rtaClase;
        })
        .attr("r", function(d) {
            return escalaBolas(d.valor);
        });
        

    
    function tooltipBolas(e, circ) {
		var tip = $(circ).closest('.lt-graf').children('.lt-tooltip-bolas'),
            porc = Math.round(e.valor * 100) + '%',
            rta = e.respuesta.toLowerCase(),
        	data = $(circ).data('rta'),
            clave = e.clave,
            xC = parseInt($(circ).attr('cx')),
            yC = parseInt($(circ).attr('cy')),
            rC = parseInt($(circ).attr('r')),			
            infoTool = (e.vista === "edad") ? '<p class="tip-dato">El ' + porc + '</p><p class="tip-gDes">De los de ' + clave + ' años</p><p class="tip-rta">Dice que ' + rta + '</p>' :
            (e.vista === "sexo") ? '<p class="tip-dato">El ' + porc + '</p><p class="tip-gDes">De sexo: ' + clave + '</p><p class="tip-rta">Dice que ' + rta + '</p>' :
            '<p class="tip-dato">El ' + porc + '</p><p class="tip-rta">Dice que ' + rta + '</p>';
        
						
		tip.css({
            left: xC + 11 + 'px',
            bottom: 260 - yC + rC - 40 + 'px'
        });
		
        tip.html(infoTool);
		
		if (!$(circ).hasClass("desactivado")) {tip.show();}
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

        node.attr("cx", function(d) {
				return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });
		/*
		node.attr("cx", function(d) { return d.x = Math.max(6, Math.min(250 - 6, d.x)); })
        	.attr("cy", function(d) { return d.y = Math.max(6, Math.min(250 - 6, d.y)); });*/


    }
}
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