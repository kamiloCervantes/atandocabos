// JavaScript Document

				
function cargarGeneral() {
    var self = this;
    var miArt = $(this).closest('.lt-ind'),
        miID = miArt.attr('id'),
        miGraf = miArt.data('graf'),
        miCont = miArt.find('.lt-cont-grafs'),
        miVista = $(this).val();
	
	$(this).closest('.lt-nav-desagregar').find('.lt-btn-desagregar').removeClass('activo');
	$(this).addClass('activo');
	
    //Limpiar contenedor
    miCont.html("");

    //Cargar json adecuado según el ID de article
    d3.xhr("/servicios/getmultiple")
    .header("Content-Type", "application/json")  
    .post(
     JSON.stringify({subpregunta: $(self).closest('article').data('subpregunta') > 0 ? $(self).closest('article').data('subpregunta') : 0, indicador: $(self).closest('article').data('indicador'), vista: "general", tipografico: $(self).closest('article').data('graf') == 'bolas' ? 'estrella' : $(self).closest('article').data('graf')}), function(error, data) {
        data = JSON.parse(data.response);
        var datos = data,
            idInd = datos[0].indicador,
            miContG = d3.select('#' + miID + '').select('.lt-cont-grafs');

        if (miGraf == "estrella") {

            var color = d3.scale.ordinal()
                .range(["#4c54fc", "#CC333F", "#00A0B0"]);
			
			var radarChartOptions = {
                w:	wEst,
                h: 	hEst,
                margin: mEst,
                color: color
            };
			
			
            //Crear estructura
            acEstructura(datos, miContG, "gnrl", idInd);
			
			//Crear  convenciones
			convEstrellas(miContG, datos);
				
            //Loop para pintar gráficas
            for (i = 0; i < datos.length; i++) {

                var miDato = [datos[i]];
                var terr = datos[i].territorio.substring(0, 3);
                var miDiv = "#lt-" + idInd + "-gnrl-" + terr + "";
				
				d3.select(miDiv).append("div")
        			.attr("class", "lt-tooltip-est")
        			.style("display", "none");
                        
                if(miDato[0].datos.length > 0){                   
                    RadarChart(miDiv, miDato, radarChartOptions, 'gnrl');
                }
                

            } //Fin de loop

        } else if (miGraf == "tolerancia") {

            acEstructura(datos, miContG, "gnrl", idInd);

            var intGeneral = [];

            for (i = 0; i < datos.length; i++) {

                var miDato = datos[i];
                var terr = datos[i].territorio.substring(0, 3);
                var miDiv = "#lt-" + idInd + "-gnrl-" + terr + "";

                //Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
                lanzarBolas(miDiv, miDato, intGeneral[i], "gnrl");

            } //Fin de loop

        } else if (miGraf == "linea") {

            //Tomar los datos y anidarlos
            var gnrlArray = d3.nest()
                .key(function(d) {
                    return d.territorio;
                })
                .key(function(d) {
                    return d.indicador;
                })
                .key(function(d) {
                    return d.fecha;
                })
                .entries(datos);

            estructuraLinea(gnrlArray, miContG, idInd, 'gnrl');

            //Crear Escala para valores
            var dMax = d3.max(datos, function(d) {
                return d.valor;
            });

            var linearScale = d3.scale.linear()
                .domain([0, dMax])
                .range([0, 100]);
                
            var intGeneralLinea = [];
           
		    //Loop para pintar 	las gráficas
            for (i = 0; i < datos.length; i++) {

                var miDato = datos[i]; //Obtener Valor
                var terr = datos[i].territorio.substring(0, 3);
                var fecha = datos[i].fecha;
                var nBolas = linearScale(datos[i].valor); //Pasar el valor por escala

                var miDiv = '#lt-' + idInd + '-gnrl-' + terr + '-' + fecha + '';

                //Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
              lanzarBolasLinea(miDiv, miDato, nBolas, intGeneralLinea[i], "gnrl");

            } //Fin de loop


        } else if (miGraf == "bolas") {
			
			
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
					escala = [4, 140]
				carga = -180;
				bolasSimples(miDiv, miDato, idInd, "gnrl", escala, carga);
			}
		} else {
            console.log("Tipo de gráfica incorrecto")
        }
    }); //Fin de carga del json

} //Fin de cargarGeneral