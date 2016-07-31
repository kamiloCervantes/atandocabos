// JavaScript Document
function cargarSexo() {
    var self = this;
    var miArt = $(this).closest('.lt-ind'),
        miID = miArt.attr('id'),
        miGraf = miArt.data('graf'),
        miCont = miArt.find('.lt-cont-grafs'),
        miVista = $(this).val();

    //Limpiar contenedor
    miCont.html("");

    //Cargar json adecuado según el ID de article
    d3.xhr("/servicios/getmultiple")
    .header("Content-Type", "application/json")  
    .post(
     JSON.stringify({subpregunta: $(self).closest('article').data('subpregunta') > 0 ? $(self).closest('article').data('subpregunta') : 0, indicador: $(self).closest('article').data('indicador'), vista: "sexo", tipografico: $(self).closest('article').data('graf') == 'bolas' ? 'estrella' : $(self).closest('article').data('graf')}), function(error, data) {
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

        //*Tuve que volver a seleccionar el contenedor de gráficas para que funcionara con d3
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
			
			//**En Sexo esta escala es diferente
			var color = d3.scale.ordinal()
				.range(["#33d3b5", "#b80d80"]);
	
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
			
			//**En sexo se hace un segundo Array anidado por sexo
			var dAnidadosSexo = d3.nest()
				.key(function(d) {
					return d.sexo;
				})
				.entries(datos);
			
			//**Nuevo en sexo
			var btnsSexo = miContG.append('div')
				.attr('class', 'lt-nav-sexo')
				.selectAll('div')
				.data(dAnidadosSexo)
				.enter()
				.append('a')
				.attr({ 
					'class': 'lt-btn-check lt-btn-check-sexo activo',
					'data-ltsexo': function(d, i){ 
						var sexo = d.key;
						return 'sexo-'+i+'';
					},
					'href': '#'
				})
				.text(function(d){ 
					return ''+d.key+'';
				});
			
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
			//**En sexo -gnrl- cambia por -sexo-
            var ltGraf = ltCols.append("div")
                .attr("class", "lt-graf")
                .attr("id", function(d) {
                    var terr = d.key.substring(0, 3);
                    return "lt-" + idInd + "-sexo-" + terr + "";
                });

            //Loop para pintar gráficas
			//**En sexo -gnrl- cambia por -sexo-
			//**En sexo cambia miDato y terr
			for(i = 0; i < dAnidados.length; i++) {
			
				var miDato = dAnidados[i].values;
				var terr = dAnidados[i].values[0].territorio.substring(0,3);
				var miDiv = "#lt-" + idInd + "-sexo-" + terr + "";
				//console.log(miDato);
				if(miDato[0].datos.length > 0){ 
                                    RadarChart( miDiv, miDato, radarChartOptions);
                                }
				
		
			}//Fin de loop

        } else if (miGraf == "tolerancia") {
			
			
			
			var width = 150,
   				height = 150;
				
			//**Esto es igual a estrella
			
			//**En sexo otro Array anidado para generar botones
			var dAnidadosSexo = d3.nest()
				.key(function(d) { return d.sexo; })
				.entries(datos);
			
			//**Nuevo en sexo
			var btnsSexo = miContG.append('div')
				.attr('class', 'lt-nav-sexo')
				.selectAll('div')
				.data(dAnidadosSexo)
				.enter()
				.append('a')
				.attr({ 
					'class': 'lt-btn-check lt-btn-check-sexo activo',
					'data-ltsexo': function(d, i){ 
						var sexo = d.key.substring(0,1);
						return 'sexo-'+sexo+'';
					},
					'href': '#'
				})
				.text(function(d){ 
					return ''+d.key+'';
			});	
			
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
			
			//**Fin de igual a estrella
			
			//Agregar div que contendrá cada gráfica svg
			//**En tolerancia ltGraf no lleva ID
            var ltGraf = ltCols.append("div")
                .attr("class", "lt-graf");
			
			//**Agregar dos div por .lt-graf
			var tolSexo = ltGraf.selectAll('div')
				.data(function(d){ return d.values; })
				.enter()
				.append('div')
				.attr('class', function (d){
					var sexo = d.sexo.substring(0,1);
					return 'lt-tol-sexo sexoActivo sexo-'+sexo+'';
				}).attr('id', function (d){
					var terr = d.territorio.substring(0,3);
					var sexo = d.sexo.substring(0,1);
					return 'lt-'+idInd+'-sexo-'+terr+'-'+sexo+'';
			});
			
			ltGraf.on('mouseenter', function() {
				var tooltip = $(this).find('.lt-tooltip');
					tooltip.css('opacity', 1);
			}).on('mouseleave', function() {
				var tooltip = $(this).find('.lt-tooltip');
					tooltip.css('opacity', 0);
			});
			
			var intSexo = [];
			
			for(i = 0; i < datos.length; i++) {
			
				var miDato = datos[i].datos[1].valor;
				var terr = datos[i].territorio.substring(0,3);
				var sexo = datos[i].sexo.substring(0,1);
				
				var miDiv = "#lt-"+idInd+"-sexo-"+terr+"-"+sexo+"";
							
				//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
				lanzarBolas(miDiv, miDato, intSexo[i]);
			
			}//Fin de loop
			
		} else if (miGraf == "linea") {
			
		//Tomar los datos y anidarlos
		var sexoArray = d3.nest()
    		.key(function(d) { return d.territorio;})
			.key(function(d) { return d.sexo;})
    		.key(function(d) { return d.fecha;})
    		.entries(datos);
			
		//console.log(sexoArray);
		//Anidar Datos por sexo
		var sexoArrayS = d3.nest()
    		.key(function(d) { return d.sexo;})
    		.entries(datos);
		
		//Crear botones
		var btnSexo = miContG.append('div')
			.attr('class', 'lt-nav-sexo')
			.selectAll('div')
			.data(sexoArrayS)
			.enter()
			.append('a')
			.attr({ 
				'class': 'lt-btn-check lt-btn-check-sexo activo',
				'data-ltsexo': function(d){ 
					var sexo = d.key.substring(0,1);
					return ''+sexo+'';
				},
				'href': '#'
			})
			.text(function(d){ 
				return ''+d.key+'';
			});
		
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
			.data(sexoArray[0].values[0].values)
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
				
		//Crear las filas de Territorio	
		var fTerGnrl = fCuerpo.selectAll('div')
			.data(sexoArray)
			.enter()
			.append('div')
			.attr('class', function(d){
					var ter = d.key.substring(0,3);
					return 'row lt-'+idInd+'-sexo-'+ter+'';
			});
		//Crear col Territorio
		var cTerr = fTerGnrl.append('div')
			.attr('class', 'col-md-1')
			.append('h5')
			.text(function(d){
				var ter = d.key;
					return ''+ter+'';
			});
		//Crear contenedor de filas de sexo
		var cContSexo = fTerGnrl.append('div')
			.attr('class', 'col-md-11');
			
		//Crear filas de sexo por cada territorio
		var fsexo = cContSexo.selectAll('div')
			.data(function(d){ return d.values; })
			.enter()
			.append('div')
			.attr('class', function(d){
				var sexo = d.key.substring(0,1);
				return 'row lt-sexo-'+sexo+'';
				
			});	
		//Agregar col título de sexo
		var fsexoTit = fsexo.append('div')
			.attr('class','col-md-2')
			.append('h5')
			.attr('class', 'lt-linea-tit-sx')
			.text(function(d){
				var sexo = d.key;
				return ''+sexo+'';
			});
		
		//Agregar col de gráficas de sexo
		var fsexoCInfo = fsexo.append('div')
			.attr('class','col-md-10')
			.append('div')
			.attr('class', 'row');
		
		//Crear divs para gráficos
		var grafs = fsexoCInfo.selectAll('div')
			.data(function(d){ return d.values; })
			.enter()
			.append('div')
			.attr('class', 'col-md-2 lt-graf')
			.attr('id', function(d){
				var terr = d.values[0].territorio.substring(0,3);
				var sexo = d.values[0].sexo.substring(0,1);
				var fecha = d.values[0].fecha;
				return 'lt-'+idInd+'-sexo-'+terr+'-'+sexo+'-'+fecha+'';
			});
		
		grafs.on('mouseenter', function() {
				var tooltip = $(this).find('.lt-tooltip');
					tooltip.css('opacity', 1);
			}).on('mouseleave', function() {
				var tooltip = $(this).find('.lt-tooltip');
					tooltip.css('opacity', 0);
			});
			
		//Crear Escala para valores
		var dMax = d3.max(datos, function(d) { return d.valor; });
		//console.log(dMax);
		
		var linearScale = d3.scale.linear()
                          .domain([0, dMax])
                         	.range([1,50]);
		
		var intSexoLinea = [];	
					   
		//Loop para pintar 	las gráficas
		for(i = 0; i < datos.length; i++) {
			
			var miDato = datos[i].valor;//Obtener Valor
			var terr = datos[i].territorio.substring(0,3);
			var fecha = datos[i].fecha;
			var sexo = datos[i].sexo.substring(0,1);
			
			var nBolas = linearScale(miDato);//Pasar el valor por escala
			
			var miDiv = '#lt-'+idInd+'-sexo-'+terr+'-'+sexo+'-'+fecha+'';
						
			//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
			lanzarBolasLinea(miDiv, miDato, nBolas, intSexoLinea[i]);
		
		}//Fin de loop
		
		} else if (miGraf == "bolas"){
			
			crearBotones(datos, miContG, 'sexo');
			
			bolasEstructura(datos, miContG, idInd, "sexo");
			
        var dAnidadosTyS = d3.nest()
            .key(function(d) {
                return d.territorio;
            })
            .key(function(d) {
                return d.sexo;
            })
            .entries(datos);

        for (i = 0; i < dAnidadosTyS.length; i++) {
            var t = dAnidadosTyS[i].key.substring(0, 3),
                miDiv = "#lt-" + idInd + "-sexo-" + t + "",
                miDato = dAnidadosTyS[i].values,
                escala = [2, 108],
            	carga = -70;
            	bolasSimples(miDiv, miDato, idInd, "sexo", escala, carga);
        }
		} else {
            console.log("Tipo de gráfica incorrecto")
        }
    }); //Fin de carga del json

} //Fin de cargarGeneral



//BOTONES SEXO
$('.lt-cont-grafs').on('click', '.lt-btn-check-sexo', function (e){
		e.preventDefault();
		var indActual = $(this).closest('.lt-cont-grafs'),
			btnActual = $(this).data('ltsexo'),
			artActual = $(this).closest('.lt-ind'),
			tipoGraf = artActual.data('graf'),
			grafActual = indActual.find('.'+btnActual+'');
		
		$(this).toggleClass('activo');

		if (tipoGraf == "estrella") {
			grafActual.toggle(500);
		} else if (tipoGraf == "tolerancia") {
			grafActual.toggleClass('sexoActivo');
		}  else if (tipoGraf == "linea") {
			var fActual = indActual.find('.lt-sexo-'+btnActual+'');
			fActual.slideToggle();
		} else {
			console.log('Hay algo mal con los botones de Sexo');
		}
});

