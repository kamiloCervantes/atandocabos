var graficos = {};


graficos.init = function(){
    
     var margin = {top: 30, right: 30, bottom: 30, left: 30},
            width = 200,
            height = 200;

    var color = d3.scale.ordinal()
            .range(["#EDC951","#CC333F","#00A0B0"]);

    var radarChartOptions = {
      w: width,
      h: height,
      margin: margin,
      maxValue: 0.5,
      levels: 5,
      roundStrokes: true,
      color: color
    };

//Load the data and Call function to draw the Radar chart
d3.xhr("/servicios/getestrella")
  .header("Content-Type", "application/json")  
  .post(
     JSON.stringify({indicador: $('#indicadordata').val(), vista: "todos"}),
     function(error, data){

//        //data es el universo de datos de un indicador
        var ind = JSON.parse(data.response);//Guarda todo el contenido del indicador en una variable
//        var numSubind = ind.contenido.length;//El número de Subindicadores
        var idInd = ind.idindicador;
//        var titIndicador  = ind.titulo;
//        var estiloIndicador  = ind.estilo;
//
        var indCont = $("#"+idInd+"");

        $.each($('.lt-1-1-gnrl-san'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-gnrl-san'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-gnrl-san'+$(value).data('subpregunta'), [datoGeneral[0][1]], radarChartOptions);
            
        });
        $.each($('.lt-1-1-gnrl-psc'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];        
            $(value).addClass('lt-1-1-gnrl-psc'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-gnrl-psc'+$(value).data('subpregunta'), [datoGeneral[0][2]], radarChartOptions);            
        });
        $.each($('.lt-1-1-gnrl-nal'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];        
            $(value).addClass('lt-1-1-gnrl-nal'+$(value).data('subpregunta'));
            console.log(datoGeneral[0][3]);
            RadarChart('.lt-1-1-gnrl-nal'+$(value).data('subpregunta'), [datoGeneral[0][3]], radarChartOptions);            
        });
        
});

d3.xhr("/servicios/getestrella")
  .header("Content-Type", "application/json")  
  .post(
     JSON.stringify({indicador: $('#indicadordata').val(), vista: "edades"}),
     function(error, data){

//        //data es el universo de datos de un indicador
        var ind = JSON.parse(data.response);//Guarda todo el contenido del indicador en una variable
//        var numSubind = ind.contenido.length;//El número de Subindicadores
        var idInd = ind.idindicador;
//        var titIndicador  = ind.titulo;
//        var estiloIndicador  = ind.estilo;
//
        var indCont = $("#"+idInd+"");

        $.each($('.lt-1-1-edad-g1-san'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g1-san'+$(value).data('subpregunta'));
//            console.log(datoGeneral[0][1][0]);
            RadarChart('.lt-1-1-edad-g1-san'+$(value).data('subpregunta'), [datoGeneral[0][1][0]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g2-san'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g2-san'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g2-san'+$(value).data('subpregunta'), [datoGeneral[0][1][1]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g3-san'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g3-san'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g3-san'+$(value).data('subpregunta'), [datoGeneral[0][1][2]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g4-san'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g4-san'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g4-san'+$(value).data('subpregunta'), [datoGeneral[0][1][3]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g5-san'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g5-san'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g5-san'+$(value).data('subpregunta'), [datoGeneral[0][1][4]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g6-san'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g6-san'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g6-san'+$(value).data('subpregunta'), [datoGeneral[0][1][5]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g1-psc'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g1-psc'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g1-psc'+$(value).data('subpregunta'), [datoGeneral[0][2][0]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g2-psc'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g2-psc'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g2-psc'+$(value).data('subpregunta'), [datoGeneral[0][2][1]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g3-psc'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g3-psc'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g3-psc'+$(value).data('subpregunta'), [datoGeneral[0][2][2]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g4-psc'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g4-psc'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g4-psc'+$(value).data('subpregunta'), [datoGeneral[0][2][3]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g5-psc'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g5-psc'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g5-psc'+$(value).data('subpregunta'), [datoGeneral[0][2][4]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g6-psc'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g6-psc'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g6-psc'+$(value).data('subpregunta'), [datoGeneral[0][2][5]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g1-nal'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g1-nal'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g1-nal'+$(value).data('subpregunta'), [datoGeneral[0][3][0]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g2-nal'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g2-nal'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g2-nal'+$(value).data('subpregunta'), [datoGeneral[0][3][1]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g3-nal'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g3-nal'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g3-nal'+$(value).data('subpregunta'), [datoGeneral[0][3][2]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g4-nal'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g4-nal'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g4-nal'+$(value).data('subpregunta'), [datoGeneral[0][3][3]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g5-nal'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g5-nal'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g5-nal'+$(value).data('subpregunta'), [datoGeneral[0][3][4]], radarChartOptions);
        });
        $.each($('.lt-1-1-edad-g6-nal'), function(index,value){
            var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(value).data('subpregunta')]];   
            $(value).addClass('lt-1-1-edad-g6-nal'+$(value).data('subpregunta'));
            RadarChart('.lt-1-1-edad-g6-nal'+$(value).data('subpregunta'), [datoGeneral[0][3][5]], radarChartOptions);
        });

});

$('.lt-nav-sexo a').on('click', function(e){
    var self = this;
    $('.current-link').removeClass('current-link');
    $(this).addClass('current-link');
    e.preventDefault();
    var sexo = $(this).data('acsexo');
    d3.xhr("/servicios/getestrella")
        .header("Content-Type", "application/json")  
        .post(
           JSON.stringify({indicador: $('#indicadordata').val(), vista: "sexo", sexo: sexo}),
           function(error, data){

      //        //data es el universo de datos de un indicador
              var ind = JSON.parse(data.response);//Guarda todo el contenido del indicador en una variable
      //        var numSubind = ind.contenido.length;//El número de Subindicadores
              var idInd = ind.idindicador;
      //        var titIndicador  = ind.titulo;
      //        var estiloIndicador  = ind.estilo;
      //
              var indCont = $("#"+idInd+"");
              
              $(self).parent().parent().parent().find(".lt-1-1-gnrl-san").addClass('lt-1-1-gnrl-san'+$(self).parent().data('subpregunta'));
              $(self).parent().parent().parent().find(".lt-1-1-gnrl-psc").addClass('lt-1-1-gnrl-psc'+$(self).parent().data('subpregunta'));
              $(self).parent().parent().parent().find(".lt-1-1-gnrl-nal").addClass('lt-1-1-gnrl-nal'+$(self).parent().data('subpregunta'));
              var datoGeneral = [ind[0].pregunta_idPregunta.subpreguntas[$(self).parent().data('subpregunta')]];
              RadarChart('.lt-1-1-gnrl-san'+$(self).parent().data('subpregunta'), [datoGeneral[0][1]], radarChartOptions);
              RadarChart('.lt-1-1-gnrl-psc'+$(self).parent().data('subpregunta'), [datoGeneral[0][2]], radarChartOptions);
              RadarChart('.lt-1-1-gnrl-nal'+$(self).parent().data('subpregunta'), [datoGeneral[0][3]], radarChartOptions);
      });
//    
});

    
//    console.log(datoSexo);
//    var tmp = [];
//    tmp.push(datoSexo.contenido[0]);
//    console.log(tmp);
    	
//    RadarChart("#lt-1-1-sexo-san", tmp, radarChartOptions);
//    RadarChart("#lt-1-1-edad-g1-san", datoEdad, radarChartOptions);	
}

graficos.configurar = function(){

   
}

$(graficos.init);
			


			  
			
			
			
		