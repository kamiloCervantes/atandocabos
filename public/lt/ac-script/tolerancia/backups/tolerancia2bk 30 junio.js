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
	
	var indCont = $(this).closest('.lt-ind');
	//var cGrafs = $(this).closest('.lt-ind').find('.lt-cont-grafs');
	
	d3.json("ac-script/datos/d-tolerancia2.json", function(error, data){
		
		var datos = data;
		var idInd = datos[0].indicador;
		var numDatos = datos.length;
		var numCols = 12/numDatos;
		
		
		//Solo una vez al cargar el documento
		indCont.attr('id', 'lt-ind-'+idInd+'');
		
		
		
		var ltCols = d3.select(contGrafs).append("div")
			.attr("class", "row lt-graficas")
			.selectAll("div")
			.data(datos)
			.enter()
			.append("div")
			.attr("class", "col-sm-"+numCols+"");
		
		var titTerritorio = ltCols.append("h5")
			.text(function(d){ return d.territorio})
			.attr("class", "lt-tit-territorio");
		
		var divGraf = ltCols.append("div")
			.attr("class", "lt-graf")
			.attr("id", function(d, i){ 
						var idInd = d.indicador
						var ixInd = i+1;
						var miID = "lt-"+idInd+"-gnrl-"+ixInd+"";
						return miID;
						});
		
		
		for(i = 0; i < numDatos; i++) {
			
			var miDato = datos[i].datos[1].valor;
			var ixInd = i+1;
			var miDiv = "#lt-"+idInd+"-gnrl-"+ixInd+"";
							
			//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
			lanzarBolas(miDiv, miDato, intGeneral[i]);
		
		}//Fin de loop
		
	});
	
	
	
}
//Cargar Sexo

function cargarSexo() {
	
	var miBoton = $(this);	
	
	limpiar(miBoton);
	
	d3.json("ac-script/datos/d-tolerancia-sexo2.json", function(error, data){
		
		var datos = data;
		var idInd = datos[0].indicador;
		var numDatos = datos.length;
		var misDatos = [];
		
		var dSexSan = datos.filter(checkSan);
		var dSexPsc = datos.filter(checkPsc);
		var dSexNal = datos.filter(checkNal);
		
		function checkSan(d) {
    		return d.territorio === "San Andres";
		}
		function checkPsc(d) {
    		return d.territorio === "Providencia";
		}
		function checkNal(d) {
    		return d.territorio === "Nacional";
		}
		if (dSexSan.length > 0) { 
			misDatos.push(dSexSan);
		}
		if (dSexPsc.length > 0) { 
			misDatos.push(dSexPsc);
		}
		if (dSexNal.length > 0) { 
			misDatos.push(dSexNal);
		}
		
		
		var numTerritorios = misDatos.length;
		
		var numCols = 12/numTerritorios;
		
		var sexNav = d3.select(contGrafs).append("div")
			.attr("class", "lt-nav-sexo");
		
		var btnH = sexNav.append("a")
			.attr({ 
				'class': 'lt-btn-check lt-btn-check-sexo  activo',
				'data-ltsexo': 'hombre',
				'href': '#'
			}).
			text('HOMBRES');
		
		var btnH = sexNav.append("a")
			.attr({ 
				'class': 'lt-btn-check lt-btn-check-sexo activo',
				'data-ltsexo': 'mujer',
				'href': '#'
			}).
			text('MUJERES');
					
		var ltCols = d3.select(contGrafs).append("div")
			.attr("class", "row lt-graficas")
			.selectAll("div")
			.data(misDatos)
			.enter()
			.append("div")
			.attr("class", "col-sm-"+numCols+"");
		
		var titTerritorio = ltCols.append("h5")
			.text(function(d){ return d[0].territorio;})
			.attr("class", "lt-tit-territorio");
		
		
		var divGraf = ltCols.append("div")
			.attr("class", "lt-graf")
			.attr("id", function(d){ 
							var miT = d[0].territorio;
							var sxInd = miT.substring(0,3);
							return "lt-"+idInd+"-sexo-"+sxInd+"";
						});
			
		var cSexSan = "lt-"+idInd+"-sexo-San";
		var cSexPsc = "lt-"+idInd+"-sexo-Pro";
		var cSexNal = "lt-"+idInd+"-sexo-Nac";
		
		d3.select("#"+cSexSan).selectAll("div")
				.data(dSexSan)
				.enter()
				.append("div")
				.attr("class", function(d){
							var miS = d.sexo.substring(0,1);
							return "lt-tol-sexo sexoActivo lt-tol-sexo-"+miS+"";
							})
				.attr("id", function(d){
							var miS = d.sexo.substring(0,1);
							return ""+cSexSan+"-"+miS+"";
							});
		
		d3.select("#"+cSexPsc).selectAll("div")
				.data(dSexPsc)
				.enter()
				.append("div")
				.attr("class", function(d){
							var miS = d.sexo.substring(0,1);
							return "lt-tol-sexo sexoActivo lt-tol-sexo-"+miS+"";
							})
				.attr("id", function(d){
							var miS = d.sexo.substring(0,1);
							return ""+cSexPsc+"-"+miS+"";
							});
		d3.select("#"+cSexNal).selectAll("div")
				.data(dSexNal)
				.enter()
				.append("div")
				.attr("class", function(d){
							var miS = d.sexo.substring(0,1);
							return "lt-tol-sexo sexoActivo lt-tol-sexo-"+miS+"";
							})
				.attr("id", function(d){
							var miS = d.sexo.substring(0,1);
							return ""+cSexNal+"-"+miS+"";
							});
												
		for(i = 0; i < numDatos; i++) {
			
			var miDato = datos[i].datos[1].valor;
			var trInd = datos[i].territorio.substring(0,3);
			var sxInd = datos[i].sexo.substring(0,1);
			
			var miDiv = "#lt-"+idInd+"-sexo-"+trInd+"-"+sxInd+"";
			
						
			//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
			lanzarBolas(miDiv, miDato, intSexo[i]);
		
		}//Fin de loop
		
	});
}

//Cargar edad

function cargarEdad() {
	
	var miBoton = $(this);	
	
	limpiar(miBoton);
	
	d3.json("ac-script/datos/d-tolerancia-edad2.json", function(error, data){
		
		var datos = data;
		var idInd = datos[0].indicador;
		var numDatos = datos.length;
		var misDatos = [];
		
		//Tomar los datos y anidarlos
		var edadArray = d3.nest()
    		.key(function(d) { return d.edad; })
    		.key(function(d) { return d.territorio; })
    		.entries(datos);
			
		console.log(edadArray);
		
		//Crear botones
		var btnEdad = d3.select(contGrafs)
			.append('div')
			.attr('class', 'lt-nav-edad')
			.selectAll('div')
			.data(edadArray)
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
			
		//Crear las filas	
		var filasEdad = d3.select(contGrafs)
			.append('div')
			.attr('class', 'lt-filas-edad')
			.selectAll('div')
			.data(edadArray)
			.enter()
			.append('div')
			.attr('class', function(d){
				var gEdad = d.key.replace(/\+/g, '');
				return 'row lt-filaEdad'+gEdad+'';
			});
	
		//Crear las columnas dentro de cada fila
		var colsEdad = filasEdad.selectAll('div')
			.data(function(d){ return d.values; })
			.enter()
			.append('div')
			.attr('class', 'col-sm-4');
		
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
	
	
					
}

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
		var btnActual = $(this).data('ltsexo').substring(0,1);
		var sexActual = indActual.find('.lt-tol-sexo-'+btnActual+'');
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


