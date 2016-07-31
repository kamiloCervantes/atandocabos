// JavaScript Document
var widthLinea = 110,
    heightLinea = 110;
	
function lanzarBolasLinea (miDiv, miDato, nBolas, interval) {
	
		var nodes = [];
	
		var svg = d3.select(miDiv).append("svg")
			.attr("width", widthLinea)
			.attr("height", heightLinea);
		
		var tooltip = d3.select(miDiv).append("p")
			.attr("class", "lt-tooltip")
			.text(''+miDato+' Casos')
			.append("span")
			.text("De violencia");
			
		var force = d3.layout.force()
			.charge(-3)
			.size([widthLinea, heightLinea])
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
							x: widthLinea / 2 + 2 * Math.random() - 1,
							y: heightLinea / 2 + 2 * Math.random() - 1
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