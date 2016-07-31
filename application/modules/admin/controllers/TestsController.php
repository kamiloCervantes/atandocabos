<?php

class Admin_TestsController extends Zend_Controller_Action
{
    private $_em = null;    
    private $_auth = null;

    public function init()
    {
        $registry = Zend_Registry::getInstance();
        $this->_em = $registry->entitymanager;
        $this->_auth = Zend_Auth::getInstance(); 
        $this->view->headScript()->appendFile('/js/utils/errorshelpers.js');
        $this->view->headScript()->appendFile('/js/admin/categorias.js');
        $this->view->headScript()->appendFile('/js/admin/tests.js');
    }
    
    
    public function viewAction(){
        $id = $this->getParam('id');
        $criterios = array(Application_Model_Tests::CRITERIO_NUM_ITEMS => 'Número de ítems fijo', Application_Model_Tests::CRITERIO_NIVEL_CONOCIMIENTO => 'Nivel de conocimiento límite');
        if($id > 0){
            $dql = 'select t,c,ca,g,e from Application_Model_Tests t join t.creador c join t.categoria ca join t.grupo g left join g.estudiantes e where t.id = :idtest';
            $query = $this->_em->createQuery($dql);
            $query->setParameter('idtest', $id);
            $test = $query->getArrayResult();
            $test[0]['tipo_criterio_parada'] = $criterios[$test[0]['tipo_criterio_parada']];
            $this->view->test = $test;
            
            $dql_2 = 'select rt from Application_Model_ResultadosTest rt left join rt.test t where t.id = :test_id';
            $query_2 = $this->_em->createQuery($dql_2);
            $query_2->setParameter('test_id', $id);
            $resultados = $query_2->getArrayResult();
            $this->view->resultados = count($resultados);
//            var_dump($resultados);
            $r_aux = array_map(function($resultado){
                return $resultado['nivelfinal'];
            }, $resultados);            
            $max = max($r_aux);
            $this->view->max = $max;
            
            $dql_3 = 'select i from Application_Model_Items i join i.categoria c where c.id = :categoria_id or c.padre = :categoria_id';
            $query_3 = $this->_em->createQuery($dql_3);
            $query_3->setParameter('categoria_id', $test[0]['categoria']['id']);
            $items = $query_3->getArrayResult();
            $this->view->items = count($items);
        }
        else{
            //redirect a listado de tests
        }
    }

    public function indexAction()
    {
        $identity = $this->_auth->getIdentity();
        $this->view->role = $identity['role'];
        if($identity['role'] == Acl_Roles::ESTUDIANTE){
            $this->_helper->redirector('index', 'inicio', 'default');
        }
        $this->view->headLink()->appendStylesheet('/css/tests.css');
        $this->view->headScript()->appendFile('/js/admin/tests-list.js');
        $tests = array();
//        $_tests = Application_Model_Tests::fetchAll($this->_em);
        $profile_token = $this->_getParam('profile_token');
        $creador = null;
        if($this->_auth->hasIdentity()){
            $identity = $this->_auth->getIdentity();
            $dql = 'select u from Application_Model_Users u where u.id = :idusuario';
            $query = $this->_em->createQuery($dql);
            $query->setParameter('idusuario', $identity['id']);
            $user = $query->getResult();
            $creador = $user[0];
        }
        else{
            $dql = 'select u,p from Application_Model_Users u join u.perfil p where p.token = :profile_token';
            $query = $this->_em->createQuery($dql);
            $query->setParameter('profile_token', $profile_token);
            $user = $query->getResult();
            $creador = $user[0];
        }
        
        if($creador != null){
            $_tests = $this->_em->getRepository('Application_Model_Tests')->findBy(array('creador' => $creador));
            $criterios = array(Application_Model_Tests::CRITERIO_NUM_ITEMS => 'Número de ítems fijo', Application_Model_Tests::CRITERIO_NIVEL_CONOCIMIENTO => 'Nivel de conocimiento límite');
            foreach($_tests as $test){
                $tmp = array();
                $tmp['id'] = $test->getId();
                $tmp['categoria'] = $test->getCategoria()->getNombre();
                $tmp['criterio_parada'] = $criterios[$test->getTipo_criterio_parada()];
                $tmp['valor_criterio'] = $test->getCriterio_parada();
                $tmp['token'] = $test->getToken();
                $tmp['nombre'] = $test->getNombre();
                $tmp['creador'] = $creador->getNombre().' '.$creador->getApellido();
                $tmp['fecha_creacion'] = $test->getFechacreacion()->format('Y-m-d H:i');
                $tests[] = $tmp;
            } 
            
        }
        $this->view->tests = $tests;
//        var_dump($tests);
    }

    public function addAction()
    {
        $this->view->headLink()->appendStylesheet('/js/utils/datepicker/css/datepicker.css');
        $this->view->headLink()->appendStylesheet('/js/utils/clockpicker/clockpicker.css');
//        $this->view->headScript()->appendFile('/js/utils/datepicker/js/bootstrap-datepicker.es.js');
        $this->view->headScript()->appendFile('/js/utils/datepicker/js/bootstrap-datepicker.js');
        $this->view->headScript()->appendFile('/js/utils/clockpicker/clockpicker.js');
        $this->view->headScript()->appendFile('/js/admin/tests-add.js');
        $dql = "select g from Application_Model_Grupos g where g.estado = :estado";
        $query = $this->_em->createQuery($dql); 
        $query->setParameter('estado', 1);
        $grupos = $query->getArrayResult();
        $this->view->grupos = $grupos;
//        var_dump($grupos); 
    }

    public function playAction()
    {
        $identity = $this->_auth->getIdentity();
        $this->view->role = $identity['role'];
        if($identity['role'] == Acl_Roles::ESTUDIANTE){
            $this->_helper->layout->setLayout('estudiantes');
        }
        $this->view->headLink()->appendStylesheet('/css/play.css');
        $this->view->headScript()->appendFile('/js/admin/testadministration.js');  
    }



}





