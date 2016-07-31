//Load the data and Call function to draw the Radar chart
var intGeneral = [];
var intSexo = [];
var intEdad = [];

var contGrafs = '.lt-cont-grafs';

var width = 110,
    height = 110;
	
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
	//var cGrafs = $(this).closest('.lt-ind').find('.lt-cont-grafs');
	
	d3.xhr("/servicios/getlinea")
        .header("Content-Type", "application/json")  
        .post(
         JSON.stringify({indicador: $('#indicadordata').val(), vista: "General"}), function(error, data){
		var data = JSON.parse(data.response); 
		var datos = data;
                
		var idInd = datos[0].indicador;
		var numDatos = datos.length;
		
		//Tomar los datos y anidarlos
		var gnrlArray = d3.nest()
    		.key(function(d) { return d.territorio;})
    		.key(function(d) { return d.fecha;})
    		.entries(datos);
			
		//console.log(gnrlArray);
		
				
		//Crear contenedor
		var lineaCont = d3.select(contGrafs)
			.append('div')
			.attr('class', 'lt-linea-cont');
			
		//Crear Fila de fechas
		var fFechas = lineaCont.append('div')
			.attr('class', 'row lt-linea-fechas');
		
		//Crear cols con fechas
		var cFIzq = fFechas.append('div')
			.attr('class', 'col-md-3')
			.append('h5')
			.attr('class', 'tit-fechas')
			.text('FECHAS');
		
		var cFDer = fFechas.append('div')
			.attr('class', 'col-md-9')
			.append('div')
			.attr('class', 'row');
		
		//Crear titulos de fechas
		var titFechas = cFDer.selectAll('div')
			.data(gnrlArray[0].values)
			.enter()
			.append('div')
			.attr('class', 'col-md-2')
			.append('h5')
			.text(function(d){
				var fecha = d.key;
				return ''+fecha+'';
			});
		
		
		//Crear Fila de cuerpo de gráficas
		var fCuerpo = lineaCont.append('div')
			.attr('class', 'lt-linea-cuerpo');
			
				
		//Crear las filas	
		var fTerGnrl = fCuerpo.selectAll('div')
			.data(gnrlArray)
			.enter()
			.append('div')
			.attr('class', function(d){
					var ter = d.key.substring(0,3);
					return 'row lt-'+idInd+'-gnrl-'+ter+'';
			});
			
		//Crear col izquierda
		var cIzq = fTerGnrl.append('div')
			.attr('class', 'col-md-3')
			.append('h5')
			.attr('class', 'lt-tit-territorio')
			.text(function(d){
				var tit = d.key;
				return ''+tit+'';	
			});
		
		//Crear col derecha
		var cDer = fTerGnrl.append('div')
			.attr('class', 'col-md-9')
			.append('div')
			.attr('class', 'row');
			
		//Crear divs para gráficos
		var grafs = cDer.selectAll('div')
			.data(function(d){ return d.values; })
			.enter()
			.append('div')
			.attr('class', 'col-md-2 lt-graf')
			.attr('id', function(d){
				var terr = d.values[0].territorio.substring(0,3);
				var fecha = d.values[0].fecha;
				return 'lt-'+idInd+'-gnrl-'+terr+'-'+fecha+'';
			});
		
		//Crear Escala para valores
		var dMax = d3.max(datos, function(d) { return d.valor; });
		//console.log(dMax);
		
		var linearScale = d3.scale.linear()
                          .domain([0, dMax])
                         	.range([0,100]);
						   
		//Loop para pintar 	las gráficas
		for(i = 0; i < numDatos; i++) {
			
			var miDato = datos[i].valor;//Obtener Valor
			var terr = datos[i].territorio.substring(0,3);
			var fecha = datos[i].fecha;
			
			var nBolas = linearScale(miDato);//Pasar el valor por escala
			
			var miDiv = '#lt-'+idInd+'-gnrl-'+terr+'-'+fecha+'';
						
			//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
			lanzarBolas(miDiv, miDato, nBolas, intGeneral[i]);
		
		}//Fin de loop
			
	});//Fin de data
	
}//Fin de cargar general

