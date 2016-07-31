//Configurar tamaño de gráficas
var width = 300,
    height = 300,
    margin = 15,
    radiusPie = Math.min(width, height) / 2,
    labelr = radiusPie + 3; // radius for label anchor

var contGrafs = '.lt-cont-grafs';

// Paleta de color
var colorBolas = d3.scale.ordinal()
    .range(['#241C66', '#5FECE2', '#F7ED79', '#084FE5', '#B80D80', '#7CECB4', '#662482']);

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

    d3.json("ac-script/datos/bolas/d-bolas-general.json", function(error, data) {

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

        //console.log(dAnidados);

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
                var terr = d.key.substring(0, 3);
                return "lt-" + idInd + "-gnrl-" + terr + "";
            });

        //Agregar convenciones
        var conv = d3.select(contGrafs).append("div")
            .attr("class", "row lt-bolas-conv")
            .selectAll("div")
            .data(datos[0].datos)
            .enter()
            .append("div")
            .attr("class", "col-sm-4")
            .append('a')
            .attr('class', 'lt-btn-bolas')
            .attr('href', '#')
            .attr('data-ltbola', function(d, i) {
                var ix = i + 1
                return 'bola-' + ix + '';
            })

        var colorConv = conv.append('span')
            .attr('class', function(d, i) {
                var ix = i + 1
                return 'lt-color-conv lt-color-conv-' + ix + '';
            });

        var labelConv = conv.append('span')
            .attr('class', 'lt-label-conv')
            .text(function(d) {
                return '' + d.respuesta + '';
            });

        //Inicio de función
        //Reemplazar #lt.... por miDiv
        var svg = d3.select('#lt-4-gnrl-San')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) +
                ',' + (height / 2) + ')');

        //Radio del pie
        var arc = d3.svg.arc()
            .outerRadius(radiusPie - margin);

        var pie = d3.layout.pie()
            .value(function(d) {
                return d.valor;
            })
            .sort(null);

        var path = svg.selectAll('path')
            .data(pie(datos[0].datos))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return colorBolas(d.data.respuesta);
            });




    }); //Fin de data

} //Fin de cargar general

function cargarEdad() {

    var miBoton = $(this);

    limpiar(miBoton);

    var indCont = $(this).closest('.lt-ind');

    d3.json("ac-script/datos/bolas/d-bolas-edad.json", function(error, data) {

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

        //**En edad se anidada por edad
        var dAnidadosE = d3.nest()
            .key(function(d) {
                return d.edad;
            })
            .entries(datos);

        var porcionPie = 100 / dAnidadosE.length;

        //**En edad Array para pie

        var pieArrayE = dAnidadosE.map(function(obj) {
            var rObj = {
                key: obj.key,
                porcion: porcionPie,
				values : obj.values
            };
            return rObj;
        });


        //console.log(pieArrayE);

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
        //**En edad -gnrl- cambia por -edad-
        var ltGraf = ltCols.append("div")
            .attr("class", "lt-graf")
            .attr("id", function(d) {
                var terr = d.key.substring(0, 3);
                return "lt-" + idInd + "-edad-" + terr + "";
            });

        //Agregar convenciones
        var conv = d3.select(contGrafs).append("div")
            .attr("class", "row lt-bolas-conv")
            .selectAll("div")
            .data(datos[0].datos)
            .enter()
            .append("div")
            .attr("class", "col-sm-4")
            .append('a')
            .attr('class', 'lt-btn-bolas')
            .attr('href', '#')
            .attr('data-ltbola', function(d, i) {
                var ix = i + 1
                return 'bola-' + ix + '';
            })

        var colorConv = conv.append('span')
            .attr('class', function(d, i) {
                var ix = i + 1
                return 'lt-color-conv lt-color-conv-' + ix + '';
            });

        var labelConv = conv.append('span')
            .attr('class', 'lt-label-conv')
            .text(function(d) {
                return '' + d.respuesta + '';
            });

        //Inicio de función para generar pie
        //Reemplazar #lt.... por miDiv
		var centros = [];
		
        var svg = d3.select('#lt-4-edad-San')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) +
                ',' + (height / 2) + ')');

        //Radio del pie
        var arc = d3.svg.arc()
            .outerRadius(radiusPie - margin)
            .innerRadius(0);

        var pie = d3.layout.pie()
            .value(function(d) {
                return d.porcion;
            })
            .sort(null);

        var g = svg.selectAll("g")
            .data(pie(pieArrayE))
            .enter().append("g")
            .attr('class', function(d) {
                var clase = d.data.key.replace(/\+/g, '');
                return 'lt-bolas-porcion lt-porcion-' + clase + '';
            })
            .attr('id', function(d, i) {
                i = i + 1;
                var clase = d.data.key.replace(/\+/g, '');
                return 'lt-' + idInd + '-edad-' + clase + '-' + i;
            });

        g.append("path")
            .attr("d", arc);

        g.append("text")
            .text(function(d) {
                return d.data.key;
            })
            .attr("transform", function(d) {
                var c = arc.centroid(d),
                    x = c[0],
                    y = c[1],
                    // pythagorean theorem for hypotenuse
                    h = Math.sqrt(x * x + y * y);
				//console.log(c);
				centros.push(c);
                return "translate(" + (x / h * labelr) + ',' +
                    (y / h * labelr) + ")";
            });

        function angle(d) {
            var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
            return a > 90 ? a - 180 : a;
        }

        
		
				
    }); //Fin de data

} //Fin de cargar general

