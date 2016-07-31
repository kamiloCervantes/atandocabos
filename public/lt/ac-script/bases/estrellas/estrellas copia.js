			////////////////////////////////////////////////////////////// 
			//////////////////////// Set-Up ////////////////////////////// 
			////////////////////////////////////////////////////////////// 

			var margin = {top: 30, right: 30, bottom: 30, left: 30},
				width = 200,
				height = 200;
					
			////////////////////////////////////////////////////////////// 
			//////////////////// Draw the Chart ////////////////////////// 
			////////////////////////////////////////////////////////////// 

			var color = d3.scale.ordinal()
				.range(["#EDC951","#CC333F","#00A0B0"]);
				
			var radarChartOptions = {
			  w: width,
			  h: height,
			  margin: margin,
			  maxValue: 0.5,
			  levels: 5,
			  roundStrokes: true,
			  color: color
			};

			//Load the data and Call function to draw the Radar chart
			d3.json("ac-script/datos/estrella/d-estrella-general.json", function(error, data){
				
				//data es el universo de datos de un indicador
				
				var ind = data[0];//Guarda todo el contenido del indicador en una variable
				var numSubind = ind.contenido.length;//El número de Subindicadores
				var idInd = ind.idindicador;
				var titIndicador  = ind.titulo;
				var estiloIndicador  = ind.estilo;
				
				var indCont = $("#"+idInd+"");
				//d3.select('#fullpage').append("article").attr({id: idIndicador, class: "lt-ind lt-ind-"+estiloIndicador+""});
				
				
				var datoGeneral = [ind.contenido[0].contenido[0].contenido[0]];
				var datoSexo = ind.contenido[0].contenido[1].contenido[0];
				var datoEdad = [ind.contenido[0].contenido[2].contenido[0].contenido[0]];
				
				for (subind = 0; subind < numSubind; subind++) {
					
					//Datos
					
					var subindData = ind.contenido[subind];
					var numVistas = subindData.contenido.length;
					
									
					for (v = 0; v < numVistas; v++) {
						
						var vista = subindData.contenido[v].vista;
						
						if (vista === "gnrl") {
							
    						//Vista General
							var vgnrl = subindData.contenido[v];
							var nTrGnrl = vgnrl.contenido.length;
							
							
							for (tg = 0; tg < nTrGnrl; tg++) {
							
								var territorio = vgnrl.contenido[tg].territorio;
								
								if (territorio === "San Andres") {
									var mierda = vgnrl.contenido[tg]; 
								} else if (territorio === "Providencia") {
								
								} else if (territorio === "Nacional") {
								
								} else {
									console.log("Error en nombre de un territorio");
								}						
							}
													
							
						} else if (vista === "sexo") {
							
    						//Vista Sexo
							var vsexo = subindData.contenido[v].contenido;
							var nTrSexo = vsexo.lenght;
							
						} else if (vista === "edad") {
							
    						//Vista Edad
							var vedad = subindData.contenido[v].contenido;
							var nGrEdad = vsexo.lenght;
							
						} else {
   						 	console.log("Error en nombre de una vista");
						}
					}
					
					//Divs
					var subindDiv = subind+1;
    				var subActual = indCont.	find("#"+idInd+"-sub"+subindDiv+"");//Div
					
				}
								
				
				
				function graficar() {
				
				}
				RadarChart("#lt-1-1-gnrl-san", datoGeneral, radarChartOptions);	
				RadarChart("#lt-1-1-sexo-san", datoSexo, radarChartOptions);
				RadarChart("#lt-1-1-edad-g1-san", datoEdad, radarChartOptions);	
				
			});

			  
			
			
			
		