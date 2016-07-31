var tests = {};

categorias.selectcategoria = $('#categoria');
tests.criterioparada = $('#tipo_criterio_parada');
tests.creartestbtn = $('#test-add');
tests.listatests = $('#tests-list');

tests.initaddtestview = function(){
    categorias.cargarcategorias();
    tests.creartestbtn.on('click', tests.addtest);
    $('#fecha').datepicker({
        format : 'yyyy-mm-dd'
    });
    $('#hora').clockpicker({
        autoclose: true
    });
}

tests.initlisttestview = function(){
    tests.listartests();
}

tests.listartests = function(){
    var jqxhr = $.get('/api/tests');
    
    jqxhr.done(function(data){
        $.each(data, function(index, value){
            tests.listatests.append(tests.listartestsviewhelper(value));
        });
    });
}

tests.addtest = function(){
    var categoria = categorias.selectcategoria.val();
    var criterioparada = tests.criterioparada.val();
    var valorcriterio = $('#valor_criterio_parada').val();
    var nombre = $('#nombre').val();
    var fecha = $('#fecha').val();
    var hora = $('#hora').val();
    var codigo_inicio = $('#codigo').val();
    var grupo = $('#grupo').val();
    
    var jqxhr = $.post('/api/tests', {
        categoria : categoria,
        criterio_parada : criterioparada,
        nombre : nombre,
        fecha : fecha,
        hora: hora,
        codigo_inicio: codigo_inicio,
        grupo: grupo,
        valor_criterio : valorcriterio
    });
    
     jqxhr.done(function(){
            window.location = '/admin/tests';
        });

     jqxhr.error(function(errors){
            if(errors.responseText != ''){
                var err = JSON.parse(errors.responseText);
                var error_msgs = [];
                $.each(err, function(index, value){
                    $.each(value, function(i,val){
                        error_msgs.push(val);
                    });
                });
                errorhelper.errorsviewhelper(error_msgs, 'form-tests-errors', 'tests'); 
            } 
        });
    }
    
tests.listartestsviewhelper = function(test){
    var html = '';
    html += '<li>';
    html += '<div class="test-item">';
    html += '<p><strong>#'+test.id+'</strong> Test adaptativo - <strong>Categoría:</strong> '+test.categoria+' - <strong>Criterio de parada:</strong> '+test.criterio_parada+' - <strong>Valor criterio:</strong> '+test.valor_criterio+'</p>';
    html += '<br/><p>';
    html += '<form class="form-inline" style="text-align: center">';
    html += '<label for="token" style="font-family: \'Lucida Console\', Monaco, monospace"><strong>Token del test:</strong></label>';
    html += '<input type="text" id="token" value="'+test.token+'" />';
    html += '<a href="/admin/tests/play/id/'+test.token+'" class="btn">Administrar</a>';
    html += '</form>';
    html += '</p>';
    html += '</div>';
    html += '</li>';
    return html;
}