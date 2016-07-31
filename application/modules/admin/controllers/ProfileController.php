<?php
require_once ('jpgraph/jpgraph.php');
require_once ('jpgraph/jpgraph_line.php');

class Admin_ProfileController extends Zend_Controller_Action
{
    private $_auth = null;
    /**
     * Doctrine EntityManager
     *
     * @var Doctrine\ORM\EntityManager
     *
     *
     *
     */
    private $_em = null;
    

    public function init()
    {
       $this->_auth = Zend_Auth::getInstance(); 
       $registry = Zend_Registry::getInstance();
       $this->_em = $registry->entitymanager;
       $identity = $this->_auth->getIdentity();
       if($identity['role'] == Acl_Roles::ESTUDIANTE){
           $this->_helper->layout->setLayout('estudiantes');
       }
    }

    public function indexAction()
    {
        // action body
    }

    public function viewAction()
    {
        $this->view->headScript()->appendFile('/js/utils/chart/Chart.min.js');  
        $this->view->headScript()->appendFile('/js/admin/profile.js');  
        
        
    }
    
    public function getdatacategoriaAction(){
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->getHelper('layout')->disableLayout();
        header('Content-type: application/json');
        
        $categoria = $this->getParam('categoria');
        $identity = $this->_auth->getIdentity();
        
        $dql = 'select p,n,c,t,te,tc from Application_Model_PerfilEstudiante p left join p.nivelescategorias n join n.categoria c left join p.testsfinalizados t join t.test te join te.categoria tc join p.usuario u where u.id = :user_id';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('user_id', $identity['id']);
        $perfil = $query->getArrayResult();
        
        var_dump($perfil);
    }


}



