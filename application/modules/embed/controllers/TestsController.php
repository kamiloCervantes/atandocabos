<?php

class Embed_TestsController extends Zend_Controller_Action
{

    public function init()
    {
        /* Initialize action controller here */
    }

    public function indexAction()
    {
        // action body
    }

    public function playAction()
    {
        $this->view->headLink()->appendStylesheet('/css/play.css');
        $this->view->headScript()->appendFile('/js/embed/testadministration.js'); 
    }


}

