<?php

class Admin_GruposController extends Zend_Controller_Action
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
        /* Initialize action controller here */
        $registry = Zend_Registry::getInstance();
        $this->_em = $registry->entitymanager;
    }

    public function indexAction()
    {
        $dql = "select g,p,i,e from Application_Model_Grupos g join g.programa p join p.institucion i left join g.estudiantes e where g.estado = :estado";
        $query = $this->_em->createQuery($dql); 
        $query->setParameter('estado', 1);
        $grupos = $query->getArrayResult();
        $this->view->grupos = $grupos;
//        var_dump($grupos);
    }

    public function viewAction()
    {
        $id = $this->getParam('id');
        $this->view->gid = $id;
        $user_data = new Zend_Session_Namespace('user_data');
        if($id > 0){
            $dql = "select g,p,i,e,u,up,ip from Application_Model_Grupos g join g.programa p join p.institucion i left join g.estudiantes e join e.usuario u join u.acceso_programas up join up.institucion ip where g.id = :grupo_id and up.id = :programa_id";
            $query = $this->_em->createQuery($dql); 
            $query->setParameter('grupo_id', $id);
            $query->setParameter('programa_id', $user_data->programa_id);
            $grupo = $query->getArrayResult();
            $this->view->grupo = $grupo;
//            var_dump($grupo);
        }
    }
    
    public function addAction(){
        if($this->getRequest()->isPost()){
            $nombre = $this->getParam("nombre");
            $data_user = new Zend_Session_Namespace('user_data');
            $grupo = new Application_Model_Grupos();
            $grupo->setNombre($nombre);
            $grupo->setEstado(1);
            $grupo->setPrograma($this->_em->getRepository('Application_Model_Programas')->find($data_user->programa_id));
            $this->_em->persist($grupo);
            $this->_em->flush();
            $this->_helper->redirector('index', 'grupos', 'admin');
        }
    }
    
    public function adduserAction(){
        $this->view->gid = $this->getParam('gid');
        if($this->getRequest()->isPost()){
            $nombre = $this->_getParam('nombre');
//            var_dump($nombre);
            $apellido = $this->_getParam('apellido');
            $email = $this->_getParam('email');
            $pass = $this->_getParam('pass');
            $pass2 = $this->_getParam('pass2');
            $gid = $this->_getParam('gid');

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
            $error_msgs = array();
            if($input->isValid()){
                if($input->pass == $input->pass2){
                    $user = new Application_Model_Users();
                    $user->setApellido($input->apellido);
                    $user->setNombre($input->nombre);
                    $user->setEmail($input->email);
                    $user->setEstado(1);
                    $user->setPassword($input->pass);
                    $user->setPerfil(new Application_Model_PerfilEstudiante($input->email));
                    $user->setRole(Acl_Roles::ESTUDIANTE); 
    //                $user->setBancoitems(new Application_Model_BancoItems('Mi banco de ítems'));
                    $user->setBancoitems($this->_em->getRepository('Application_Model_BancoItems')->find(1));
                    
                    
                    if($gid > 0){
                        $grupo = $this->_em->getRepository('Application_Model_Grupos')->find($gid);
                        $grupo->getEstudiantes()->add($user->getPerfil());
                        $this->_em->persist($grupo);
                    }
                    
                    $user_data = new Zend_Session_Namespace('user_data');
                    if($user_data->programa_id){
                        $user->getAcceso_programas()->add($this->_em->getRepository('Application_Model_Programas')->find($user_data->programa_id));
                    }
                    
                    $this->_em->persist($user);
                    
                    $this->_em->flush();
                }
                else{
                    $error = array();
                    $error["pass2"]['NotMatch'] = 'Las contraseñas no coinciden.';
                    $error_msgs[] = $error;
                }

            }
            else{
                $error_msgs[] = $input->getMessages();
            }
            if(count($error_msgs) == 0){
                $this->_helper->redirector('view', 'grupos', 'admin', array('id' => $this->getParam('gid')));
            }
        }
    }


}