/*
=====================
Cargar Sexo
=====================
*/
function cargarSexo() {
	
	var miBoton = $(this);	
	
	limpiar(miBoton);
	
	d3.xhr("/servicios/getlinea")
        .header("Content-Type", "application/json")  
        .post(
         JSON.stringify({indicador: $('#indicadordata').val(), vista: "Sexo"}), function(error, data){
		data = JSON.parse(data.response);
		var datos = data;
		var idInd = datos[0].indicador;
		var numDatos = datos.length;
		
		//Tomar los datos y anidarlos
		var sexoArray = d3.nest()
    		.key(function(d) { return d.territorio;})
			.key(function(d) { return d.sexo;})
    		.key(function(d) { return d.fecha;})
    		.entries(datos);
			
		//console.log(sexoArray);
		//Anidar Datos por sexo
		var sexoArrayS = d3.nest()
    		.key(function(d) { return d.sexo;})
    		.entries(datos);
		
		//Crear botones
		var btnSexo = d3.select(contGrafs)
			.append('div')
			.attr('class', 'lt-nav-sexo')
			.selectAll('div')
			.data(sexoArrayS)
			.enter()
			.append('a')
			.attr({ 
				'class': 'lt-btn-check lt-btn-check-sexo activo',
				'data-ltsexo': function(d){ 
					var sexo = d.key;
					return ''+sexo+'';
				},
				'href': '#'
			})
			.text(function(d){ 
				return ''+d.key+'';
			});
		
		//Crear contenedor
		var lineaCont = d3.select(contGrafs)
			.append('div')
			.attr('class', 'lt-linea-cont');
		
		//Crear Fila de fechas
		var fFechas = lineaCont.append('div')
			.attr('class', 'row lt-linea-fechas');
			
		//Crear cols con fechas
		var cFIzq = fFechas.append('div')
			.attr('class', 'col-md-3')
			.append('h5')
			.attr('class', 'tit-fechas')
			.text('FECHAS');
		
		var cFDer = fFechas.append('div')
			.attr('class', 'col-md-9')
			.append('div')
			.attr('class', 'row');
		
		//Crear titulos de fechas
		var titFechas = cFDer.selectAll('div')
			.data(sexoArray[0].values[0].values)
			.enter()
			.append('div')
			.attr('class', 'col-md-2')
			.append('h5')
			.text(function(d){
				var fecha = d.key;
				return ''+fecha+'';
			});
		
		//Crear Fila de cuerpo de gráficas
		var fCuerpo = lineaCont.append('div')
			.attr('class', 'lt-linea-cuerpo');
				
		//Crear las filas de Territorio	
		var fTerGnrl = fCuerpo.selectAll('div')
			.data(sexoArray)
			.enter()
			.append('div')
			.attr('class', function(d){
					var ter = d.key.substring(0,3);
					return 'row lt-'+idInd+'-sexo-'+ter+'';
			});
		//Crear col Territorio
		var cTerr = fTerGnrl.append('div')
			.attr('class', 'col-md-1')
			.append('h5')
			.text(function(d){
				var ter = d.key;
					return ''+ter+'';
			});
		//Crear contenedor de filas de sexo
		var cContSexo = fTerGnrl.append('div')
			.attr('class', 'col-md-11');
			
		//Crear filas de sexo por cada territorio
		var fsexo = cContSexo.selectAll('div')
			.data(function(d){ return d.values; })
			.enter()
			.append('div')
			.attr('class', function(d){
				var sexo = d.key.substring(0,1);
				return 'row lt-sexo-'+sexo+'';
				
			});	
		//Agregar col título de sexo
		var fsexoTit = fsexo.append('div')
			.attr('class','col-md-2')
			.append('h5')
			.attr('class', 'lt-linea-tit-sx')
			.text(function(d){
				var sexo = d.key;
				return ''+sexo+'';
			});
		
		//Agregar col de gráficas de sexo
		var fsexoCInfo = fsexo.append('div')
			.attr('class','col-md-10')
			.append('div')
			.attr('class', 'row');
		
		//Crear divs para gráficos
		var grafs = fsexoCInfo.selectAll('div')
			.data(function(d){ return d.values; })
			.enter()
			.append('div')
			.attr('class', 'col-md-2 lt-graf')
			.attr('id', function(d){
				var terr = d.values[0].territorio.substring(0,3);
				var sexo = d.values[0].sexo.substring(0,1);
				var fecha = d.values[0].fecha;
				return 'lt-'+idInd+'-sexo-'+terr+'-'+sexo+'-'+fecha+'';
			});
		
		//Crear Escala para valores
		var dMax = d3.max(datos, function(d) { return d.valor; });
		//console.log(dMax);
		
		var linearScale = d3.scale.linear()
                          .domain([0, dMax])
                         	.range([0,100]);
						   
		//Loop para pintar 	las gráficas
		for(i = 0; i < numDatos; i++) {
			
			var miDato = datos[i].valor;//Obtener Valor
			var terr = datos[i].territorio.substring(0,3);
			var fecha = datos[i].fecha;
			var sexo = datos[i].sexo.substring(0,1);
			
			var nBolas = linearScale(miDato);//Pasar el valor por escala
			
			var miDiv = '#lt-'+idInd+'-sexo-'+terr+'-'+sexo+'-'+fecha+'';
						
			//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
			lanzarBolas(miDiv, miDato, nBolas, intGeneral[i]);
		
		}//Fin de loop
		
	});//Fin de data
}//Fin de cargar sexo

