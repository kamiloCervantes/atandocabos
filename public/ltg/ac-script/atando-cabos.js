//Variables Generales, se usan en los archivos base y cuando se grafican las estrellas
//Estrella
var mEst = {
        top: 30,
        right: 55,//45
        bottom: 30,
        left: 55//45
    },
    wEst = 170,
    hEst = 240;
	
//Tolerancia
var wTol = 150,
    hTol = 150;
	
//Linea de tiempo
var wLin = 110,
    hLin = 110;
	
//Bolas
var wBol = 260,
    hBol = 260,
    mBol = 15,
    radiusPie = Math.min(wBol, hBol) / 2,
    radioBolas = radiusPie - 20,
    radioBolasSexo = radiusPie - 30;


function acEstructura(losDatos, elCont, vista, elID) {

    var dAnidadosW = d3.nest()
        .key(function(d) {
            if(typeof d.datos !== 'undefined' && d.datos.length > 0){
                return d.territorio;
            }
        })
        .entries(losDatos);
    dAnidadosW = $.map(dAnidadosW, function(val,idx){
        if(val.key != 'undefined'){
            return val;
        }
    });
    //Número de territorios = número de columnas
    var numCols = 12 / dAnidadosW.length;
    
    //Crear fila y columnas
    var ltCols = elCont.append("div")
        .attr("class", "row lt-grafs")
        .selectAll("div")
        .data(dAnidadosW)
        .enter()
        .append("div")
        .attr("class", "col-md-" + numCols + "");

    //Agregar título de territorio	
    ltCols.append('h5')
        .attr('class', 'lt-tit-territorio')
        .text(function(d) {
            if(typeof d.values[0].datos != 'undefined' && d.values[0].datos.length > 0){
                return '' + d.key + '';
            }
           
        });

    //Agregar div que contendrá cada gráfica svg
    var ltGraf = ltCols.append("div")
        .attr("class", "lt-graf")
        .attr("id", function(d) {
            var terr = d.key.substring(0, 3);
            return "lt-" + elID + "-" + vista + "-" + terr + "";
        });
}

function crearBotones(losDatos, elCont, vista) {

    var dAnidadosBtn = (vista == 'edad') ? d3.nest().key(function(d) {
            return d.edad;
        }).entries(losDatos) :
        (vista == "sexo") ? d3.nest().key(function(d) {
            return d.sexo;
        }).entries(losDatos) :
        'gnrl';

    console.log(dAnidadosBtn);

    elCont.append('div')
        .attr('class', 'lt-nav-' + vista)
        .selectAll('div')
        .data(dAnidadosBtn)
        .enter()
        .append('a')
        .attr('class', 'lt-btn-check lt-btn-check-' + vista + ' activo')
        .attr('data-lt' + vista, function(d) {
            var btnData = (vista == "edad") ? 'gEdad-' + d.key.replace(/\+/g, '') : (vista == "sexo") ? 'gSexo-' + d.key.substring(0, 1) : 'gnrl';
            return btnData;
        })
        .attr('href', '#')
        .text(function(d) {
            return '' + d.key + '';
        });
}
//Tooltips Tolerancia y linea de tiempo
$('.lt-cont-grafs').on('mouseenter', '.lt-graf', function() {
            	var tooltip = $(this).find('.lt-tooltip');
            		tooltip.show();
            }).on('mouseleave', '.lt-graf', function() {
            	var tooltip = $(this).find('.lt-tooltip');
            		tooltip.hide();
});