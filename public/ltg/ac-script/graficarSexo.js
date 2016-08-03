// JavaScript Document
function cargarSexo() {
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
     JSON.stringify({subpregunta: $(self).closest('article').data('subpregunta') > 0 ? $(self).closest('article').data('subpregunta') : 0, indicador: $(self).closest('article').data('indicador'), vista: "sexo", tipografico: $(self).closest('article').data('graf') == 'bolas' ? 'estrella' : $(self).closest('article').data('graf')}), function(error, data) {
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
            
            //**En Sexo esta escala es diferente
            var color = d3.scale.ordinal()
                .range(["#33d3b5", "#b80d80"]);
			
			var radarChartOptions = {
                w:	wEst,
                h: 	hEst,
                margin: mEst,
                color: color
            };

            crearBotones(datos, miContG, 'sexo');

            acEstructura(datos, miContG, "sexo", idInd);
			
			convEstrellas(miContG, datos);
            //Loop para pintar gráficas
            
            for (i = 0; i < dAnidados.length; i++) {

                var miDato = dAnidados[i].values;
                var terr = dAnidados[i].values[0].territorio.substring(0, 3);
                var miDiv = "#lt-" + idInd + "-sexo-" + terr + "";
                
				d3.select(miDiv).append("div")
        			.attr("class", "lt-tooltip-est")
        			.style("display", "none");
                
                if(miDato[0].datos.length > 0){                   
                    RadarChart(miDiv, miDato, radarChartOptions, 'sexo');
                }
                

            } //Fin de loop

        } else if (miGraf == "tolerancia") {

            crearBotones(datos, miContG, 'sexo');

            //Crear fila y columnas
            var ltCols = miContG.append("div")
                .attr("class", "row lt-grafs")
                .selectAll("div")
                .data(dAnidados)
                .enter()
                .append("div")
                .attr("class", "col-md-" + numCols + "");

            //Agregar título de territorio	
            var titTerritorio = ltCols.append('h5')
                .attr('class', 'lt-tit-territorio')
                .text(function(d) {
                    return '' + d.key + '';
                });

            //Agregar div que contendrá cada gráfica svg
            //**En tolerancia ltGraf no lleva ID
            var ltGraf = ltCols.append("div")
                .attr("class", "lt-graf");

            //**Agregar dos div por .lt-graf
            var tolSexo = ltGraf.selectAll('div')
                .data(function(d) {
                    return d.values;
                })
                .enter()
                .append('div')
                .attr('class', function(d) {
                    var sexo = d.sexo.substring(0, 1);
                    return 'lt-tol-sexo sexoActivo gSexo-' + sexo + '';
                }).attr('id', function(d) {
                    var terr = d.territorio.substring(0, 3);
                    var sexo = d.sexo.substring(0, 1);
                    return 'lt-' + idInd + '-sexo-' + terr + '-' + sexo + '';
                });

            var intSexo = [];

            for (i = 0; i < datos.length; i++) {

                var miDato = datos[i];
                $.each(miDato, function(idx,val){
                 if(typeof val == 'object'){
                $.each(val, function(idx2,val2){
                    console.log(val2);
                    if(typeof val2 == 'object'){
                        miDato[idx][idx2]['respuesta'] = $("<div/>").html(miDato[idx][idx2]['respuesta']).text();
                    }
                     });
                 }
                });
                var terr = datos[i].territorio.substring(0, 3);
                var sexo = datos[i].sexo.substring(0, 1);

                var miDiv = "#lt-" + idInd + "-sexo-" + terr + "-" + sexo + "";

                //Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
               lanzarBolas(miDiv, miDato, intSexo[i], "sexo");

            } //Fin de loop

        } else if (miGraf == "linea") {

            crearBotones(datos, miContG, 'sexo');

            //Tomar los datos y anidarlos
            var sexoArray = d3.nest()
                .key(function(d) {
                    return d.territorio;
                })
                .key(function(d) {
                    return d.sexo;
                })
                .key(function(d) {
                    return d.fecha;
                })
                .entries(datos);

            estructuraLinea(sexoArray, miContG, idInd, 'sexo');

            //Crear Escala para valores
            var dMax = d3.max(datos, function(d) {
                return d.valor;
            });
            //console.log(dMax);

            var linearScale = d3.scale.linear()
                .domain([0, dMax])
                .range([1, 50]);

            var intSexoLinea = [];

            //Loop para pintar 	las gráficas
            for (i = 0; i < datos.length; i++) {

                var miDato = datos[i]; //Obtener Valor
                $.each(miDato, function(idx,val){
                    console.log(val);
                 if(typeof val == 'object'){
                $.each(val, function(idx2,val2){
                    console.log(val2);
                    if(typeof val2 == 'object'){
                        miDato[idx][idx2]['respuesta'] = $("<div/>").html(miDato[idx][idx2]['respuesta']).text();
                    }
                     });
                 }
                });
                var terr = datos[i].territorio.substring(0, 3);
                var fecha = datos[i].fecha;
                var sexo = datos[i].sexo.substring(0, 1);

                var nBolas = linearScale(datos[i].valor); //Pasar el valor por escala

                var miDiv = '#lt-' + idInd + '-sexo-' + terr + '-' + sexo + '-' + fecha + '';

                //Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
                lanzarBolasLinea(miDiv, miDato, nBolas, intSexoLinea[i], "sexo");

            } //Fin de loop

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
                escala = [4, 40],
            	carga = -30;
            	bolasSimples(miDiv, miDato, idInd, "sexo", escala, carga);
        }
		} else {
            console.log("Tipo de gráfica incorrecto")
        }
    }); //Fin de carga del json

} //Fin de cargarSexo



//BOTONES SEXO
$('.lt-cont-grafs').on('click', '.lt-btn-check-sexo', function(e) {
    e.preventDefault();
    var indActual = $(this).closest('.lt-cont-grafs'),
        btnActual = $(this).data('ltsexo'),
        artActual = $(this).closest('.lt-ind'),
        tipoGraf = artActual.data('graf'),
        grafActual = indActual.find('.' + btnActual + ''),
		nActivos = indActual.find('.lt-nav-sexo').children('.activo');

if (nActivos.length > 1 || !$(this).hasClass('activo')) {
    $(this).toggleClass('activo');

    if (tipoGraf == "estrella" || tipoGraf == "bolas") {
		indActual.find('.p'+btnActual).toggleClass('inactivo');
        grafActual.toggle(500);
    } else if (tipoGraf == "tolerancia") {
        grafActual.toggleClass('sexoActivo');
    } else if (tipoGraf == "linea") {
        var fActual = indActual.find('.' + btnActual + '');
        fActual.slideToggle();
    } else {
        console.log('Hay algo mal con los botones de Sexo');
    }
}
});

