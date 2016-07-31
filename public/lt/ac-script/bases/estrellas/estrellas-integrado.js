//Configurar márgenes y tamaño de gráficas
var margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
    },
    width = 200,
    height = 200;

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

var contGrafs = '.lt-cont-grafs';

function limpiar(l) {
    l.closest('.lt-ind').find('.lt-cont-grafs').html("");
}
/*
=====================
Cargar General
=====================
*/
function cargarGeneral() {

    var miBoton = $(this);

    limpiar(miBoton);

    var indCont = $(this).closest('.lt-ind');

    d3.json("ac-script/datos/estrella/d-estrella-general.json", function(error, data) {

        var datos = data;
        var idInd = datos[0].indicador;
        var numDatos = datos.length;

        //Tomar los datos y anidarlos
        //**En general solo se maneja un key, que es territorio
        var dAnidados = d3.nest()
            .key(function(d) {
                return d.territorio;
            })
            .entries(datos);

        //Número de territorios = número de columnas
        var numCols = 12 / dAnidados.length;

        //Crear fila y columnas
        var ltCols = d3.select(contGrafs).append("div")
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
                var terr = d.key.substring(0,3);
                return "lt-" + idInd + "-gnrl-" + terr + "";
            });
		
		//Loop para pintar gráficas
		for(i = 0; i < numDatos; i++) {
			
			var miDato = [datos[i]];
			var terr = datos[i].territorio.substring(0,3);
			var miDiv = "#lt-" + idInd + "-gnrl-" + terr + "";
			//console.log(miDato);
			
			RadarChart( miDiv, miDato, radarChartOptions);
		
		}//Fin de loop

    }); //Fin de data

} //Fin de cargar general

/*
=====================
Cargar Sexo
=====================
*/
function cargarSexo() {

    var miBoton = $(this);

    limpiar(miBoton);

    var indCont = $(this).closest('.lt-ind');
	
	//**En sexo cambia ruta
    d3.json("ac-script/datos/estrella/d-estrella-sexo.json", function(error, data) {

        var datos = data;
        var idInd = datos[0].indicador;
       
        //Tomar los datos y anidarlos
        var dAnidados = d3.nest()
            .key(function(d) {
                return d.territorio;
            })
			.entries(datos);
		
		//**En sexo se hace un segundo Array anidado por sexo
        var dAnidadosSexo = d3.nest()
            .key(function(d) {
                return d.sexo;
            })
			.entries(datos);
		
		//**En sexo numDatos calcula length de dAnidados no de datos
		 var numDatos = dAnidados.length;

		//console.log(dAnidados);
        //Número de territorios = número de columnas
        var numCols = 12 / dAnidados.length;
		
		//Crear botones
		//**Nuevo en sexo
		var btnSexo = d3.select(contGrafs)
			.append('div')
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
        var ltCols = d3.select(contGrafs).append("div")
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
                var terr = d.key.substring(0,3);
                return "lt-" + idInd + "-sexo-" + terr + "";
            });
		
		//Loop para pintar gráficas
		//**En sexo -gnrl- cambia por -sexo-
		//**En sexo cambia miDato y terr
		for(i = 0; i < numDatos; i++) {
			
			var miDato = dAnidados[i].values;
			var terr = dAnidados[i].values[0].territorio.substring(0,3);
			var miDiv = "#lt-" + idInd + "-sexo-" + terr + "";
			//console.log(miDato);
			
			RadarChart( miDiv, miDato, radarChartOptions);
		
		}//Fin de loop

    }); //Fin de data

} //Fin de cargar sexo

/*
=====================
Cargar Edad
=====================
*/
function cargarEdad() {

    var miBoton = $(this);

    limpiar(miBoton);

    var indCont = $(this).closest('.lt-ind');

    d3.json("ac-script/datos/estrella/d-estrella-edad.json", function(error, data) {

        var datos = data;
        var idInd = datos[0].indicador;
        var numDatos = datos.length;

        //Tomar los datos y anidarlos
        //**En edad esto sirve para calcular el ancho de las columnas
        var dAnidados = d3.nest()
            .key(function(d) {
                return d.territorio;
            })
            .entries(datos);
			
		//Número de territorios = número de columnas
        var numCols = 12 / dAnidados.length;
			
		//**En edad se anidan los datos primero por edad y  luego por territorio
		var dAnidadosEdad = d3.nest()
            .key(function(d) {
                return d.edad;
            })
			.key(function(d) {
                return d.territorio;
            })
            .entries(datos);
        
		//Crear botones
		//**Nuevo en sexo
		//**En edad cambia sexo por edad en todos lados
		//**En edad cambia la funcion para data-ltedad
		var btnSexo = d3.select(contGrafs)
			.append('div')
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
		var filasEdad = d3.select(contGrafs)
			.append('div')
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
		for(i = 0; i < numDatos; i++) {
			
			var miDato = [datos[i]];
			var gEdad = datos[i].edad.replace(/\+/g, '');
			var terr = datos[i].territorio.substring(0,3);
			var miDiv = '#lt-'+idInd+'-edad-'+gEdad+'-'+terr+'';
			//console.log(miDato);
			
			RadarChart( miDiv, miDato, radarChartOptions);
		
		}//Fin de loop
		

    }); //Fin de data

} //Fin de cargar edad



$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-gnrl', cargarGeneral);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-sexo', cargarSexo);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-edad', cargarEdad);
$('.lt-btn-desagregar-gnrl').trigger('click');

//BOTONES SEXO
$('div.lt-cont-grafs').on('click', 'a.lt-btn-check-sexo', function (e){
		e.preventDefault();
		var indActual = $(this).closest('.lt-cont-grafs');
		var btnActual = $(this).data('ltsexo');
		var grafActual = indActual.find('.'+btnActual+'');
		grafActual.toggle(500);
		$(this).toggleClass('activo');
});
//BOTONES EDAD
$('.lt-cont-grafs').on('click', 'a.lt-btn-check-edad', function (e){
		e.preventDefault();
		var indActual = $(this).closest('.lt-cont-grafs');
		var btnActual = $(this).data('ltedad');
		var filaActual = indActual.find('.'+btnActual+'');
		//var nActivos = $(this).closest('.lt-nav-edad').children('.activo').length;
		//console.log(nActivos);
		filaActual.slideToggle();
		$(this).toggleClass('activo');
});