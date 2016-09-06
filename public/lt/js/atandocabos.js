/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var atandocabos = {};


atandocabos.init = function(){    
    
//    $('.lt-contenedor').on('click', '.dropdown-menu a', function(){
//     $( '#carousel' ).elastislide();
//    });

    $('#carousel').css('visibility', 'hidden');
    $('#lt-atando-form input').on('change', function(){
        $('#selector_tematicas').trigger('changed.bs.select');
        $('#carousel').css('visibility', 'hidden');
        var tematica = $(this).data('id');
        var jqxhr = $.get('/servicios/gettemas', {
            tematica : tematica
        });
        
        jqxhr.done(function(data){
            $('.tematica_item').remove();
          
            $.each(data, function(index, value){
               var tmp = '<option class="tematica_item" value="'+value.idTema+'">'+value.nom_tema+'</option>';           
               $('#selector_tematicas').append(tmp);
               $('#selector_tematicas').selectpicker('refresh');
               $('.lt-tematica').removeClass('hide');
            });
        });
    });
    
    $('#selector_tematicas').on('changed.bs.select', function(){
        var tema = $(this).val();

        var jqxhr = $.get('/servicios/getindicadores', {
            tema : tema
        });
        
        jqxhr.done(function(data){
            $('#carousel li').remove();
            
            $.each(data, function(index,value){
                var tmp = $('#carousel-tpl').clone();         
                tmp.find('span').html(value.nombre_indicador == null ? 'N/A' : value.nombre_indicador);
                tmp.find('input').val(value.idIndicador);
                tmp.removeClass('hide');
                $('#carousel').append(tmp.find('li'));                
            });

           $('.elastislide-horizontal').css('visibility', 'visible');
           $('#carousel').css('visibility', 'visible');
        });
    });
    
    $(document).on('click', '#carousel li', function(){
       $('#ver_graficas').parent().removeClass('hide'); 
    });
    
    $('#ver_graficas').on('click', function(e){
        e.preventDefault();
        var indicadores = $.map($('input[name="indicador1"]:checked'), function(val,idx){
            return $(val).val();
        });
        indicadores = indicadores.join('|');
        window.location = "/atandocabos/multiple/i/"+indicadores;
    });
}





$(atandocabos.init);