<?php

class Api_CategoriasController extends Zend_Rest_Controller
{
     /**
     * Doctrine EntityManager
     *
     * @var Doctrine\ORM\EntityManager
     *
     *
     *
     */
    private $_em = null;
    
    private $_auth = null;
    
    public function init()
    {
       $registry = Zend_Registry::getInstance();
       $this->_em = $registry->entitymanager;
       $this->_auth = Zend_Auth::getInstance();
       $this->_helper->viewRenderer->setNoRender();
       $this->_helper->getHelper('layout')->disableLayout();
       header('Content-type: application/json');
    }

    public function indexAction()
    {
//        $profile_token = $this->_getParam('token');
//        $error_msg = $this->getRequest()->getRawBody();
//        echo json_encode($error_msg);
        $profile_token = $this->_getParam('token');
        if($this->_auth->hasIdentity()){
            $identity = $this->_auth->getIdentity();
            $dql = 'select u from Application_Model_Users u where u.id = :idusuario';
            $query = $this->_em->createQuery($dql);
            $query->setParameter('idusuario', $identity['id']);
            $user = $query->getResult();

        }
        else{
            $dql = 'select u,p from Application_Model_Users u join u.perfil p where p.token = :profile_token';
            $query = $this->_em->createQuery($dql);
            $query->setParameter('profile_token', $profile_token);
            $user = $query->getResult();
        }
//        if($this->_auth->hasIdentity()){
            $categorias = array();
//            $identity = $this->_auth->getIdentity();
//            $dql = 'select u, b from Application_Model_Users u left join u.bancoitems b where u.id = :iduser';
////            $dql = 'select u,b,c,h from Application_Model_Users u left join u.bancoitems b left join b.categorias c left join c.hijos h where u.id = :iduser';
//            $query = $this->_em->createQuery($dql);
//            $query->setParameter('iduser', $identity['id']);
//            $user = $query->getResult();
            $_bancoitems = $user[0]->getBancoitems();
            if(count($_bancoitems) > 0){
                $_categorias = $_bancoitems->getCategorias();
                foreach ($_categorias as $categoria){
                    $tmp = array();
                    $tmp['nombrecategoria'] = $categoria->getNombre();
                    $tmp['idcategoria'] = $categoria->getId();
                    if($categoria->getPadre()!= null){
                        $tmp['categoriapadre'] = $categoria->getPadre()->getNombre();
                    }
                    else{
                        $tmp['categoriapadre'] = 'N/A';
                    }
                    $categorias[] = $tmp;
                }
            }
//        }
        echo Zend_Json::encode($categorias);
    }
    
    public function getAction() {
       if($this->_auth->hasIdentity()){
            $param = $this->_getParam('view');
            if($param == 'jerarquia'){
                $categorias = array();
                $identity = $this->_auth->getIdentity();
    //            $dql = 'select u, b from Application_Model_Users u left join u.bancoitems b where u.id = :iduser';
                $dql = 'select u,b,c,h from Application_Model_Users u left join u.bancoitems b left join b.categorias c left join c.hijos h where u.id = :iduser';
                $query = $this->_em->createQuery($dql);
                $query->setParameter('iduser', $identity['id']);
                $user = $query->getArrayResult();
                var_dump($user);
//                $_bancoitems = $user[0]->getBancoitems();
//                if(count($_bancoitems) > 0){
//                    $_categorias = $_bancoitems->getCategorias();
//                    foreach ($_categorias as $categoria){
//                        $tmp = array();
//                        $tmp['nombrecategoria'] = $categoria->getNombre();
//                        $tmp['idcategoria'] = $categoria->getId();
//                        if($categoria->getPadre()!= null){
//                            $tmp['categoriapadre'] = $categoria->getPadre()->getNombre();
//                        }
//                        else{
//                            $tmp['categoriapadre'] = 'N/A';
//                        }
//                        $categorias[] = $tmp;
//                    }
//                }
                $categorias = $user[0]['bancoitems']['categorias'];
            }
        }
        else{
//            $request = json_decode($this->getRequest()->getRawBody());
            $profile_token = $this->_getParam('token');
            $dql = 'select u,p from Application_Model_Users u join u.perfil p where p.token = :profile_token';
            $query = $this->_em->createQuery($dql);
            $query->setParameter('profile_token', $profile_token);
            $user = $query->getResult();
            
            $categorias = array();
            $_bancoitems = $user[0]->getBancoitems();
            if(count($_bancoitems) > 0){
                $_categorias = $_bancoitems->getCategorias();
                foreach ($_categorias as $categoria){
                    $tmp = array();
                    $tmp['nombrecategoria'] = $categoria->getNombre();
                    $tmp['idcategoria'] = $categoria->getId();
                    if($categoria->getPadre()!= null){
                        $tmp['categoriapadre'] = $categoria->getPadre()->getNombre();
                    }
                    else{
                        $tmp['categoriapadre'] = 'N/A';
                    }
                    $categorias[] = $tmp;
                }
            }
        }
        echo Zend_Json::encode($categorias);
    }
    
    public function postAction() {
        if($this->_auth->hasIdentity()){
            $nombrecategoria = $this->_getParam('nombrecategoria');
            $categoriapadre = $this->_getParam('categoriapadre');

            $filters = array(

            );

            $validators = array(
                'nombrecategoria' => array(
                    'NotEmpty',
                    array('StringLength', array('max' => 50)),
                    'messages' => array(
                        '0' => 'El campo "Nombre de categoría" es obligatorio',
                        '1' => 'El campo "Nombre de categoría" puede tener máximo 50 caracteres'
                    )
                ),
                'categoriapadre' => array(
                    'NotEmpty',
                    'messages' => array(
                        '0' => 'Debe seleccionar una categoría padre.'
                    )
                )
            );

            $data = array(
                'nombrecategoria' => $nombrecategoria,
                'categoriapadre' => $categoriapadre
            );

            $input = new Zend_Filter_Input($filters, $validators, $data);

            if($input->isValid()){
                $identity = $this->_auth->getIdentity();
                $dql = 'select u, b from Application_Model_Users u left join u.bancoitems b where u.id = :iduser';
                $query = $this->_em->createQuery($dql);
                $query->setParameter('iduser', $identity['id']);
                $user = $query->getResult();
                $bancoitems = $user[0]->getBancoitems();
                $categoria = new Application_Model_Categorias();
                $categoria->setNombre($input->nombrecategoria);
                if($input->categoriapadre > 0){
                    $categoria->setPadre($this->_em->getRepository('Application_Model_Categorias')->find($input->categoriapadre));
                }
                $bancoitems->getCategorias()->add($categoria);
                $this->_em->persist($bancoitems);
                $this->_em->flush();
            }
            else{
                $this->getResponse()->setHttpResponseCode(500);
                echo Zend_Json::encode($input->getMessages());
            }
        }
        else{
            
        }
    }
    
    public function putAction() {
        
    }
    
    public function deleteAction() {
        
    }
    
    public function headAction() {}


}

