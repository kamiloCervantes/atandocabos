var login = {};

login.loginbtn = $('#iniciarsesion');
login.email = '';
login.pass = '';

login.init = function(){
    login.loginbtn.on('click', login.login);
    $('.recuperar_pwd').on('click', login.recover);
}

login.login = function(e){
    e.preventDefault();
    login.email = $('#email').val();
    login.pass = $('#pass').val();

    var jqxhr = $.post('/api/login', {
        email : login.email,
        pass : login.pass
    });
    
    jqxhr.done(function(data){
        switch(data.role){
            case 'admin':
                window.location = '/admin/';
                break;
            case 'estudiante':
                window.location = '/inicio';
                break;
        }
            
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
            errorhelper.errorsviewhelper(error_msgs, 'form-login-errors', 'login'); 
        } 
    });
}

login.recover = function(e){
    e.preventDefault();
    //ingresar email
    var form = $('.form-email').clone();
    form.removeClass('hide');
    var modal = bootbox.dialog(form, [
     {
        "label" : "Cancelar",
        "class" : "btn-danger",
        "callback": function() {
        }
    },
    {
        "label" : "Enviar",
        "class" : "btn-success",
        "callback": function(e) {
            var email = form.find('.email_recover').val();
            var valid = true;
            var error_msg = '';
            if(email == ''){
                valid = false;
                error_msg = 'El campo es obligatorio';
            }
            else{
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if(!re.test(email)){
                    valid = false;
                    error_msg = 'El email ingresado no tiene un formato válido';
                }
            }
            
            if(valid){
                modal.modal('hide');
                bootbox.alert('En unos instantes recibirá sus datos de acceso en el correo proporcionado');
            }
            else{
                form.find('.error').remove();
                form.find('.email_recover').after('<p class="error" style="font-size:10px;color: red;padding:0;margin:0">'+error_msg+'</p>');
                return false;
            }
        }
    }
   
]);
    //verificar data
    //notificar resultado
}

$(login.init);


