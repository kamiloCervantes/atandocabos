var width = 360,
    height = 200;

//Load the data and Call function to draw the Radar chart



d3.json("ac-script/datos/d-tolerancia.json", function(error, data){
	
	var datos = data;
	var numDatos = datos.length;
	
	var interval = [];
		
	for(i = 0; i < numDatos; i++) {
		var miDato = datos[i].datos[1].valor;
		var miDiv = datos[i].id;
		console.log(miDato + miDiv);
		
		//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
		lanzarBolas(miDiv, miDato, interval[i]);
	
	}//Fin de loop
	
});

d3.json("ac-script/datos/d-tolerancia-edad.json", function(error, data){
	
	var datos = data;
	var numDatos = datos.length;
	
	var interval = [];
		
	for(i = 0; i < numDatos; i++) {
		var miDato = datos[i].datos[1].valor;
		var miDiv = datos[i].id;
		console.log(miDato + miDiv);
		
		//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
		lanzarBolas(miDiv, miDato, interval[i]);
	
	}//Fin de loop
	
});

d3.json("ac-script/datos/d-tolerancia-sexo.json", function(error, data){
	
	var datos = data;
	var numDatos = datos.length;
	
	var interval = [];
		
	for(i = 0; i < numDatos; i++) {
		var miDato = datos[i].datos[1].valor;
		var miDiv = datos[i].id;
		console.log(miDato + miDiv);
		
		//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
		lanzarBolas(miDiv, miDato, interval[i]);
	
	}//Fin de loop
	
});


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
			.charge(-10)
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
		}, 50);
}




$('.lt-tolerancia').on('mouseenter', '.lt-graf', function() {
	var tooltip = $(this).find('.lt-tooltip');
		tooltip.css('opacity', 1);
});
$('.lt-tolerancia').on('mouseleave', '.lt-graf', function() {
	var tooltip = $(this).find('.lt-tooltip');
		tooltip.css('opacity', 0);
});

