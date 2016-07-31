<?php

class Api_UsersController extends Zend_Rest_Controller
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

    public function init()
    {
        $registry = Zend_Registry::getInstance();
        $this->_em = $registry->entitymanager;
        $this->_helper->viewRenderer->setNoRender();
        $this->_helper->getHelper('layout')->disableLayout();
        header('Content-type: application/json');
    }

    public function indexAction()
    {
        // action body
    }
    
    public function getAction() {
        
    }
    
    public function postAction() {
        $nombre = $this->_getParam('nombre');
        $apellido = $this->_getParam('apellido');
        $email = $this->_getParam('email');
        $pass = $this->_getParam('pass');
        $pass2 = $this->_getParam('pass2');
        
        $filters = array();
        
        $validators = array(
            'nombre' => array(
                'NotEmpty',
                array('StringLength', array('max' => 50)),
                'Alpha',
                'messages' => array(
                    '0' => 'El campo "Nombre" es obligatorio',
                    '1' => 'El campo "Nombre" puede tener máximo 50 caracteres',
                    '2' => 'El campo "Nombre" no puede contener números ni caracteres especiales'
                )
            ),
            'apellido' => array(
                'NotEmpty',
                array('StringLength', array('max' => 50)),
                'Alpha',
                'messages' => array(
                    '0' => 'El campo "Apellido" es obligatorio',
                    '1' => 'El campo "Apellido" puede tener máximo 50 caracteres',
                    '2' => 'El campo "Apellido" no puede contener números ni caracteres especiales'
                )
            ),
            'email' => array(
                'NotEmpty',
                array('StringLength', array('max' => 50)),
                'EmailAddress',
                'messages' => array(
                    '0' => 'El campo "Correo electrónico" es obligatorio',
                    '1' => 'El campo "Correo electrónico" puede tener máximo 50 caracteres',
                    '2' => 'El campo "Correo electrónico" no es un correo válido'
                )
            ),
            'pass' => array(
                'NotEmpty',
                array('StringLength', array('max' => 50)),
                'Alnum',
                'messages' => array(
                    '0' => 'El campo "Contraseña" es obligatorio',
                    '1' => 'El campo "Contraseña" puede tener máximo 50 caracteres',
                    '2' => 'El campo "Contraseña" no puede contener caracteres especiales'
                )
            ),
            'pass2' => array(
                'NotEmpty',
                array('StringLength', array('max' => 50)),
                'Alnum',
                'messages' => array(
                    '0' => 'Debe repetir la contraseña',
                    '1' => 'Las contraseñas no coinciden',
                    '2' => 'Las contraseñas no coinciden'
                )
            )
        );
        
        $data = array(
            'nombre' => $nombre,
            'apellido' => $apellido,
            'email' => $email,
            'pass' => $pass,
            'pass2' => $pass2
        );
        
        $input = new Zend_Filter_Input($filters, $validators, $data);
        
        if($input->isValid()){
            if($input->pass == $input->pass2){
                $user = new Application_Model_Users();
                $user->setApellido($input->apellido);
                $user->setNombre($input->nombre);
                $user->setEmail($input->email);
                $user->setEstado(0);
                $user->setPassword($input->pass);
                $user->setPerfil(new Application_Model_PerfilEstudiante($input->email));
                $user->setRole(Acl_Roles::ADMIN); 
//                $user->setBancoitems(new Application_Model_BancoItems('Mi banco de ítems'));
                $user->setBancoitems($this->_em->getRepository('Application_Model_BancoItems')->find(1));
                $this->_em->persist($user);
                $this->_em->flush();
            }
            else{
                $error = array();
                $error["pass2"]['NotMatch'] = 'Las contraseñas no coinciden.';
                $this->getResponse()->setHttpResponseCode(500);
                echo Zend_Json::encode($error);
            }
            
        }
        else{
            $this->getResponse()->setHttpResponseCode(500);
            echo Zend_Json::encode($input->getMessages());
        }
    }
    
    public function deleteAction() {
        
    }
    
    public function headAction() {}
    
    public function putAction() {}
    
}

