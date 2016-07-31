// JavaScript Document

function estructuraLinea(losDatos, miContG, elID, vista) {

    //Crear contenedor
    var lineaCont = miContG.append('div')
        .attr('class', 'table-responsive lt-linea-cont lt-linea-cont-'+vista);
	
	var tablas = lineaCont
		.append('table')
		.attr('class', 'table tabla-v-'+vista)
		.selectAll('tr')
		.data(losDatos)
		.enter()
		.append('tr')
		.attr('class', 'linea-fTerr')
		.append('td')
		.append('table')
		.attr('class', 'table');
	
	var fechas = function(losDatos, tablas, ubi){
		
		var tx = (ubi == 'thead') ? 'th' : 'td';
		var fHead = tablas.append(ubi)
			.append('tr')
			.attr('class', 'lt-linea-fechas');
		
		fHead.append(tx)
			.append('h5')
			.attr('class', 'tit-fechas')
			.text('AÑO');
		
		var subfHead = fHead.append(tx)
			.append('table')
			.attr('class','table')
			.append('tr');		
			
		subfHead.append(tx)
			.attr('class', 'f-esp f-esp-'+vista);
			
		subfHead.selectAll('.label-fecha')
			.data(losDatos[0].values[0].values)
			.enter()
			.append(tx)
			.attr('class', 'label-fecha')		
			.append('h5')
			.append('span')
			.text(function(d) {
				var fecha = d.key;
				return '' + fecha + '';
			});
	};
	//Agregar fechas arriba de cada tabla de territorio
	fechas(losDatos, tablas, 'thead');
									
	var cuerpo = tablas.append('tbody').append('tr');
	
	cuerpo.append('td')
		.attr('class', 'celda-territorio ct-'+vista)
		.append('h5')
        .text(function(d){return d.key;});
	
	var cFilas = cuerpo.append('td')
		.append('table')
		.attr('class','table');
			
	var filas = cFilas.selectAll('tr')
		.data(function(d) {
            return d.values;
        })
		.enter()
		.append('tr')
		.attr('class', function(d) {

            var clave = (vista == 'edad') ? 'gEdad-' + d.key.replace(/\+/g, '') :
                (vista == 'sexo') ? 'gSexo-' + d.key.substring(0, 1) :
                'gGnrl';
            return clave;

        });
	
	filas.append('td')
		.attr('class', 'lt-linea-tit-des f-esp-'+vista)
		.append('h5')
        .text(function(d){return d.key;});
	
	var grafs = filas.selectAll('.lt-graf-celda')
		.data(function(d) {
            return d.values;
        })
        .enter()
        .append('td')
		.attr('class', 'lt-graf-celda')
		.append('div')
        .attr('class', 'lt-graf')
        .attr('id', function(d) {
            var terr = d.values[0].territorio.substring(0, 3),

                fecha = d.values[0].fecha,

                clave = (vista == 'edad') ? d.values[0].edad.replace(/\+/g, '') + '-' :
                (vista == 'sexo') ? d.values[0].sexo.substring(0, 1) + '-' :
                '';

            return 'lt-' + elID + '-' + vista + '-' + terr + '-' + clave + fecha + '';
		 });
	
	//Agregar fechas abajo de cada tabla de territorio
	fechas(losDatos, tablas, 'tfoot');
	
    //Crear Fila de fechas

} //Fin estructura lineas	

function lanzarBolasLinea(miDiv, miDato, nBolas, interval, vista) {
	
	var miValor = miDato.valor,
		miFecha = miDato.fecha,
		migDes = (vista == "edad") ?  'De '+miDato.edad+' años' : (vista == "sexo") ? 'De sexo '+miDato.sexo.toLowerCase() : "";
	
	//console.log(miDato);	
		
    var nodes = [];

    var svg = d3.select(miDiv).append("svg")
        .attr("width", wLin)
        .attr("height", hLin);

    var tooltip = d3.select(miDiv).append("p")
        .attr("class", "lt-tooltip");
	
	tooltip.append('span')
			.attr('class', 'tip-dato')
			.text('Hubo '+miValor);
			
			//.append('i').text(' casos');
		
		
			
		tooltip.append('span')
			.attr('class', 'tip-gDes')
			.text(migDes);
	
	tooltip.append('span')
			.attr('class', 'tip-rta')
			.text('en '+miFecha);	
			
    var force = d3.layout.force()
        .charge(-3)
        .size([wLin, hLin])
        .nodes(nodes)
        .on("tick", tick)
        .start();

    var g = svg.append("g")
        .attr("class", "g-tolerancia");

    function tick() {
        svg.selectAll("circle")
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });
    }

    interval = setInterval(function() {

        var d = {
            x: wLin / 2 + 2 * Math.random() - 1,
            y: hLin / 2 + 2 * Math.random() - 1
        };

        g.append("circle")
            .data([d])
            .attr("r", 1e-6)
            .transition()
            .ease(Math.sqrt)
            .attr("r", 2.5);

        if (nodes.push(d) > nBolas - 1) {
            clearInterval(interval);
        }
        force.start();
    }, 30);
}
/*var cuerpo = tablas.append('tbody');
	
	var filas = cuerpo.selectAll('tr')
		.data(function(d) {
            return d.values;
        })
		.enter()
		.append('tr')
		.attr('class', function(d, i) {
			i = i+1;
			
            var clave = (vista == 'edad') ? 'f-linea-'+i+' gEdad-' + d.key.replace(/\+/g, '')  :
                (vista == 'sexo') ? 'f-linea-'+i+' gSexo-' + d.key.substring(0, 1) :
                'f-linea-'+i+' gGnrl';
			
            return clave;

        });
	
	cuerpo.selectAll('.f-linea-1')
		.append('td')
		.attr('rowspan', function(){
			var span = (vista = "edad") ? '6' : (vista = "sexo") ? '2' : '1';
			return span;
		})
		.append('h5')
        .attr('class', 'lt-linea-tit-des')
        .text(function(d){
			return d.values[0].values[0].territorio;
		});
	
	
		
	filas.append('td')
		.append('h5')
        .attr('class', 'lt-linea-tit-des')
        .text(function(d){return d.key;});
	
	var grafs = filas.selectAll('.lt-graf')
		.data(function(d) {
            return d.values;
        })
        .enter()
        .append('td')
        .attr('class', 'lt-graf')
        .attr('id', function(d) {
            var terr = d.values[0].territorio.substring(0, 3),

                fecha = d.values[0].fecha,

                clave = (vista == 'edad') ? d.values[0].edad.replace(/\+/g, '') + '-' :
                (vista == 'sexo') ? d.values[0].sexo.substring(0, 1) + '-' :
                '';

            return 'lt-' + elID + '-' + vista + '-' + terr + '-' + clave + fecha + '';
		 });*/	