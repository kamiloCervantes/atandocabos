// JavaScript Document
function cargarEdad() {
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
     JSON.stringify({subpregunta: $(self).closest('article').data('subpregunta') > 0 ? $(self).closest('article').data('subpregunta') : 0, indicador: $(self).closest('article').data('indicador'), vista: "edad", tipografico: $(self).closest('article').data('graf') == 'bolas' ? 'estrella' : $(self).closest('article').data('graf')}), function(error, data) {
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
				.range(["#EDC951", "#CC333F", "#00A0B0"]);
	
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
			
			
			//**En edad se hace un segundo Array. Se anidad primero por edad y luego territorio
			var dAnidadosEdad = d3.nest()
				.key(function(d) {
					return d.edad;
				})
				.key(function(d) {
					return d.territorio;
				})
				.entries(datos);
			
			//Crear botones
			//**Función similar a sexo
			//**En edad cambia sexo por edad en todos lados
			//**En edad cambia la funcion para data-ltedad
			var btnsEdad = miContG.append('div')
				.attr('class', 'lt-nav-edad')
				.selectAll('div')
				.data(dAnidadosEdad)
				.enter()
				.append('a')
				.attr({ 
					'class': 'lt-btn-check lt-btn-check-edad activo',
					'data-ltedad': function(d){ 
						var edad = d.key.replace(/\+/g, '');
						return 'gEdad-'+edad+'';
					},
					'href': '#'
				})
				.text(function(d){ 
					return ''+d.key+'';
				});
			
            //**Crear las filas	de edad
			var filasEdad = miContG.append('div')
				.attr('class', 'row lt-grafs')
				.append('div')
				.attr('class', 'col-xs-12')
				.selectAll('div')
				.data(dAnidadosEdad)
				.enter()
				.append('div')
				.attr('class', function(d){
					var gEdad = d.key.replace(/\+/g, '');
					return 'row gEdad-'+gEdad+'';
				})
				.append('div')
				.attr("class", "col-xs-12");
			
			//**Crear titulos de fila
			var titsEdad = filasEdad.append('div')
				.attr("class", "row lt-edad-g-tit")
				.append('div')
				.attr("class", "col-xs-12")
				.append("span")
				.attr("class", "lt-g-edad-label")
				.text(function(d){
					return ''+d.key+'';
				});
				
			//**Crear las columnas de edad
			var colsEdad = filasEdad.append('div')
				.attr("class", "row")
				.selectAll('div')
				.data(function(d){ return d.values; })
				.enter()
				.append('div')
				.attr("class", "col-sm-" + numCols + "");
				
			//Agregar título de territorio
			//**En edad Le cambio ltCols por colsEdad	
			var titTerritorio = colsEdad.append('h5')
				.attr('class', 'lt-tit-territorio')
				.text(function(d) {
					return '' + d.key + '';
				});
			
			//Agregar div que contendrá cada gráfica svg
			//**En edad Le cambio ltCols por colsEdad
			var grafEdad = colsEdad.selectAll('div')
				.data(function(d){ return d.values; })
				.enter()
				.append('div')
				.attr('class', 'lt-graf')
				.attr('id', function(d){ 
					var gEdad = d.edad.replace(/\+/g, '');
					var terr = d.territorio.substring(0,3);
					return 'lt-'+idInd+'-edad-'+gEdad+'-'+terr+'';
				});

            
			//Loop para pintar gráficas
			//**En edad cambio un poco respecto al general
			for(i = 0; i < datos.length; i++) {
				
				var miDato = [datos[i]];
				var gEdad = datos[i].edad.replace(/\+/g, '');
				var terr = datos[i].territorio.substring(0,3);
				var miDiv = '#lt-'+idInd+'-edad-'+gEdad+'-'+terr+'';
				//console.log(miDato);
				if(miDato[0].datos.length > 0){ 
                                    RadarChart( miDiv, miDato, radarChartOptions);
                                }
				
			
			}//Fin de loop

        } else if (miGraf == "tolerancia") {
			
			var width = 150,
   				height = 150;
				
			//**En edad se hace un segundo Array. Se anidad primero por edad y luego territorio
			var dAnidadosEdad = d3.nest()
				.key(function(d) {
					return d.edad;
				})
				.key(function(d) {
					return d.territorio;
				})
				.entries(datos);
			
			//Crear botones
			//**Función similar a sexo
			//**En edad cambia sexo por edad en todos lados
			//**En edad cambia la funcion para data-ltedad
			var btnsEdad = miContG.append('div')
				.attr('class', 'lt-nav-edad')
				.selectAll('div')
				.data(dAnidadosEdad)
				.enter()
				.append('a')
				.attr({ 
					'class': 'lt-btn-check lt-btn-check-edad activo',
					'data-ltedad': function(d){ 
						var edad = d.key.replace(/\+/g, '');
						return 'gEdad-'+edad+'';
					},
					'href': '#'
				})
				.text(function(d){ 
					return ''+d.key+'';
				});
			
			//Crear etiquetas de territorio, exclusivo de edad tolerancia
			var tTerrFilas = miContG.append('div')
				.attr('class', 'row lt-tits-territorio-fEdad')
				.selectAll('div')
				.data(dAnidados)
				.enter()
				.append('div')
				.attr("class", "col-sm-"+numCols+"")
				.append('h5')
				.attr('class', 'lt-tit-territorio')
				.text(function(d){ 
					return ''+d.key+'';
				});
			
            //Crear las filas	
			var filasEdad = miContG.append('div')
				.attr('class', 'lt-filas-edad')
				.selectAll('div')
				.data(dAnidadosEdad)
				.enter()
				.append('div')
				.attr('class', function(d){
					var gEdad = d.key.replace(/\+/g, '');
					return 'row gEdad-'+gEdad+'';
				});
			
			var spanFila = filasEdad.append('span')
				.attr('class', 'lt-tol-edad-span')
				.text(function(d){ 
					return ''+d.key+'';
				});
			
			//Crear las columnas dentro de cada fila
			var colsEdad = filasEdad.selectAll('div')
				.data(function(d){ return d.values; })
				.enter()
				.append('div')
				.attr("class", "col-sm-"+numCols+"");
			
			//Agregar título de territorio	
			var titTerritorio = colsEdad.append('h5')
				.attr('class', 'lt-tit-territorio')
				.text(function(d){ 
					return ''+d.key+'';
				});
			
			//Agregar contenedor de cada gráfica
			var ltGraf = colsEdad.selectAll('div')
				.data(function(d){ return d.values; })
				.enter()
				.append('div')
				.attr('class', 'lt-graf')
				.attr('id', function(d){ 
					var gEdad = d.edad.replace(/\+/g, '');
					var tTrio = d.territorio.substring(0,3);
					return 'lt-'+idInd+'-edad'+gEdad+'-'+tTrio+'';
				});
				
			ltGraf.on('mouseenter', function() {
					var tooltip = $(this).find('.lt-tooltip');
						tooltip.css('opacity', 1);
				}).on('mouseleave', function() {
					var tooltip = $(this).find('.lt-tooltip');
						tooltip.css('opacity', 0);
				});
			var intEdad = [];
			
			//Loop para pintar las gráficas
			//**En tolerancia cambia miDato y la función que llama
			for(i = 0; i < datos.length; i++) {
				
				var miDato = datos[i].datos[1].valor;//Obtener Valor de Respuesta Le es indiferente
				var gEdad = datos[i].edad.replace(/\+/g, '');
				var terr = datos[i].territorio.substring(0,3);
				
				var miDiv = '#lt-'+idInd+'-edad'+gEdad+'-'+terr+'';
							
				//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
				lanzarBolas(miDiv, miDato, intEdad[i]);
			
			}//Fin de loop
			
		} else if (miGraf == "linea") {
			//Tomar los datos y anidarlos
		var edadArray = d3.nest()
    		.key(function(d) { return d.territorio;})
			.key(function(d) { return d.edad;})
    		.key(function(d) { return d.fecha;})
    		.entries(datos);
			
		//console.log(edadArray);
		
		//Anidar Datos por edad para crear botones
		var edadArrayE = d3.nest()
    		.key(function(d) { return d.edad;})
    		.entries(datos);
		
		//Crear botones
		var btnEdad = miContG.append('div')
			.attr('class', 'lt-nav-edad')
			.selectAll('div')
			.data(edadArrayE)
			.enter()
			.append('a')
			.attr({ 
				'class': 'lt-btn-check lt-btn-check-edad activo',
				'data-ltedad': function(d){ 
					var edad = d.key.replace(/\+/g, '');
					return 'gEdad-'+edad+'';
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
			.data(edadArray[0].values[0].values)
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
			.data(edadArray)
			.enter()
			.append('div')
			.attr('class', function(d){
					var ter = d.key.substring(0,3);
					return 'row lt-'+idInd+'-edad-'+ter+'';
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
		var cContEdad = fTerGnrl.append('div')
			.attr('class', 'col-md-11');
			
		//Crear filas de edad por cada territorio
		var fEdad = cContEdad.selectAll('div')
			.data(function(d){ return d.values; })
			.enter()
			.append('div')
			.attr('class', function(d){
				var edad = d.key.replace(/\+/g, '');
				return 'row gEdad-'+edad+'';
				
			});	
		
		//Agregar col título de edad
		var fedadTit = fEdad.append('div')
			.attr('class','col-md-2')
			.append('h5')
			.attr('class', 'lt-linea-tit-sx')
			.text(function(d){
				var edad = d.key;
				return ''+edad+'';
			});
		
		//Agregar col de gráficas de sexo
		var fedadCInfo = fEdad.append('div')
			.attr('class','col-md-10')
			.append('div')
			.attr('class', 'row');
		
		//Crear divs para gráficos
		var grafs = fedadCInfo.selectAll('div')
			.data(function(d){ return d.values; })
			.enter()
			.append('div')
			.attr('class', 'col-md-2 lt-graf')
			.attr('id', function(d){
				var terr = d.values[0].territorio.substring(0,3);
				var edad = d.values[0].edad.replace(/\+/g, '');
				var fecha = d.values[0].fecha;
				return 'lt-'+idInd+'-edad-'+terr+'-'+edad+'-'+fecha+'';
		});
		
		//Crear Escala para valores
		var dMax = d3.max(datos, function(d) { return d.valor; });
		//console.log(dMax);
		
		var linearScale = d3.scale.linear()
                          .domain([0, dMax])
                         	.range([1,30]);
		
		var intEdadLinea = [];
		
		grafs.on('mouseenter', function() {
				var tooltip = $(this).find('.lt-tooltip');
					tooltip.css('opacity', 1);
			}).on('mouseleave', function() {
				var tooltip = $(this).find('.lt-tooltip');
					tooltip.css('opacity', 0);
			});
						   
		//Loop para pintar 	las gráficas
		for(i = 0; i < datos.length; i++) {
			
			var miDato = datos[i].valor;//Obtener Valor
			var terr = datos[i].territorio.substring(0,3);
			var fecha = datos[i].fecha;
			var edad = datos[i].edad.replace(/\+/g, '');
			
			var nBolas = linearScale(miDato);//Pasar el valor por escala
			
			var miDiv = '#lt-'+idInd+'-edad-'+terr+'-'+edad+'-'+fecha+'';
						
			//Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
			lanzarBolasLinea(miDiv, miDato, nBolas, intEdadLinea[i]);
		
		}//Fin de loop
			
		} else if (miGraf == "bolas"){
			
		crearBotones(datos, miContG, 'edad');
			
			bolasEstructura(datos, miContG, idInd, "edad");
		
		var dAnidadosTyE = d3.nest()
            .key(function(d) {
                return d.territorio;
            })
            .key(function(d) {
                return d.edad;
            })
            .entries(datos);

        for (i = 0; i < dAnidadosTyE.length; i++) {
            var t = dAnidadosTyE[i].key.substring(0, 3),
                miDiv = "#lt-" + idInd + "-edad-" + t + "",
                miDato = dAnidadosTyE[i].values,
                escala = [2, 28]
            carga = -30;
            bolasSimples(miDiv, miDato, idInd, "edad", escala, carga);
        }
		
		} else {
            console.log("Tipo de gráfica incorrecto")
        }
    }); //Fin de carga del json

} //Fin de cargarGeneral

//BOTONES EDAD
$('.lt-cont-grafs').on('click', '.lt-btn-check-edad', function (e){
		e.preventDefault();
		var indActual = $(this).closest('.lt-cont-grafs'),
			btnActual = $(this).data('ltedad'),
			artActual = $(this).closest('.lt-ind'),
			tipoGraf = artActual.data('graf'),
			filaActual = indActual.find('.'+btnActual+'');
		$(this).toggleClass('activo');
		filaActual.slideToggle();
		
});