function pintarBolas(){
	

}


//Fin gráfica bolas simples
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-gnrl', cargarGeneral);
//$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-sexo', cargarSexo);
$('.lt-nav-desagregar').on('click', '.lt-btn-desagregar-edad', cargarEdad);
$('.lt-btn-desagregar-gnrl').trigger('click');

//BOTONES SEXO
$('div.lt-cont-grafs').on('click', 'a.lt-btn-check-sexo', function(e) {
    e.preventDefault();
    var indActual = $(this).closest('.lt-cont-grafs');
    var btnActual = $(this).data('ltsexo');
    var grafActual = indActual.find('.' + btnActual + '');
    grafActual.toggle(500);
    $(this).toggleClass('activo');
});
//BOTONES EDAD
$('.lt-cont-grafs').on('click', 'a.lt-btn-check-edad', function(e) {
    e.preventDefault();
    var indActual = $(this).closest('.lt-cont-grafs');
    var btnActual = $(this).data('ltedad');
    var filaActual = indActual.find('.' + btnActual + '');
    //var nActivos = $(this).closest('.lt-nav-edad').children('.activo').length;
    //console.log(nActivos);
    filaActual.slideToggle();
    $(this).toggleClass('activo');
});

/*var path = svg.selectAll('path')
        	  .data(pie(pieArrayE))
        	  .enter()
        	  .append('path')
        	  .attr('d', arc)
        	  .attr('class', function(d) { 
        	  	var clase = d.data.key.replace(/\+/g, '');
        		return 'lt-bolas-porcion lt-porcion-'+clase+'';
        	  });*/
//Datos provisionales
		/*var arrayProv = dAnidados[0].values;
		
		var miArrayAlegre = arrayProv.map(function(obj, ind, pad){
			var nObj =  obj.datos.map(function(sObj, sInd, sPad){
				var snObj = {
					id: ind,
					respuesta: sObj.respuesta,
					valor: sObj.valor
				};
				return snObj;
			});
			return nObj;
		});
		
		var miArrayAlegre2 = arrayProv.map(function(obj, ind, pad){
			var nObj = obj.datos.forEach(function(sObj, sInd, sPad){
				var snObj = {
					id: ind,
					respuesta: sObj.respuesta,
					valor: sObj.valor
				};
				return snObj;
			}); 
			return nObj;
		});
		
		console.log(arrayProv);
		console.log(miArrayAlegre2);*/