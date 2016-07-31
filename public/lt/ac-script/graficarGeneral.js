// JavaScript Document
function cargarGeneral() {
    var self = this;
//    console.log(self);
    var miArt = $(this).closest('.lt-ind'),
        miID = miArt.attr('id'),
        miGraf = miArt.data('graf'),
        miCont = miArt.find('.lt-cont-grafs'),
        miVista = $(this).val();

    //Limpiar contenedor
    miCont.html("");
    console.log("graficar");
    console.log($(self).closest('article')[0]);
    console.log($(self).closest('article').data('subpregunta'));
    //Cargar json adecuado según el ID de article
    d3.xhr("/servicios/getmultiple")
    .header("Content-Type", "application/json")  
    .post(
     JSON.stringify({subpregunta: $(self).closest('article').data('subpregunta') > 0 ? $(self).closest('article').data('subpregunta') : 0, indicador: $(self).closest('article').data('indicador'), vista: "general", tipografico: $(self).closest('article').data('graf') == 'bolas' ? 'estrella' : $(self).closest('article').data('graf')}), function(error, data) {
        /*=====Variables comunes=====*/
        data = JSON.parse(data.response);
        var datos = data;
        var idInd = datos[0].indicador;
        

        //Tomar los datos y anidarlos
        var dAnidados = d3.nest()
            .key(function(d) {
                return d.territorio;
            })
            .entries(datos);

        //Número de territorios = número de columnas
        var numCols = 12 / dAnidados.length;

        //*Tuve que volver a seleccionar el contenedor de grñáficas para que funcionara con d3
        var miContG = d3.select('#' + miID + '').select('.lt-cont-grafs');

        /*=====Fin Variables comunes=====*/
        
        if (miGraf == "estrella") {

            /*=====Variables comunes en los gráficos de estrella=====*/
			var margin = {
                top: 30,
                right: 30,
                bottom: 30,
                left: 30
				},
				width = 200,
				height = 200;
			
			//**Misma escala para General y Edad
			var color = d3.scale.ordinal()
				.range(["#4c54fc", "#CC333F", "#00A0B0"]);
	
			var radarChartOptions = {
				w: width,
				h: height,
				margin: margin,
				maxValue: 0.5,
				levels: 5,
				roundStrokes: true,
				color: color
			};
			
			/*=====Fin Variables comunes en los gráficos de estrella=====*/
			
            //Crear fila y columnas
            var ltCols = miContG.append("div")
                .attr("class", "row lt-grafs")
                .selectAll("div")
                .data(dAnidados)
                .enter()
                .append("div")
                .attr("class", "col-sm-" + numCols + "");
            
			//Agregar título de territorio	
            var titTerritorio = ltCols.append('h5')
                .attr('class', 'lt-tit-territorio')
                .text(function(d) {
                    return '' + d.key + '';
                });

            //Agregar div que contendrá cada gráfica svg
            var ltGraf = ltCols.append("div")
                .attr("class", "lt-graf")
                .attr("id", function(d) {
                    var terr = d.key.substring(0, 3);
                    return "lt-" + idInd + "-gnrl-" + terr + "";
                });

            //Loop para pintar gráficas
            for (i = 0; i < datos.length; i++) {

                var miDato = [datos[i]];
                
                var terr = datos[i].territorio.substring(0, 3);
                var miDiv = "#lt-" + idInd + "-gnrl-" + terr + "";
                console.log(miDato);
                if(miDato[0].datos.length > 0){                   
                    RadarChart(miDiv, miDato, radarChartOptions);
                }

            } //Fin de loop

        } else if (miGraf == "tolerancia") {
			
			var width = 150,
   				height = 150;
				
			//**Esto es igual a estrella
			
			//Crear fila y columnas
            var ltCols = miContG.append("div")
                .attr("class", "row lt-grafs")
                .selectAll("div")
                .data(dAnidados)
                .enter()
                .append("div")
                .attr("class", "col-sm-" + numCols + "");
            
			//Agregar título de territorio	
            var titTerritorio = ltCols.append('h5')
                .attr('class', 'lt-tit-territorio')
                .text(function(d) {
                    return '' + d.key + '';
                });

            //Agregar div que contendrá cada gráfica svg
            var ltGraf = ltCols.append("div")
                .attr("class", "lt-graf")
                .attr("id", function(d) {
                    var terr = d.key.substring(0, 3);
                    return "lt-" + idInd + "-gnrl-" + terr + "";
                });
			//**Fin de igual a estrella
			
			ltGraf.on('mouseenter', function() {
				var tooltip = $(this).find('.lt-tooltip');
					tooltip.css('opacity', 1);
			}).on('mouseleave', function() {
				var tooltip = $(this).find('.lt-tooltip');
					tooltip.css('opacity', 0);
			});
			
			var intGeneral = [];
			
			for(i = 0; i < datos.length; i++) {
			
				var miDato = datos[i].datos[1].valor;
				var terr = datos[i].territorio.substring(0,3);
				var miDiv = "#lt-"+idInd+"-gnrl-"+terr+"";
								
				//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
				lanzarBolas(miDiv, miDato, intGeneral[i]);
			
			}//Fin de loop
			
		} else if (miGraf == "linea"){
			
			//Tomar los datos y anidarlos
			var gnrlArray = d3.nest()
				.key(function(d) { return d.territorio;})
				.key(function(d) { return d.fecha;})
				.entries(datos);
				
			//Crear contenedor
			var lineaCont = miContG.append('div')
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
			
			var linearScale = d3.scale.linear()
				.domain([0, dMax])
				.range([0,100]);
			
			
			grafs.on('mouseenter', function() {
				var tooltip = $(this).find('.lt-tooltip');
					tooltip.css('opacity', 1);
			}).on('mouseleave', function() {
				var tooltip = $(this).find('.lt-tooltip');
					tooltip.css('opacity', 0);
			});
			
			var intGeneralLinea = [];
							   
			//Loop para pintar 	las gráficas
			for(i = 0; i < datos.length; i++) {
				
				var miDato = datos[i].valor;//Obtener Valor
				var terr = datos[i].territorio.substring(0,3);
				var fecha = datos[i].fecha;
				var nBolas = linearScale(miDato);//Pasar el valor por escala
				
				var miDiv = '#lt-'+idInd+'-gnrl-'+terr+'-'+fecha+'';
							
				//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
				lanzarBolasLinea(miDiv, miDato, nBolas, intGeneralLinea[i]);
			
			}//Fin de loop
				
		
		}
                else if (miGraf == "bolas") {
			
			
			bolasEstructura(datos, miContG, idInd, "gnrl");
			
			var dAnidadosTyG = d3.nest()
				.key(function(d) {
					return d.territorio;
				})
				.key(function(d) {
					return d.indicador;
				})
				.entries(datos);
	
			for (i = 0; i < dAnidadosTyG.length; i++) {
				var t = dAnidadosTyG[i].key.substring(0, 3),
					miDiv = "#lt-" + idInd + "-gnrl-" + t + "",
					miDato = dAnidadosTyG[i].values,
					escala = [2, 58]
				carga = -200;
				bolasSimples(miDiv, miDato, idInd, "gnrl", escala, carga);
			}
		} else {
            console.log("Tipo de gráfica incorrecto")
        }
    }); //Fin de carga del json

} //Fin de cargarGeneral
