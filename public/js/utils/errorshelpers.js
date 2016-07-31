 var errorhelper = {};
 
errorhelper.errorsviewhelper = function(error_msgs, modal_id, parent_id){
    console.log("Mostrando errores del formulario");
    $('#'+modal_id).remove();
    var html = '';
    html += '<div class="modal hide fade" id="'+modal_id+'">';
    html += '<div class="modal-header">';
    html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
    html += '<h3>Error!</h3>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += '<ul>';
    for(var error_msg in error_msgs){
        html += '<li>'+error_msgs[error_msg]+'</li>';
    }
    html += '</ul>';
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<a href="#" class="btn btn-primary" data-dismiss="modal">Aceptar</a>';
    html += '</div>';
    html += '</div>';
    html += '';
    $('#'+parent_id).append(html);
    $('#'+modal_id).modal();
};

errorhelper.erroralertviewhelper = function(error_msg, before_tag){
    $('.alert-error').remove();
    var html = '';
    html += '<div class="alert alert-error">';
    html += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
    html += '<strong>Error!</strong> '+error_msg;
    html += '</div>';
    $('#'+before_tag).after(html);  
};



