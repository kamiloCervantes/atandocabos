var profile = {};

profile.habilidades = $('#habilidades');
profile.tests = $('#tests');

profile.init = function(){
    var profile_token = window.location.pathname.split('/').slice(5);
    var jqxhr = $.get('/api/profile/id/'+profile_token);
    
    $(document).on('click', '.categoria', function(e){
        var categoria = $(this).data('categoria');
        e.preventDefault();
        var jqxhr2 = $.get('/', {
            categoria : categoria
        });
    });
    
    jqxhr.done(function(data){
        profile.cargarhabilidades(data[0]);
        profile.cargartests(data[0]);
    });
}

profile.cargarhabilidades = function(data){
    $('.habilidad-item').remove();
    $.each(data.nivelescategorias, function(index,value){
        profile.habilidades.append(profile.cargarhabilidadesviewhelper(value.categoria.id,value.categoria.nombre, value.ability));
    });
}

profile.cargarhabilidadesviewhelper = function(categoria_id, categoria, ability){
    var html = '';
    html += '<tr class="habilidad-item">';
    html += '<td><a href="#" data-categoria="'+categoria_id+'" class="categoria">'+categoria+'</a></td>';
    html += '<td>'+ability+'</td>';
    html += '</tr>';
    return html;
}

profile.cargartests = function(data){
    $('.tests-item').remove();
    $.each(data.testsfinalizados, function(index,value){
        profile.tests.append(profile.cargartestsviewhelper(value.fecha.date, value.test.categoria.nombre, value.num_items_resueltos, value.nivelfinal));
    });
}

profile.cargartestsviewhelper = function(fecha, categoria, num_items, ability){
    var html = '';
    html += '<tr class="tests-item">';
    html += '<td>'+fecha+'</td>';
    html += '<td>'+categoria+'</td>';
    html += '<td>'+num_items+'</td>';
    html += '<td>'+ability+'</td>';
    html += '</tr>';
    return html;
}

$(profile.init);

