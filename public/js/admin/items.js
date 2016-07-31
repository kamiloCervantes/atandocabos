var items = {};

items.optionaddbtn = $('#option-add');
items.optioninput = $('#opciones');
items.optioncorrectacheck = $('#correcta');
items.optionslist = $('#opciones-list');
items.additembtn = $('#item-add');
items.options = [];
categorias.selectcategoria = $('#categoria');
items.itemslist = $('#items-list');

items.initadditemview = function(){
    categorias.cargarcategorias();
    items.optionaddbtn.on('click', items.addopcion);
    items.additembtn.on('click', items.additem);
    tinyMCE.init({
        mode : "textareas",
        theme : "advanced",
        plugins : "jbimages,emotions,spellchecker,advhr,insertdatetime,preview,fmath_formula", 
        
        language: "en",
                
        // Theme options - button# indicated the row# only
        theme_advanced_buttons1 : "newdocument,preview,|,bold,italic,underline,|,justifyleft,justifycenter,justifyright,|,cut,copy,paste,|,undo,redo,|,link,unlink,image,jbimages,|,spellchecker,charmap, fmath_formula",
        theme_advanced_buttons2 : "",
        theme_advanced_buttons3 : "",      
        theme_advanced_toolbar_location : "top",
        theme_advanced_toolbar_align : "left",
        theme_advanced_statusbar_location : "bottom",
        theme_advanced_resizing : true
});

}

items.initlistitemsview = function(){
    items.listitems();
}

items.addopcion = function(e){
    e.preventDefault();
    $('.alert-error').remove();
    var _opcion = tinyMCE.get('opciones');
    var opcion = _opcion.getContent();
    var correcta = items.optioncorrectacheck.prop('checked');
    var error_msg = '';
    if(opcion.length > 0){
        if(opcion.length < 2000){
            if(items.options.length <= 4){
                var i = 0;
                    $.each(items.options, function(index, value){
                        if(value.correcta){
                            i++;
                        }
                    });
                if(correcta){  
                    if(i > 0){
                        error_msg = 'Ya existe una opción correcta.';
                        errorhelper.erroralertviewhelper(error_msg,'opciones-list'); 
                    }
                    else{
                        items.options.push({enunciado : opcion, correcta : correcta});
                        items.optionslist.removeClass('hide');
                    }
                }
                else{
                    if(i == 0 && items.options.length == 3 && !correcta){
                            error_msg = 'Debe haber al menos una opción correcta.';
                            errorhelper.erroralertviewhelper(error_msg,'opciones-list'); 
                        }
                        else{
                        items.options.push({enunciado : opcion, correcta : correcta});
                        items.optionslist.removeClass('hide');
                        }

                }
                items.actualizaropciones();
            }
            else{
                error_msg = 'No se pueden agregar mas opciones.';
                errorhelper.erroralertviewhelper(error_msg,'opciones-list'); 
            }
        }
        else{
            error_msg = 'Este campo puede tener máximo 2000 caracteres.';
            errorhelper.erroralertviewhelper(error_msg,'opciones-list');
        }
    }
    else{
        error_msg = 'Este campo no puede quedar en blanco.';
        errorhelper.erroralertviewhelper(error_msg,'opciones-list'); 
    }
    
    
}

items.actualizaropciones = function(){
    if(items.options.length > 0){
        $('.opciones-item').remove();
        $.each(items.options, function(index, value){
            items.optionslist.append(items.opcionesviewhelper(value, index));
        });
    }
}

items.opcionesviewhelper = function(option, index){
    var html = '';
    html += '<tr class="opciones-item">';
    html += '<td>'+(index+1)+'.</td>'
    html += '<td>'+option.enunciado+'</td>';
    html += '<td>'+(option.correcta ? 'Si' : 'No')+'</td>';
    html += '</tr>';
    return html;
}

items.additem = function(e){
    e.preventDefault();
    if(items.options.length >= 4){
        var categoria = categorias.selectcategoria.val();
        var _enunciado = tinyMCE.get('enunciado');
        var enunciado = _enunciado.getContent();
        var param_a = $('#param_a').val();
        var param_b = $('#param_b').val();
        var param_c = $('#param_c').val();
        
        var jqxhr = $.post('/api/items', 
            { 
                categoria : categoria, 
                enunciado : enunciado, 
                param_a : param_a,
                param_b : param_b,
                param_c : param_c,
                opciones : JSON.stringify(items.options)
            });
        
        jqxhr.done(function(){
            window.location = '/admin/items';
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
                errorhelper.errorsviewhelper(error_msgs, 'form-items-errors', 'items'); 
            } 
        });
    }
    else{
        error_msg = 'Deben haber mínimo 4 opciones de respuesta.';
        errorhelper.erroralertviewhelper(error_msg,'opciones-list'); 
    }
    
}

items.listitems = function(){
    var jqxhr = $.get('/api/items');
    
    jqxhr.done(function(data){
        $.each(data, function(index, value){
            items.itemslist.append(items.listitemsviewhelper(value));
        });
    });
}

items.listitemsviewhelper = function(data){
    var html = '<tr>';
    html += '<td>'+data.enunciado+'</td>';
    html += '<td>'+data.categoria+'</td>';
    html += '<td>'+data.complejidad+'</td>';
    html += '</tr>';
    return html;
}

