

//Load the data and Call function to draw the Radar chart
var intGeneral = [];
var intSexo = [];
var intEdad = [];

var contGrafs = ".lt-tolerancia";

var width = 150,
    height = 150;
	
function limpiar() {
	$(contGrafs).html("");
}

function cargarGeneral() {
	
	limpiar();
	
	d3.json("ac-script/datos/d-tolerancia2.json", function(error, data){
		
		var datos = data;
		var numDatos = datos.length;
		var numCols = 12/numDatos;
		
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
			var idInd = datos[i].indicador;
			var ixInd = i+1;
			var miDiv = "#lt-"+idInd+"-gnrl-"+ixInd+"";
							
			//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
			lanzarBolas(miDiv, miDato, intGeneral[i]);
		
		}//Fin de loop
		
	});

$('.lt-nav-desagregar').off('click', '.lt-btn-desagregar-gnrl', cargarGeneral);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-sexo', cargarSexo);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-edad', cargarEdad);
}
//Cargar Sexo

function cargarSexo() {
	
	limpiar();
	
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
							return "lt-tol-sexo lt-tol-sexo-"+miS+"";
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
							return "lt-tol-sexo lt-tol-sexo-"+miS+"";
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
							return "lt-tol-sexo lt-tol-sexo-"+miS+"";
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
			console.log(miDiv);
						
			//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
			lanzarBolas(miDiv, miDato, intSexo[i]);
		
		}//Fin de loop
		
	});
$('.lt-nav-desagregar').off('click', '.lt-btn-desagregar-sexo', cargarSexo);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-gnrl', cargarGeneral);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-edad', cargarEdad);	
}

//Cargar edad

function cargarEdad() {
	
	limpiar();
	
	
$('.lt-nav-desagregar').off('click', '.lt-btn-desagregar-edad', cargarEdad);	
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-sexo', cargarSexo);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-gnrl', cargarGeneral);
	
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
