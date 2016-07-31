var register = {};

register.registerbtn = $('#register-add');

register.init = function(){
    register.registerbtn.on('click', register.add);
}

register.add = function(e){
    e.preventDefault();
    $('.alert-error').remove();
    var error_msg = '';
    
    var nombre = $('#nombre').val();
    var apellido = $('#apellido').val();
    var email = $('#email').val();
    var pass = $('#pass').val();
    var pass2 = $('#pass2').val();
    
    if(pass == pass2){
        var jqxhr = $.post('/api/users',{
           nombre : nombre,
           apellido : apellido,
           email : email,
           pass : pass,
           pass2 : pass2
        });
        
        jqxhr.done(function(){
            window.location = '/login';
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
                errorhelper.errorsviewhelper(error_msgs, 'form-register-errors', 'register'); 
            } 
        });
    }
    else{
        error_msg = 'Las contraseñas no coinciden';
        errorhelper.erroralertviewhelper(error_msg,'pass2'); 
    }
    
}

$(register.init);
