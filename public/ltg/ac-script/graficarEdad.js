// JavaScript Document
function cargarEdad() {
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
     JSON.stringify({subpregunta: $(self).closest('article').data('subpregunta') > 0 ? $(self).closest('article').data('subpregunta') : 0, indicador: $(self).closest('article').data('indicador'), vista: "edad", tipografico: $(self).closest('article').data('graf') == 'bolas' ? 'estrella' : $(self).closest('article').data('graf')}), function(error, data) {
        /*=====Variables comunes=====*/
        data = JSON.parse(data.response);
        var datos = data;
        var idInd = datos[0].indicador;


        //Tomar los datos y anidarlos
        var dAnidados = d3.nest()
            .key(function(d) {
//                console.log(d);
                if(typeof d.datos !== 'undefined' && d.datos.length > 0){
//                    console.log(d.territorio);
                    return d.territorio;
                }
            })
            .entries(datos);
         var tmp = [];
         $.each(dAnidados, function(idx,val){                
                if(val.key !== 'undefined'){     
                    tmp.push(val);                
                }
            });
        dAnidados = tmp;    

        //Número de territorios = número de columnas
        var numCols = 12 / dAnidados.length;
        console.log(dAnidados);

        //*Tuve que volver a seleccionar el contenedor de grñáficas para que funcionara con d3
        var miContG = d3.select('#' + miID + '').select('.lt-cont-grafs');

        /*=====Fin Variables comunes=====*/

        if (miGraf == "estrella") {

            var color = d3.scale.ordinal()
                .range(["#4c54fc", "#CC333F", "#00A0B0"]);
			
			var radarChartOptions = {
                w:	wEst,
                h: 	hEst,
                margin: mEst,
                color: color
            };


            //**En edad se hace un segundo Array. Se anidad primero por edad y luego territorio
            var dAnidadosEdad = d3.nest()
                .key(function(d) {
                    return d.edad;
                })
                .key(function(d) {
                    if(typeof d.datos !== 'undefined' && d.datos.length > 0){
                        return d.territorio;
                    }
                })
                .entries(datos);
        
            dAnidadosEdad = $.each(dAnidadosEdad, function(idx,val){
                var tmp = [];
                $.each(val.values, function(i,v){
                    if(v.key != 'undefined'){
                        tmp.push(v);
                    }
                });   
                dAnidadosEdad[idx].values = tmp;
            });
            
            console.log(dAnidadosEdad);
            //Crear los Botones			
            crearBotones(datos, miContG, 'edad');
			
			//Crear convenciones
			convEstrellas(miContG, datos);
			
            //**Crear las filas	de edad
            var filasEdad = miContG.append('div')
                .attr('class', 'row lt-grafs')
                .append('div')
                .attr('class', 'col-xs-12')
                .selectAll('div')
                .data(dAnidadosEdad)
                .enter()
                .append('div')
                .attr('class', function(d) {
                    var gEdad = d.key.replace(/\+/g, '');
                    return 'row fEdadEst gEdad-' + gEdad + '';
                })
                .append('div')
                .attr("class", "col-xs-12");

            //**Crear titulos de fila
            /*var titsEdad = filasEdad.append('div')
                .attr("class", "row lt-edad-g-tit")
                .append('div')
                .attr("class", "col-xs-12")
                .append("span")
                .attr("class", "lt-g-edad-label")
                .text(function(d) {
                    return '' + d.key + '';
                });*/
			
			var spanFila = filasEdad.append('span')
                .attr('class', 'lt-est-edad-span')
                .text(function(d) {
                    return '' + d.key + '';
             });
            //**Crear las columnas de edad
            var colsEdad = filasEdad.append('div')
                .attr("class", "row")
                .selectAll('div')
                .data(function(d) {
                    return d.values;
                })
                .enter()
                .append('div')
                .attr("class", "col-md-" + numCols + "");

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
                .data(function(d) {
                    return d.values;
                })
                .enter()
                .append('div')
                .attr('class', 'lt-graf')
                .attr('id', function(d) {
                    var gEdad = d.edad.replace(/\+/g, '');
                    var terr = d.territorio.substring(0, 3);
                    return 'lt-' + idInd + '-edad-' + gEdad + '-' + terr + '';
                });

			
			
            //Loop para pintar gráficas
            //**En edad cambio un poco respecto al general
            for (i = 0; i < datos.length; i++) {

                var miDato = [datos[i]];
                var gEdad = datos[i].edad.replace(/\+/g, '');
                var terr = datos[i].territorio.substring(0, 3);
                var miDiv = '#lt-' + idInd + '-edad-' + gEdad + '-' + terr + '';
                
				d3.select(miDiv).append("div")
        			.attr("class", "lt-tooltip-est")
        			.style("display", "none");
                        
                if(typeof miDato[0].datos != 'undefined' && miDato[0].datos.length > 0){                  
                    RadarChart(miDiv, miDato, radarChartOptions, 'edad');
                }
                

            } //Fin de loop

        } else if (miGraf == "tolerancia") {


            //**En edad se hace un segundo Array. Se anidad primero por edad y luego territorio
            var dAnidadosEdad = d3.nest()
                .key(function(d) {
                    return d.edad;
                })
                .key(function(d) {
                    return d.territorio;
                })
                .entries(datos);
        
        dAnidadosEdad = $.each(dAnidadosEdad, function(idx,val){
                var tmp = [];
                $.each(val.values, function(i,v){
                    if(v.key != 'undefined'){
                        tmp.push(v);
                    }
                });   
                dAnidadosEdad[idx].values = tmp;
            });
//            console.log(dAnidadosEdad);
            //Crear los Botones			
            crearBotones(datos, miContG, 'edad');

            //Crear etiquetas de territorio, exclusivo de edad tolerancia
            var tTerrFilas = miContG.append('div')
                .attr('class', 'row lt-tits-territorio-fEdad')
                .selectAll('div')
                .data(dAnidados)
                .enter()
                .append('div')
                .attr("class", "col-md-" + numCols + "")
                .append('h5')
                .attr('class', 'lt-tit-territorio')
                .text(function(d) {
                    return '' + d.key + '';
                });

            //Crear las filas	
            var filasEdad = miContG.append('div')
                .attr('class', 'lt-filas-edad')
                .selectAll('div')
                .data(dAnidadosEdad)
                .enter()
                .append('div')
                .attr('class', function(d) {
                    var gEdad = d.key.replace(/\+/g, '');
                    return 'row gEdad-' + gEdad + '';
                });

            var spanFila = filasEdad.append('span')
                .attr('class', 'lt-tol-edad-span')
                .text(function(d) {
                    return '' + d.key + '';
                });

            //Crear las columnas dentro de cada fila
            var colsEdad = filasEdad.selectAll('div')
                .data(function(d) {
                    return d.values;
                })
                .enter()
                .append('div')
                .attr("class", "col-md-" + numCols + "");

            //Agregar título de territorio	
            var titTerritorio = colsEdad.append('h5')
                .attr('class', 'lt-tit-territorio')
                .text(function(d) {
                    return '' + d.key + '';
                });

            //Agregar contenedor de cada gráfica
            var ltGraf = colsEdad.selectAll('div')
                .data(function(d) {
                    return d.values;
                })
                .enter()
                .append('div')
                .attr('class', 'lt-graf')
                .attr('id', function(d) {
                    var gEdad = d.edad.replace(/\+/g, '');
                    var tTrio = d.territorio.substring(0, 3);
                    return 'lt-' + idInd + '-edad' + gEdad + '-' + tTrio + '';
                });

           
            var intEdad = [];

            //Loop para pintar las gráficas
            //**En tolerancia cambia miDato y la función que llama
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
//                console.log(miDato);
                var gEdad = datos[i].edad.replace(/\+/g, '');
                var terr = datos[i].territorio.substring(0, 3);

                var miDiv = '#lt-' + idInd + '-edad' + gEdad + '-' + terr + '';

                //Crear scope, guarda las variables y miDiv y mi Dato y las introduce en esta función
                lanzarBolas(miDiv, miDato, intEdad[i], "edad");

            } //Fin de loop

        } else if (miGraf == "linea") {

            //Crear los Botones			
            crearBotones(datos, miContG, 'edad');

            //Tomar los datos y anidarlos
            var edadArray = d3.nest()
                .key(function(d) {
                    return d.territorio;
                })
                .key(function(d) {
                    return d.edad;
                })
                .key(function(d) {
                    return d.fecha;
                })
                .entries(datos);

            estructuraLinea(edadArray, miContG, idInd, 'edad');

            //Crear Escala para valores
            var dMax = d3.max(datos, function(d) {
                return parseInt(d.valor);
            });


            var linearScale = d3.scale.linear()
                .domain([0, dMax])
                .range([1, 30]);

            var intEdadLinea = [];

            //Loop para pintar 	las gráficas
            for (i = 0; i < datos.length; i++) {

                var miDato = datos[i]; //Obtener Valor
                var terr = datos[i].territorio.substring(0, 3);
                var fecha = datos[i].fecha;
                var edad = datos[i].edad.replace(/\+/g, '');

                var nBolas = linearScale(parseInt(datos[i].valor)); //Pasar el valor por escala

                var miDiv = '#lt-' + idInd + '-edad-' + terr + '-' + edad + '-' + fecha + '';


                lanzarBolasLinea(miDiv, miDato, nBolas, intEdadLinea[i], "edad");

            } //Fin de loop

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
                escala = [4, 22]
            carga = -20;
            bolasSimples(miDiv, miDato, idInd, "edad", escala, carga);
        }
		
		} else {
            console.log("Tipo de gráfica incorrecto")
        }
    }); //Fin de carga del json

} //Fin de cargarEdad

//BOTONES EDAD
$('.lt-cont-grafs').on('click', '.lt-btn-check-edad', function(e) {
    e.preventDefault();
    var indActual = $(this).closest('.lt-cont-grafs'),
        btnActual = $(this).data('ltedad'),
        artActual = $(this).closest('.lt-ind'),
        tipoGraf = artActual.data('graf'),
        filaActual = indActual.find('.' + btnActual + ''),
		nActivos = indActual.find('.lt-nav-edad').children('.activo');
		
	if (nActivos.length > 1 || !$(this).hasClass('activo')) {
		
		$(this).toggleClass('activo');
		
		if (tipoGraf == "bolas") {
			filaActual.toggle(500);
		} else {
			filaActual.slideToggle();
		}
	}
});