/*
=====================
Cargar Edad
=====================
*/
function cargarEdad() {
	
	var miBoton = $(this);	
	
	limpiar(miBoton);
	
	d3.json("ac-script/datos/linea/d-linea-edad.json", function(error, data){
		
		var datos = data;
		var idInd = datos[0].indicador;
		var numDatos = datos.length;
		
		//Tomar los datos y anidarlos
		var edadArray = d3.nest()
    		.key(function(d) { return d.territorio;})
			.key(function(d) { return d.edad;})
    		.key(function(d) { return d.fecha;})
    		.entries(datos);
			
		//console.log(edadArray);
		
		//Anidar Datos por edad para crear botones
		var edadArrayE = d3.nest()
    		.key(function(d) { return d.edad;})
    		.entries(datos);
		
		//Crear botones
		var btnEdad = d3.select(contGrafs)
			.append('div')
			.attr('class', 'lt-nav-edad')
			.selectAll('div')
			.data(edadArrayE)
			.enter()
			.append('a')
			.attr({ 
				'class': 'lt-btn-check lt-btn-check-edad activo',
				'data-ltedad': function(d){ 
					var edad = d.key.replace(/\+/g, '');
					return ''+edad+'';
				},
				'href': '#'
			})
			.text(function(d){ 
				return ''+d.key+'';
			});
		
		//Crear contenedor
		var lineaCont = d3.select(contGrafs)
			.append('div')
			.attr('class', 'lt-linea-cont');
		
		//Crear Fila de fechas
		var fFechas = lineaCont.append('div')
			.attr('class', 'row lt-linea-fechas');
			
		//Crear cols con fechas
		var cFIzq = fFechas.append('div')
			.attr('class', 'col-md-3')
			.append('h5')
			.attr('class', 'tit-fechas')
			.text('FECHAS');
		
		var cFDer = fFechas.append('div')
			.attr('class', 'col-md-9')
			.append('div')
			.attr('class', 'row');
		
		//Crear titulos de fechas
		var titFechas = cFDer.selectAll('div')
			.data(edadArray[0].values[0].values)
			.enter()
			.append('div')
			.attr('class', 'col-md-2')
			.append('h5')
			.text(function(d){
				var fecha = d.key;
				return ''+fecha+'';
			});
		
		//Crear Fila de cuerpo de gráficas
		var fCuerpo = lineaCont.append('div')
			.attr('class', 'lt-linea-cuerpo');
				
		//Crear las filas de Territorio	
		var fTerGnrl = fCuerpo.selectAll('div')
			.data(edadArray)
			.enter()
			.append('div')
			.attr('class', function(d){
					var ter = d.key.substring(0,3);
					return 'row lt-'+idInd+'-edad-'+ter+'';
			});
		
		//Crear col Territorio
		var cTerr = fTerGnrl.append('div')
			.attr('class', 'col-md-1')
			.append('h5')
			.text(function(d){
				var ter = d.key;
					return ''+ter+'';
			});
		//Crear contenedor de filas de sexo
		var cContEdad = fTerGnrl.append('div')
			.attr('class', 'col-md-11');
			
		//Crear filas de edad por cada territorio
		var fEdad = cContEdad.selectAll('div')
			.data(function(d){ return d.values; })
			.enter()
			.append('div')
			.attr('class', function(d){
				var edad = d.key.replace(/\+/g, '');
				return 'row lt-edad-'+edad+'';
				
			});	
		
		//Agregar col título de edad
		var fedadTit = fEdad.append('div')
			.attr('class','col-md-2')
			.append('h5')
			.attr('class', 'lt-linea-tit-sx')
			.text(function(d){
				var edad = d.key;
				return ''+edad+'';
			});
		
		//Agregar col de gráficas de sexo
		var fedadCInfo = fEdad.append('div')
			.attr('class','col-md-10')
			.append('div')
			.attr('class', 'row');
		
		//Crear divs para gráficos
		var grafs = fedadCInfo.selectAll('div')
			.data(function(d){ return d.values; })
			.enter()
			.append('div')
			.attr('class', 'col-md-2 lt-graf')
			.attr('id', function(d){
				var terr = d.values[0].territorio.substring(0,3);
				var edad = d.values[0].edad.replace(/\+/g, '');
				var fecha = d.values[0].fecha;
				return 'lt-'+idInd+'-edad-'+terr+'-'+edad+'-'+fecha+'';
		});
		
		//Crear Escala para valores
		var dMax = d3.max(datos, function(d) { return d.valor; });
		//console.log(dMax);
		
		var linearScale = d3.scale.linear()
                          .domain([0, dMax])
                         	.range([0,50]);
						   
		//Loop para pintar 	las gráficas
		for(i = 0; i < numDatos; i++) {
			
			var miDato = datos[i].valor;//Obtener Valor
			var terr = datos[i].territorio.substring(0,3);
			var fecha = datos[i].fecha;
			var edad = datos[i].edad.replace(/\+/g, '');
			
			var nBolas = linearScale(miDato);//Pasar el valor por escala
			
			var miDiv = '#lt-'+idInd+'-edad-'+terr+'-'+edad+'-'+fecha+'';
						
			//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
			lanzarBolas(miDiv, miDato, nBolas, intGeneral[i]);
		
		}//Fin de loop
		
		
	});//Fin de data
}//Fin de cargar sexo

