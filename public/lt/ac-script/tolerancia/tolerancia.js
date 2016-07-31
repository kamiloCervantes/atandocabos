//Load the data and Call function to draw the Radar chart
var intGeneral = [];
var intSexo = [];
var intEdad = [];

var contGrafs = '.lt-cont-grafs';

var width = 150,
    height = 150;
	
function limpiar(l) {
	l.closest('.lt-ind').find('.lt-cont-grafs').html("");
}

function cargarGeneral() {
	
	var miBoton = $(this);	
	
	limpiar(miBoton);
	
	d3.json("/lt/ac-script/datos/tolerancia/d-tolerancia-general.json", function(error, data){
		
		var datos = data;
		var idInd = datos[0].indicador;
		var numDatos = datos.length;
		var numCols = 12/numDatos;
		
		var ltCols = d3.select(contGrafs).append("div")
			.attr("class", "row lt-grafs")
			.selectAll("div")
			.data(datos)
			.enter()
			.append("div")
			.attr("class", "col-sm-"+numCols+"");
		
		var titTerritorio = ltCols.append("h5")
			.text(function(d){ return d.territorio})
			.attr("class", "lt-tit-territorio");
		
		var ltGraf = ltCols.append("div")
			.attr("class", "lt-graf")
			.attr("id", function(d, i){ 
						var terr = d.territorio.substring(0,3);
						return "lt-"+idInd+"-gnrl-"+terr+"";
						
						});
		
		
		for(i = 0; i < numDatos; i++) {
			
			var miDato = datos[i].datos[1].valor;
			var terr = datos[i].territorio.substring(0,3);
			var miDiv = "#lt-"+idInd+"-gnrl-"+terr+"";
							
			//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
			lanzarBolas(miDiv, miDato, intGeneral[i]);
		
		}//Fin de loop
		
	});
	
}
//Cargar Sexo

function cargarSexo() {
	
	var miBoton = $(this);	
	
	limpiar(miBoton);
	
	d3.json("/lt/ac-script/datos/tolerancia/d-tolerancia-sexo.json", function(error, data){
		
		var datos = data;
                console.log(datos);
		var idInd = datos[0].indicador;
		var numDatos = datos.length;
		
		
		//Tomar los datos y anidarlos
		//**En sexo primero por territorio y luego por sexo
		var dAnidados = d3.nest()
    		.key(function(d) { return d.territorio; })
    		.entries(datos);
			
		//console.log(dAnidados);
		
		//Calcular número de columnas según número de territorios
		var numCols = 12/dAnidados.length;
		
		//**En sexo otro Array anidado para generar botones
		var dAnidadosS = d3.nest()
    		.key(function(d) { return d.sexo; })
    		.entries(datos);
			
		//Crear botones
		var nav = d3.select(contGrafs)
			.append('div')
			.attr('class', 'lt-nav-sexo')
			.selectAll('a')
			.data(dAnidadosS)
			.enter()
			.append('a')
			.attr({ 
				'class': 'lt-btn-check lt-btn-check-sexo activo',
				'data-ltsexo': function(d){ 
					var sexo = d.key.substring(0,1);
					return 'tol-sexo-'+sexo+'';
				},
				'href': '#'
			})
			.text(function(d){ 
				return ''+d.key+'';
			});
		
		//**En sexo cambia datos por dAnidados			
		var ltCols = d3.select(contGrafs).append("div")
			.attr("class", "row lt-grafs")
			.selectAll("div")
			.data(dAnidados)
			.enter()
			.append("div")
			.attr("class", "col-sm-"+numCols+"");
		
		//Agregar título de territorio
		var titTerritorio = ltCols.append("h5")
			.text(function(d){ return ''+d.key+'';})
			.attr("class", "lt-tit-territorio");
		
		//**En sexo no es necesario que lleve ID
		var ltGraf = ltCols.append("div")
			.attr("class", "lt-graf");
			
		
		//**Agregar dos div por .lt-graf
		var tolSexo = ltGraf.selectAll('div')
			.data(function(d){ return d.values; })
			.enter()
			.append('div')
			.attr('class', function (d){
				var sexo = d.sexo.substring(0,1);
				return 'lt-tol-sexo sexoActivo tol-sexo-'+sexo+'';
			}).attr('id', function (d){
				var terr = d.territorio.substring(0,3);
				var sexo = d.sexo.substring(0,1);
				return 'lt-'+idInd+'-sexo-'+terr+'-'+sexo+'';
			});
											
		for(i = 0; i < numDatos; i++) {
			
			var miDato = datos[i].datos[1].valor;
			var terr = datos[i].territorio.substring(0,3);
			var sexo = datos[i].sexo.substring(0,1);
			
			var miDiv = "#lt-"+idInd+"-sexo-"+terr+"-"+sexo+"";
			
						
			//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
			lanzarBolas(miDiv, miDato, intSexo[i]);
		
		}//Fin de loop
		
	});
}

//Cargar edad

