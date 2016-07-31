<?php

class Api_ProfileController extends Zend_Rest_Controller
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
        $registry = Zend_Registry::getInstance();
        $this->_em = $registry->entitymanager;
        $this->_auth = Zend_Auth::getInstance(); 
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->getHelper('layout')->disableLayout();
        header('Content-type: application/json');
    }

    public function indexAction()
    {
        $profiledata = array();
        if($this->_auth->hasIdentity()){
            $identity = $this->_auth->getIdentity();
            $dql = 'select u,p from Application_Model_Users u join u.perfil p where u.id = :idusuario';
            $query = $this->_em->createQuery($dql);
            $query->setParameter('idusuario', $identity['id']);
            $user = $query->getResult();
            $perfil = $user[0]->getPerfil();
            
            $profiledata['email'] = $user[0]->getEmail();
            $profiledata['profile_token'] = $perfil->getToken();
        }
        echo Zend_Json::encode($profiledata);
    }
    
    public function getAction() {
        $profile_token = $this->_getParam('id');
        $dql = 'select p,n,c,t,te,tc from Application_Model_PerfilEstudiante p left join p.nivelescategorias n join n.categoria c left join p.testsfinalizados t join t.test te join te.categoria tc where p.token = :profile_token';
        $query = $this->_em->createQuery($dql);
        $query->setParameter('profile_token', $profile_token);
        $perfil = $query->getArrayResult();

        for($i = 0; $i < count($perfil[0]['nivelescategorias']); $i++){
            $perfil[0]['nivelescategorias'][$i]['ability'] = Application_Model_Tests::ability($perfil[0]['nivelescategorias'][$i]['ability']);
        }
        
//        var_dump($perfil[0]['testsfinalizados']);
     
        for($j = 0; $j < count($perfil[0]['testsfinalizados']); $j++){
            $perfil[0]['testsfinalizados'][0]['nivelfinal'] = $perfil[0]['testsfinalizados'][0]['nivelfinal'];
        }
        
        echo Zend_Json::encode($perfil);
    }
    
    //testear
    public function postAction() {
        $email = $this->_getParam('email');
        $filters = array();
        $validators = array(
                'email' => array(
                    'NotEmpty',
                    'EmailAddress',
                    'messages' => array(
                        '0' => 'El correo electrónico es obligatorio',
                        '1' => 'El correo electrónico es inválido'
                    )
                )
            );
        $data = array(
            'email' => $email
        );
        
        $input = new Zend_Filter_Input($filters, $validators, $data);
        
         if($input->isValid()){
             $perfil = new Application_Model_PerfilEstudiante($input->email);
             $this->_em->persist($perfil);
             $this->_em->flush();
             echo Zend_Json::encode(array('profile_token' => $perfil->getToken()));
         }
         else{
            $this->getResponse()->setHttpResponseCode(500);
            echo Zend_Json::encode($input->getMessages());
         }
        
    }
    
    public function putAction() {
        
    }
    
    public function deleteAction() {
        
    }
    
    public function headAction() {}


}

