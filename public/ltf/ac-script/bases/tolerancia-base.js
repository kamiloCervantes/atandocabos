// JavaScript Document

function lanzarBolas (miDiv, miDato, interval, vista) {
		
		var miValor = miDato.datos[1].valor,
			miRta = miDato.datos[1].respuesta,
			migDes = (vista == "edad") ? miDato.edad : (vista == "sexo") ? miDato.sexo : "";
		
		var nodes = [];
	
		var svg = d3.select(miDiv).append("svg")
			.attr("width", wTol)
			.attr("height", hTol);
		
		var tooltip = d3.select(miDiv).append("p")
			.attr("class", "lt-tooltip");
			
		tooltip.append('span')
			.attr('class', 'tip-dato')
			.text('El '+miValor*100+"%");
			
		tooltip.append('span')
			.attr('class', 'tip-gDes')
			.text(function(){ 
				var d = (vista == 'edad') ? 'De los de '+migDes+' años' : 
				(vista == 'sexo') ? 'De sexo: '+migDes :
				'';
				
				return d;
			});
		
		tooltip.append('span')
			.attr('class', 'tip-rta')
			.text(miRta);
			
		
			
		var force = d3.layout.force()
			.charge(-6)
			.size([wTol, hTol])
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
							x: wTol / 2 + 2 * Math.random() - 1,
							y: hTol / 2 + 2 * Math.random() - 1
						  };
					
					  g.append("circle")
						  .data([d])
						  .attr("r", 1e-6)
						.transition()
						  .ease(Math.sqrt)
						  .attr("r", 4.5);
					
					  if (nodes.push(d) > miValor*100-1) {
						  clearInterval(interval);
					  }
					  force.start();
		}, 70);
}