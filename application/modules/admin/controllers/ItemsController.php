<?php

class Admin_ItemsController extends Zend_Controller_Action
{

    public function init()
    {
        $this->view->headScript()->appendFile('/js/utils/tiny_mce/tiny_mce.js');
        $this->view->headScript()->appendFile('/js/utils/errorshelpers.js');
        $this->view->headScript()->appendFile('/js/admin/categorias.js');
        $this->view->headScript()->appendFile('/js/admin/items.js');
    }

    public function indexAction()
    {
        $this->view->headScript()->appendFile('/js/admin/items-list.js');
    }

    public function addAction()
    {
//        $this->view->headScript()->appendFile('/js/bootstrap-slider.js');
        $this->view->headScript()->appendFile('/js/admin/items-add.js');
//        $this->view->headLink()->appendStylesheet('/css/slider.css');
    }


}



