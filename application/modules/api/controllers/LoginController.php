<?php

class Api_LoginController extends Zend_Rest_Controller
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
    
    /**
     * Cweb DoctrineAdapter
     *
     * @var Cweb\Auth\DoctrineAdapter
     *
     *
     *
     */
    private $_adapter = null;

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
        echo "hola";
    }
    
    public function getAction() {
        
    }
    
    public function postAction() {
        $email = $this->_getParam('email');
        $pass = $this->_getParam('pass');
        
        $filters = array();
        
        $validators = array(
            'email' => array(
                'NotEmpty',
                'EmailAddress',
                array('StringLength', array('max' => 50)),
                'messages' => array(
                    '0' => 'El campo "Correo electrónico" es obligatorio',
                    '1' => 'El campo "Correo electrónico" no es un correo válido',
                    '2' => 'El campo "Correo electrónico" puede tener máximo 50 caracteres'
                )
            ),
            'pass' => array(
                'NotEmpty',
                'Alnum',
                array('StringLength', array('max' => 50)),
                'messages' => array(
                    '0' => 'El campo "Contraseña" es obligatorio',
                    '1' => 'El campo "Contraseña" debe ser un valor alfanumérico',
                    '2' => 'El campo "Contraseña" puede tener máximo 50 caracteres'
                )
            )
        );
        
        $data = array(
            'email' => $email,
            'pass' => $pass
        );
        
        $input = new Zend_Filter_Input($filters, $validators, $data);
        if($input->isValid()){
            if(!$this->_auth->hasIdentity()){
                $this->_adapter = new Cweb_Auth_DoctrineAdapter($this->_em, "Application_Model_Users", 'email', 'password');
                $this->_adapter->setIdentity($input->email);
                $this->_adapter->setCredential(hash('sha256', $input->pass));
                $authenticate = $this->_auth->authenticate($this->_adapter);
                if($authenticate->isValid()){
                    $this->getResponse()->setHttpResponseCode(200);
                    
                    //contexto
                    $identity = $this->_auth->getIdentity();
//                    $user = $this->_em->getRepository("Application_Model_Users")->find($identity['id']);
                    $dql = "select u,ap,i from Application_Model_Users u join u.acceso_programas ap join ap.institucion i where u.id = :user_id";
                    $query = $this->_em->createQuery($dql);
                    $query->setParameter('user_id', $identity['id']);
                    $user = $query->getArrayResult();
//                    var_dump($user);
                    $roles = array(
                        'admin' => 'Evaluador',
                        'estudiante' => 'Estudiante',
                    );
                    
                    
                    $user_data = new Zend_Session_Namespace('user_data');
                    $user_data->programa_id = $user[0]['acceso_programas'][0]['id'];
                    $user_data->programa = $user[0]['acceso_programas'][0]['nombre'];
                    $user_data->institucion = $user[0]['acceso_programas'][0]['institucion']['nombre'];
                    $user_data->nombre_completo = $user[0]['nombre'].' '.$user[0]['apellido'];
                    $user_data->tipo_usuario = $roles[$user[0]['role']];
                    echo Zend_Json::encode(array(
                        'role' => $user[0]['role']
                    ));
                }
                else{
                    $this->getResponse()->setHttpResponseCode(500);
                    $error_msg = array();
                    $error_msg["username"]["autherror"] = "El usuario o contraseña son incorrectos.";
                    echo Zend_Json::encode($error_msg);
                    }
                }
        }
        else{
            $this->getResponse()->setHttpResponseCode(500);
            echo Zend_Json::encode($input->getMessages());
        }
    }
    
    public function deleteAction() {
        $this->_auth->clearIdentity();
    }
    
    public function headAction() {}
    
    public function putAction() {}


}

