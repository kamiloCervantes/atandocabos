var categorias = {};

categorias.addcategoriabtn = $('#categoria-add');
categorias.selectcategoria = $('#categoriapadre');
categorias.listcategorias = $('#categorias-list');

categorias.initaddcategoriaview = function(){
    categorias.cargarcategorias();
    categorias.addcategoriabtn.on('click', categorias.agregarcategoria);
}

categorias.initlistcategoriasview = function(){
    categorias.cargarcategoriaslist();
}

categorias.agregarcategoria = function(){
    var nombrecategoria = $('#nombrecategoria').val();
    var categoriapadre = categorias.selectcategoria.val();
    var jqxhr = $.post('/api/categorias', {nombrecategoria : nombrecategoria, categoriapadre : categoriapadre});
    
    jqxhr.done(function(){
        window.location = '/admin/categorias';
    });
    
    jqxhr.error(function(errors){
        if(errors.responseText != ''){
            console.log(errors.responseText); 
            var err = JSON.parse(errors.responseText);
            var error_msgs = [];
            $.each(err, function(index, value){
                $.each(value, function(i,val){
                    error_msgs.push(val);
                });
            });
            errorhelper.errorsviewhelper(error_msgs, 'form-categoria-errors', 'categorias'); 
        } 
    });
}

categorias.cargarcategorias = function(){
    var jqxhr = $.get('/api/categorias');
    
    jqxhr.done(function(data){
        $.each(data, function(index, value){
            categorias.selectcategoria.append(categorias.cargarcategoriasviewhelper(value));
        });
    });
    
}

categorias.cargarcategoriaslist = function(){
    var jqxhr = $.get('/api/categorias');
    
    jqxhr.done(function(data){
        $.each(data, function(index, value){
            categorias.listcategorias.append(categorias.cargarcategoriaslistviewhelper(value));
        });
    });
    
}

categorias.cargarcategoriasviewhelper = function(data){
    var html = '';
    html += '<option value="'+data.idcategoria+'">'+data.nombrecategoria+"</option>"
    return html;
}

categorias.cargarcategoriaslistviewhelper = function(data){
    var html = '<tr>';
    html += '<td>'+data.nombrecategoria+'</td>';
    html += '<td>'+data.categoriapadre+'</td>';
    html += '</tr>';
    return html;
}


