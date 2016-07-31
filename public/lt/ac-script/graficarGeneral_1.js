// JavaScript Document

				
function cargarGeneral() {

    var miArt = $(this).closest('.lt-ind'),
        miID = miArt.attr('id'),
        miGraf = miArt.data('graf'),
        miCont = miArt.find('.lt-cont-grafs'),
        miVista = $(this).val();

    //Limpiar contenedor
    miCont.html("");

    //Cargar json adecuado según el ID de article
    d3.json("ac-script/jsons/" + miID + "-" + miVista + ".json", function(error, data) {

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
                maxValue: 1,
                levels: 5,
                roundStrokes: true,
                color: color
            };

            //Crear estructura
            acEstructura(datos, miContG, "gnrl", idInd);

            //Loop para pintar gráficas
            for (i = 0; i < datos.length; i++) {

                var miDato = [datos[i]];
                var terr = datos[i].territorio.substring(0, 3);
                var miDiv = "#lt-" + idInd + "-gnrl-" + terr + "";

                RadarChart(miDiv, miDato, radarChartOptions);

            } //Fin de loop

        } else if (miGraf == "tolerancia") {

            acEstructura(datos, miContG, "gnrl", idInd);

            var intGeneral = [];

            for (i = 0; i < datos.length; i++) {

                var miDato = datos[i].datos[1].valor;
                var terr = datos[i].territorio.substring(0, 3);
                var miDiv = "#lt-" + idInd + "-gnrl-" + terr + "";

                //Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
                lanzarBolas(miDiv, miDato, intGeneral[i]);

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

                var miDato = datos[i].valor; //Obtener Valor
                var terr = datos[i].territorio.substring(0, 3);
                var fecha = datos[i].fecha;
                var nBolas = linearScale(miDato); //Pasar el valor por escala

                var miDiv = '#lt-' + idInd + '-gnrl-' + terr + '-' + fecha + '';

                //Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
                lanzarBolasLinea(miDiv, miDato, nBolas, intGeneralLinea[i]);

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
					escala = [2, 58]
				carga = -200;
				bolasSimples(miDiv, miDato, idInd, "gnrl", escala, carga);
			}
		} else {
            console.log("Tipo de gráfica incorrecto")
        }
    }); //Fin de carga del json

} //Fin de cargarGeneral