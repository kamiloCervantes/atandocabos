<?php

class Admin_UsuariosController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
    }

    public function viewAction()
    {
        $this->view->headScript()->appendFile('/js/admin/profile.js');  
    }
    
    public function addAction(){
        
    }


}



