var logout = {};

logout.init = function(){
    logout.logout();
}

logout.logout = function(){
     var jqxhr = $.ajax({
                url: '/api/login',
                type: 'DELETE'
            });
     jqxhr.done(function(){
          window.location = '/login';  
     });
}

$(logout.init);
