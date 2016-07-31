// JavaScript Document
var width = 150,
    height = 150;
	
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