/*
=====================
Función lanzar bolas
=====================
*/
function lanzarBolas (miDiv, miDato, nBolas, interval) {
	
		var nodes = [];
	
		var svg = d3.select(miDiv).append("svg")
			.attr("width", width)
			.attr("height", height);
		
		var tooltip = d3.select(miDiv).append("p")
			.attr("class", "lt-tooltip")
			.text(''+miDato+' Casos')
			.append("span")
			.text("De violencia");
			
		var force = d3.layout.force()
			.charge(-3)
			.size([width, height])
			.nodes(nodes)
			.on("tick", tick)
			.start();
			
		var g = svg.append("g")
			.attr("class", "g-tolerancia");
		
		function tick() {
		  svg.selectAll("circle")
			  .attr("cx", function(d) { return d.x; })
			  .attr("cy", function(d) { return d.y; });
		}
		
		interval = setInterval(function() {
				
					  var d = {
							x: width / 2 + 2 * Math.random() - 1,
							y: height / 2 + 2 * Math.random() - 1
						  };
					
					  g.append("circle")
						  .data([d])
						  .attr("r", 1e-6)
						.transition()
						  .ease(Math.sqrt)
						  .attr("r", 2.5);
					
					  if (nodes.push(d) > nBolas-1) {
						  clearInterval(interval);
					  }
					  force.start();
		}, 30);
}
$('.lt-linea').on('mouseenter', '.lt-graf', function() {
	var tooltip = $(this).find('.lt-tooltip');
		tooltip.css('opacity', 1);
});
$('.lt-linea').on('mouseleave', '.lt-graf', function() {
	var tooltip = $(this).find('.lt-tooltip');
		tooltip.css('opacity', 0);
});

$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-gnrl', cargarGeneral);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-sexo', cargarSexo);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-edad', cargarEdad);
$('.lt-btn-desagregar-gnrl').trigger('click');

//BOTONES SEXO
$('div.lt-cont-grafs').on('click', 'a.lt-btn-check-sexo', function (e){
		e.preventDefault();
		var indActual = $(this).closest('.lt-cont-grafs');
		var btnActual = $(this).data('ltsexo').substring(0,1);
		var filaActual = indActual.find('.lt-sexo-'+btnActual+'');
		filaActual.slideToggle();
		$(this).toggleClass('activo');
});

//BOTONES EDAD
$('div.lt-cont-grafs').on('click', 'a.lt-btn-check-edad', function (e){
		e.preventDefault();
		var indActual = $(this).closest('.lt-cont-grafs');
		var btnActual = $(this).data('ltedad');
		var filaActual = indActual.find('.lt-edad-'+btnActual+'');
		filaActual.slideToggle();
		$(this).toggleClass('activo');
});




