/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////
function RadarChart(id, data, options, laVista) {
    var cfg = {
        w: 600, //Width of the circle
        h: 600, //Height of the circle
        margin: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        }, //The margins of the SVG
        levels: 6, //How many levels or inner circles should there be drawn
        maxValue: 1.2, //What is the value that the biggest circle will represent
        labelFactor: 1.16, //How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, //The opacity of the area of the blob
        dotRadius: 5, //The size of the colored circles of each blog
        opacityCircles: 0.1, //The opacity of the circles of each blob
        strokeWidth: 2, //The width of the stroke around each blob
        roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scale.category10() //Color function
    };

    //Put all of the options into a variable called cfg
    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) {
                cfg[i] = options[i];
            }
        } //for i
    } //if

    // convert the nested data passed in
    // into an array of values arrays
    //console.log(data);
    var datosCompletos = data;
    var dHechizo = [];

    data.forEach(function(p, ip) {
        dHechizo.push([]);

        p.datos.forEach(function(h, ih) {
			
			var laClave = (laVista == "edad") ? p.edad : (laVista == "sexo") ? p.sexo : 'gnrl';
			
            dHechizo[ip].push({
                indicador: p.indicador,
                territorio: p.territorio,
                respuesta: h.respuesta,
                valor: h.valor,
                clave: laClave,
				vista: laVista
            });
        });
    });

    //data = data.map(function(d) { return d.datos;	});//lt-cambio values por datos

    data = dHechizo;
	
	
		
	
    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i) {
        return d3.max(i.map(function(o) {
            return o.valor;
        }))
    })); //lt-cambio value por valor
	
	
	var allAxisH = (laVista == 'sexo') ? data[1].map(function(i) {	var rObj = {valorB: i.valor, claveB : i.clave};
            return rObj;
        }): '';
	
    var allAxis = data[0].map(function(i) {
						
			var rObj = {
				rta: i.respuesta,
				valor: i.valor,
				clave: i.clave
			};
            return rObj;
        }), //Names of each axis lt-cambio axis por respuesta
		total = allAxis.length, //The number of different axes
        radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
        Format = d3.format('%'), //Percentage formatting
        angleSlice = Math.PI * 2 / total; 
		//The width in radians of each "slice"

	//Función Ganadora
	
	allAxis = (laVista == 'sexo') ? allAxis.map(function(d, i){
		var rObj = {
				rta: d.rta,
				valor: d.valor,
				clave: d.clave,
				valorB: allAxisH[i].valorB,
				claveB: allAxisH[i].claveB
			};
            return rObj;
	}) : allAxis;
	
	
	//console.log(allAxis);
    //Scale for the radius
    var rScale = d3.scale.linear()
        .range([0, radius])
        .domain([0, maxValue]);

    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();

    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
        .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar" + id);
    //Append a g element		
    var g = svg.append("g")
        .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////

    //Filter for the outside glow
    var filter = g.append('defs').append('filter').attr('id', 'glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////

    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");



    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////

    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", function(d, i) {
			return "axis lt-eje-"+(i+1);
		});
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i) {
            return rScale(maxValue * 1.2) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("y2", function(d, i) {
            return rScale(maxValue * 1.2) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .attr("class", "line")
        .style("stroke", "#caba9f")
        .style("stroke-width", "1px");

    //Append the labels at each axis
    /*axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i) {
            return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("y", function(d, i) {
            return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .text(function(d) {
            return d
        })
        .call(wrap, cfg.wrapWidth);*/

    axis.append('circle')
        .attr("class", "conv-est")
        .attr("text-anchor", "middle")
        .attr("r", 8)
        .attr("cx", function(d, i) {
            return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("cy", function(d, i) {
            return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
        });
		
	axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i) {
            return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("y", function(d, i) {
            return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .text(function(d, i) {
            return i+1;
        })
        .call(wrap, cfg.wrapWidth);
	
	//Porcentajes
	var txtPorc = axis.append("text")
        .attr("class", "porc-est")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i) {
            return rScale(maxValue * cfg.labelFactor*1.22) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("y", function(d, i) {
            return rScale(maxValue * cfg.labelFactor*1.22) * Math.sin(angleSlice * i - Math.PI / 2);
        });
        
       // .call(wrap, cfg.wrapWidth);

	txtPorc.append('tspan')
		.text(function(d) {
			
			var porc = Math.round(d.valor * 100) + '%';
            return porc;
        })
		.attr('class', function(d){
			var p = (laVista == 'sexo') ? 'pgSexo-'+d.clave.substring(0,1) : 'p-est';
			return p;
		});
	
	if (laVista == 'sexo') {
		
	txtPorc.append('tspan')
		.text(function(d) {
			var porc = ' '+Math.round(d.valorB * 100) + '%';
            return porc;
        })
		.attr('class', function(d){
			var s = d.claveB.substring(0,1);
			return 'pgSexo-'+s;
		})
		.attr('dy', '9')
		.attr('dx', '-22');
	}



    //Draw the background circles
    axisGrid.selectAll(".levels")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", function(d, i) {
            return "gridCircle c-est-" + i;
        })
        .attr("r", function(d, i) {
            return radius / cfg.levels * d;
        })
        .style("fill", "transparent")
        .style("stroke", "#caba9f");

    //.style("fill-opacity", cfg.opacityCircles);

    //.style("filter" , "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", function(d) {
            return -d * radius / cfg.levels;
        })
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(function(d, i) {
            return Format(maxValue * d / cfg.levels - 0.2);
        });
    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////

    //The radial line function lt-cambio value por valor
    var radarLine = d3.svg.line.radial()
        .interpolate("linear-closed")
        .radius(function(d) {
            return rScale(d.valor + 0.2);
        })
        .angle(function(d, i) {
            return i * angleSlice;
        });

    if (cfg.roundStrokes) {
        radarLine.interpolate("cardinal-closed")
            .tension(0.7);
        //radarLine.interpolate(function(points) { return points.join("A 1,1 0 0 1 "); });
    }

    //Create a wrapper for the blobs
    //lt-cambio class	
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", function(d, i) {
			console.log(d);
			var s = (laVista == 'sexo') ? ' gSexo-'+d[0].clave.substring(0,1) : '';
            return 'radarWrapper' + s ;
        });

    //Append the backgrounds	
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d, i) {
            return radarLine(d);
        })
        .style("fill", function(d, i) {
            return cfg.color(i);
        })
        .style("fill-opacity", cfg.opacityArea);
        /*.on('mouseover', function(d, i) {
            //Dim all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1);
            //Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);
        })
        .on('mouseout', function() {
            //Bring back all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });*/

    //Create the outlines	
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d, i) {
            return radarLine(d);
        })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d, i) {
            return cfg.color(i);
        })
        .style("fill", "none");
    //.style("filter" , "url(#glow)");		

    //Append the circles lt-cambio value por valor 2 veces
    var circEst = blobWrapper.selectAll(".radarCircle")
        .data(function(d, i) {
            return d;
        })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function(d, i) {
            return rScale(d.valor + 0.2) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("cy", function(d, i) {
            return rScale(d.valor + 0.2) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .style("fill", function(d, i, j) {
            return cfg.color(j);
        })
        .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////

    //Wrapper for the invisible circles on top
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
    	.data(data)
    	.enter().append("g")
    	.attr("class", function(d, i){
			var s = (laVista == 'sexo') ? ' gSexo-'+d[0].clave.substring(0,1) : '';
    		return 'radarCircleWrapper' + s ;
    	});

    //Append a set of invisible circles on top for the mouseover pop-up lt-cambio value por valor 3 veces
    var cInv = blobCircleWrapper.selectAll(".radarInvisibleCircle")
    	.data(function(d,i) { return d; })
    	.enter().append("circle")
    	.attr("class", "radarInvisibleCircle")
    	.attr("r", cfg.dotRadius*1.5)
    	.attr("cx", function(d,i){ return rScale(d.valor+0.2) * Math.cos(angleSlice*i - Math.PI/2); })
    	.attr("cy", function(d,i){ return rScale(d.valor+0.2) * Math.sin(angleSlice*i - Math.PI/2); })
    	.style("fill", "none")
		.style("cursor", "pointer")
    	.style("pointer-events", "all");
    	/*
		.on("mouseover", function(d,i) {
    		//console.log(d);
    		newX =  parseFloat(d3.select(this).attr('cx')) - 10;
    		newY =  parseFloat(d3.select(this).attr('cy')) - 10;
    				
    		tooltip
    			.attr('x', newX)
    			.attr('y', newY)
    			.text(Format(d.valor))
    			.transition().duration(200)
    			.style('opacity', 1);
    	})
    	.on("mouseout", function(){
    		tooltip.transition().duration(200)
    			.style("opacity", 0);
    	});*/

    //Set up the small tooltip for when you hover over a circle
    /*var tooltip = g.append("text")
    	.attr("class", "tooltip")
    	.style("opacity", 0);*/

    //Tooltips versión 2

    function tooltipBolas(e, circ) {
        
		var tip = $(circ).closest('.lt-graf').children('.lt-tooltip-est'),
			porc = Math.round(e.valor * 100) + '%',
			rta = e.respuesta.toLowerCase(),
			clave = e.clave,
			xC = parseInt($(circ).attr('cx')),
            yC = parseInt($(circ).attr('cy')),
            rC = parseInt($(circ).attr('r')),
			txtDin = (e.respuesta == '1' || e.respuesta == '2' || e.respuesta == '3' || e.respuesta == '4' || e.respuesta == '5' || e.respuesta == 'Muy segura' || e.respuesta == 'Muy insegura') ? 'La califican ' : 'Dicen ',
			infoTool = (e.vista == "edad") ? '<p class="tip-dato">El ' + porc + '</p><p class="tip-gDes">de ' + clave + ' años</p><p class="tip-rta">'+txtDin+ rta + '</p>' :
            (e.vista == "sexo") ? '<p class="tip-dato">El ' + porc + '</p><p class="tip-gDes">de sexo ' + clave + '</p><p class="tip-rta">'+txtDin + rta + '</p>' :
            '<p class="tip-dato">El ' + porc + '</p><p class="tip-rta">'+txtDin + rta + '</p>';
			
			tip.css({
            left: xC + 83 + 'px',
            bottom: 216 - yC + rC - 45 + 'px'
        	});
        //console.log(e);
        tip.show();
		tip.html(infoTool);
		
        /*tip.html(infoTool);*/
    }
    cInv.on("mouseover", function(d) {
        tooltipBolas(d, this);

    }).on("mouseout", function(d) {
        var tip = $(this).closest('.lt-graf').children('.lt-tooltip-est');
        tip.hide();
    });

    /////////////////////////////////////////////////////////
    /////////////////// Helper Function /////////////////////
    /////////////////////////////////////////////////////////

    //Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text	
    function wrap(text, width) {
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
    //wrap	



} //RadarChart
//Convenciones Estrella
function convEstrellas(elCont, losDatos) {
    var conv = elCont.append("div")
        .attr("class", "lt-estrella-conv")
        .selectAll("div")
        .data(losDatos[0].datos)
        .enter()
        .append("div")
        .attr("class", "col-conv-est")
        .append('h6')
        .attr('href', '#')
        .attr('class', function(d, i) {
            i = i + 1;

            return 'rta-estrella-' + i + '';
        });

    conv.append('span')
        .attr('class', 'est-bolita')
        .text(function(d, i) {
            i = i + 1;
            return i;
        });;

    conv.append('span')
        .attr('class', 'lt-label-conv')
        .text(function(d) {
            return '' + d.respuesta + '';
        });
}