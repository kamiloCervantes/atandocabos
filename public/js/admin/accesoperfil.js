var accesoperfil = {};

accesoperfil.perfil = $('#perfil');

accesoperfil.init = function(){
    var jqxhr = $.get('/api/profile');
    
    jqxhr.done(function(data){
        accesoperfil.perfil.html(accesoperfil.perfilhelper(data));
    });
    
}

accesoperfil.perfilhelper = function(user){
    var html = '';
    html += '<li class="pull-right">';
    html += '<a class="dropdown-toggle" data-toggle="dropdown" href="#"><i class="icon-user icon-white"></i> '+user.email+' <b class="caret"></b></a>';
    html += '<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">';
    html += '<li><a href="/admin/profile/view/id/'+user.profile_token+'">Ver estadísticas</a></li>';
    html += '</ul>';
    html += '</li>';  
    return html;
}

$(accesoperfil.init);