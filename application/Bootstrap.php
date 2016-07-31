<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    public function _initViewHelpers(){
        $this->bootstrap('layout');
        $layout = $this->getResource('layout');
        $view = $layout->getView(); 
        $view->headScript()->appendFile('/js/jquery.js');
        $view->headScript()->appendFile('/js/bootstrap.min.js');
        $view->headScript()->appendFile('/js/prefixfree.min.js');
    }   
   
    
    public function _initDoctrine() {
        $conn = Cweb_Db_Adapter::getInstance('../application/configs/dataConnectDb.xml');
    	$registry = Zend_Registry::getInstance();
        return $registry->entitymanager;
    }
    
    public function _initRestApi(){
        $front = Zend_Controller_Front::getInstance();
        $router = $front->getRouter();
        $restRoute = new Zend_Rest_Route($front, array(), array(
            'api',
        ));
        $router->addRoute('rest', $restRoute);
        
    }
    
    public function _initJsonFiles(){
//        $front = Zend_Controller_Front::getInstance();
//        try {   
//            $front->bootstrap();
//            $front->dispatch();
//        }
//        catch (Exception $exception) {
//            echo "hola";
//        }
    }
    
    public function _initUserSession()
    {
        // If not already done, bootstrap the view
//        $this->bootstrap('view');
        $layout = $this->getResource('layout');
        $view = $layout->getView();

        // Initialise the session
        $user_data = new Zend_Session_Namespace('user_data');
        
        $view->programa_id = $user_data->programa_id;
        $view->programa = $user_data->programa;
        $view->institucion = $user_data->institucion;
        $view->nombre_completo = $user_data->nombre_completo;
        $view->tipo_usuario = $user_data->tipo_usuario;
        
    }

}

