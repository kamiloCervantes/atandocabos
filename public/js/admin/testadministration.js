var testadministration = {};

testadministration.testid;
testadministration.itemid = 0;
testadministration.enunciado = $('#test #enunciado');
testadministration.opciones = $('#test #opciones');
testadministration.complejidad = $('#test #complejidad');
testadministration.debugdata = {};


testadministration.init = function(){
    var params = window.location.pathname.split('/').slice(4);
    testadministration.testid = params[1];
    testadministration.nextitem();
    $(document).on('keydown', testadministration.debug);
}

testadministration.nextitem = function(){
    var jqxhr = $.get('/api/testadministration/token/'+testadministration.testid);
    
    jqxhr.done(function(data){
        if(data.test_status == 0){
            testadministration.itemid = data.id;
            testadministration.debugdata = data.debug;
            $('.opcion-item').remove();
            testadministration.complejidad.html('<p class="pull-right" style="font-style: italic; font-size: 12px;">| IID: '+data.id+' | Complejidad del Ítem: '+data.complejidad+' | </p>');
            testadministration.enunciado.html(data.enunciado);
            testadministration.imagesfix(testadministration.enunciado);
            $.each(data.opciones, function(index,value){
                testadministration.opciones.append('<li class="opcion-item" id="'+value.opcion.id+'">'+value.opcion.enunciado+'</a></li>');
            });
            testadministration.imagesfix(testadministration.opciones);
            $('.opcion-item').on('click', testadministration.sendanswer);
        }
        else{
            $('#test').html(testadministration.endtestviewhelper(data.ability_final_txt, data.motivo));
        }
    });
}

testadministration.sendanswer = function(){
    var test_token = testadministration.testid;
    var opcion_id = $(this).prop('id');
    var item_id = testadministration.itemid;
    
    var jqxhr = $.post('/api/testadministration', {
        test_token : test_token,
        opcion_id : opcion_id,
        item_id : item_id
    });
    
    jqxhr.done(function(data){
        testadministration.nextitem();
    });
}

testadministration.imagesfix = function(jqobject){
    var images = jqobject.find('img');
    $.each(images, function(index, value){
        var src = value.src;
        var ind = src.indexOf('/capture');
        if(ind > 0)
            value.src = src.substring(ind);
    });
}

testadministration.debug = function(e){
    if(e.keyCode == 68){
        testadministration.showdebug();
    }
}

testadministration.showdebug = function(){
    $('#debug').remove();
    $('body').append(testadministration.showdebughelper());
    $('#debug').modal();
}

testadministration.showdebughelper = function(){
    var html = '';
    html += '<div class="modal hide fade" id="debug">';
    html += '<div class="modal-header">';
    html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
    html += '<h3>Debug del proceso de selección</h3>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += '<p>En el proceso de selección se escoge el siguiente ítem al maximizar el valor de la medida de información esperada (Fisher). En la siguiente tabla se muestran los datos usados para escoger el item actual. Los datos del item seleccionado estan sombreados en color gris.</p>';
    html += '<p>Ability: '+testadministration.debugdata.ability+'</p>';
    html += '<p>Respuesta: '+ testadministration.debugdata.correcta+' </p>';
    html += '<table class="table">';
    html += '<tr>'
    html += '<th>';
    html += 'Item ID';
    html += '</th>';
    html += '<th>';
    html += 'a';
    html += '</th>';
    html += '<th>';
    html += 'b';
    html += '</th>';
    html += '<th>';
    html += 'c';
    html += '</th>';
    html += '<th>';
    html += 'Fisher';
    html += '</th>';
    html += '</tr>';
    $.each(testadministration.debugdata.data, function(index, value){
        if(value.item.id == testadministration.itemid){
            html += '<tr style="background: #ccc">';
            html += '<td>';
            html += value.item.id;
            html += '</td>';
            html += '<td>';
            html += value.item.a;
            html += '</td>';
            html += '<td>';
            html += value.item.b;
            html += '</td>';
            html += '<td>';
            html += value.item.c;
            html += '</td>';
            html += '<td>';
            html += value.fisher;
            html += '</td>';
            html += '</tr>';
        }
        else{
            html += '<tr>';
            html += '<td>';
            html += value.item.id;
            html += '</td>';
            html += '<td>';
            html += value.item.a;
            html += '</td>';
            html += '<td>';
            html += value.item.b;
            html += '</td>';
            html += '<td>';
            html += value.item.c;
            html += '</td>';
            html += '<td>';
            html += value.fisher;
            html += '</td>';
            html += '</tr>';
        }
        
    });
    html += '</table>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<a href="#" class="btn btn-primary" data-dismiss="modal">Cerrar</a>';
    html += '</div>';
    html += '</div>';
    return html;
}

testadministration.endtestviewhelper = function(ability, motivo){
    var html = '';
    html += '<div id="resultado-test">';
    html += '<h2>El Test adaptativo ha finalizado!</h2>';
    if(typeof motivo != 'undefined'){
        html += '<p>Motivo: '+motivo+'</p>';
    } 
    
    html += '<p><i>Su nivel de conocimiento actual es: <b>'+ability+'</b></i></p>';
    html += '<p><a href="/admin/tests" class="btn">Volver</a></p>';
    html += '</div>';    
    return html;
}

$(testadministration.init);
