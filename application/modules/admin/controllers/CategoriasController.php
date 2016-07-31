<?php

class Admin_CategoriasController extends Zend_Controller_Action
{

    public function init()
    {
        $this->view->headScript()->appendFile('/js/utils/errorshelpers.js');
        $this->view->headScript()->appendFile('/js/admin/categorias.js');
    }

    public function indexAction()
    {
        $this->view->headScript()->appendFile('/js/admin/categorias-list.js');
    }

    public function addAction()
    {
        $this->view->headScript()->appendFile('/js/admin/categorias-add.js');
    }


}