function cargarEdad() {
	
	var miBoton = $(this);	
	
	limpiar(miBoton);
	
	d3.json("/lt/ac-script/datos/tolerancia/d-tolerancia-edad.json", function(error, data){
		
		var datos = data;
		var idInd = datos[0].indicador;
		var numDatos = datos.length;
		
		//Tomar los datos y anidarlos
		//**En edad se anida por edad y luego por territorio
		var dAnidados = d3.nest()
    		.key(function(d) { return d.edad; })
    		.key(function(d) { return d.territorio; })
    		.entries(datos);
			
		//console.log(edadArray);
		
		
		
		//**En edad otro Array anidado para gcalcular ancho de columnas
		var dAnidadosE = d3.nest()
    		.key(function(d) { return d.territorio; })
    		.entries(datos);
		
		//Calcular número de columnas según número de territorios
		var numCols = 12/dAnidadosE.length;
		
		//Crear botones
		var nav = d3.select(contGrafs)
			.append('div')
			.attr('class', 'lt-nav-edad')
			.selectAll('a')
			.data(dAnidados)
			.enter()
			.append('a')
			.attr({ 
				'class': 'lt-btn-check lt-btn-check-edad activo',
				'data-ltedad': function(d){ 
					var gEdad = d.key.replace(/\+/g, '');
					return ''+gEdad+'';
				},
				'href': '#'
			})
			.text(function(d){ 
				return ''+d.key+'';
			});
		
		//Crear etiquetas de territorio
		var tTerrFilas = d3.select(contGrafs)
			.append('div')
			.attr('class', 'row lt-tits-territorio-fEdad')
			.selectAll('div')
			.data(dAnidadosE)
			.enter()
			.append('div')
			.attr("class", "col-sm-"+numCols+"")
			.append('h5')
			.attr('class', 'lt-tit-territorio')
			.text(function(d){ 
				return ''+d.key+'';
			});
			
		//Crear las filas	
		var filasEdad = d3.select(contGrafs)
			.append('div')
			.attr('class', 'lt-filas-edad')
			.selectAll('div')
			.data(dAnidados)
			.enter()
			.append('div')
			.attr('class', function(d){
				var gEdad = d.key.replace(/\+/g, '');
				return 'row lt-filaEdad'+gEdad+'';
			});
		
		var spanFila = filasEdad.append('span')
			.attr('class', 'lt-tol-edad-span')
			.text(function(d){ 
				return ''+d.key+'';
			});
		
		//Crear las columnas dentro de cada fila
		var colsEdad = filasEdad.selectAll('div')
			.data(function(d){ return d.values; })
			.enter()
			.append('div')
			.attr("class", "col-sm-"+numCols+"");
		
		//Agregar título de territorio	
		var titTerritorio = colsEdad.append('h5')
			.attr('class', 'lt-tit-territorio')
			.text(function(d){ 
				return ''+d.key+'';
			});
		
		//Agregar contenedor de cada gráfica
		var grafEdad = colsEdad.selectAll('div')
			.data(function(d){ return d.values; })
			.enter()
			.append('div')
			.attr('class', 'lt-graf')
			.attr('id', function(d){ 
				var gEdad = d.edad.replace(/\+/g, '');
				var tTrio = d.territorio.substring(0,3);
				return 'lt-'+idInd+'-edad'+gEdad+'-'+tTrio+'';
			});
		
		
		//Loop para pintar las gráficas
		for(i = 0; i < numDatos; i++) {
			
			var miDato = datos[i].datos[1].valor;//Obtener Valor de Respuesta Le es indiferente
			var gEdad = datos[i].edad.replace(/\+/g, '');
			var tTrio = datos[i].territorio.substring(0,3);
			
			var miDiv = '#lt-'+idInd+'-edad'+gEdad+'-'+tTrio+'';
						
			//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
			lanzarBolas(miDiv, miDato, intEdad[i]);
		
		}//Fin de loop
		
	});//Fin de json
	
}//Fin de Edad

function lanzarBolas (miDiv, miDato, interval) {
	
		var nodes = [];
	
		var svg = d3.select(miDiv).append("svg")
			.attr("width", width)
			.attr("height", height);
		
		var tooltip = d3.select(miDiv).append("p")
			.attr("class", "lt-tooltip")
			.text(miDato*100+"%")
			.append("span")
			.text("No le gustaria tener como vecionos a los alcohólicos");
			
		var force = d3.layout.force()
			.charge(-6)
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
						  .attr("r", 4.5);
					
					  if (nodes.push(d) > miDato*100-1) {
						  clearInterval(interval);
					  }
					  force.start();
		}, 70);
}
$('.lt-tolerancia').on('mouseenter', '.lt-graf', function() {
	var tooltip = $(this).find('.lt-tooltip');
		tooltip.css('opacity', 1);
});
$('.lt-tolerancia').on('mouseleave', '.lt-graf', function() {
	var tooltip = $(this).find('.lt-tooltip');
		tooltip.css('opacity', 0);
});

$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-gnrl', cargarGeneral);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-sexo', cargarSexo);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-edad', cargarEdad);
$('.lt-btn-desagregar-gnrl').trigger('click');

//BOTONES SEXO
$('.lt-cont-grafs').on('click', '.lt-btn-check-sexo', function (e){
		e.preventDefault();
		var indActual = $(this).closest('.lt-cont-grafs');
		var btnActual = $(this).data('ltsexo');
		var sexActual = indActual.find('.'+btnActual+'');
		sexActual.toggleClass('sexoActivo');
		$(this).toggleClass('activo');
		
});

//BOTONES EDAD
$('.lt-cont-grafs').on('click', '.lt-btn-check-edad', function (e){
		e.preventDefault();
		var indActual = $(this).closest('.lt-cont-grafs');
		var btnActual = $(this).data('ltedad');
		var filaActual = indActual.find('.lt-filaEdad'+btnActual+'');
		var nActivos = $(this).closest('.lt-nav-edad').children('.activo').length;
		console.log(nActivos);
		filaActual.slideToggle();
		$(this).toggleClass('activo');
		
		
});


