<?php

class Api_TestsController extends Zend_Rest_Controller
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
                $tests[] = $tmp;
            } 
            echo Zend_Json::encode($tests);
        }
        else{
            //no se pudo obtener el creador
        }
        
    }
    
    public function getAction() {
        
    }
    
    //testear sin login
    public function postAction() {
        $nombre = $this->_getParam('nombre');
        $categoria = $this->_getParam('categoria');
        $criterio_parada = $this->_getParam('criterio_parada');
        $valor_criterio = $this->_getParam('valor_criterio');
        $profile_token = $this->_getParam('profile_token');
        $codigo_inicio = $this->_getParam('codigo_inicio');
        $fecha = $this->_getParam('fecha');
        $hora = $this->_getParam('hora');
        $grupo = $this->_getParam('grupo');
        $criterios = array(1 => Application_Model_Tests::CRITERIO_NUM_ITEMS, 2 => Application_Model_Tests::CRITERIO_NIVEL_CONOCIMIENTO);
        
        $filters = array();
        $validators = array();
        $data = array();
        
        if($this->_auth->hasIdentity()){
            $validators = array(
                'codigo_inicio' => array(
                    'NotEmpty',
                    'messages' => array(
                        '0' => 'El campo "codigo inicio" es obligatorio'
                    )
                ),
                'grupo' => array(
                    'NotEmpty',
                    array('GreaterThan', array('min' => 0)),
                    'messages' => array(
                        '0' => 'El campo "grupo" es obligatorio',
                        '1' => 'El campo "grupo" es obligatorio'
                    )
                ),
                'nombre' => array(
                    'NotEmpty',
                    'messages' => array(
                        '0' => 'El campo "nombre del test" es obligatorio'
                    )
                ),
                'categoria' => array(
                    array('GreaterThan', array('min' => 0)),
                    'NotEmpty',
                    'messages' => array(
                        '0' => 'Debe escoger una categoría',
                        '1' => 'Debe escoger una categoría'
                    )
                ),
                'criterio_parada' => array(
                    array('GreaterThan', array('min' => 0)),
                    'NotEmpty',
                    'messages' => array(
                        '0' => 'Debe escoger un criterio de parada',
                        '1' => 'Debe escoger un criterio de parada'
                    )
                )
            );
        }
        else{
            $validators = array(
                'codigo_inicio' => array(
                    'NotEmpty',
                    'messages' => array(
                        '0' => 'El campo "codigo inicio" es obligatorio'
                    )
                ),
                'grupo' => array(
                    'NotEmpty',
                    array('GreaterThan', array('min' => 0)),
                    'messages' => array(
                        '0' => 'El campo "grupo" es obligatorio',
                        '1' => 'El campo "grupo" es obligatorio'
                    )
                ),
                'nombre' => array(
                    'NotEmpty',
                    'messages' => array(
                        '0' => 'El campo "nombre del test" es obligatorio'
                    )
                ),
                'categoria' => array(
                    array('GreaterThan', array('min' => 0)),
                    'NotEmpty',
                    'messages' => array(
                        '0' => 'Debe escoger una categoría',
                        '1' => 'Debe escoger una categoría'
                    )
                ),
                'profile_token' => array(
                    'NotEmpty',
                    'messages' => array(
                        '0' => 'El token del usuario es obligatorio',
                    )
                ),
                'criterio_parada' => array(
                    array('GreaterThan', array('min' => 0)),
                    'NotEmpty',
                    'messages' => array(
                        '0' => 'Debe escoger un criterio de parada',
                        '1' => 'Debe escoger un criterio de parada'
                    )
                )
            );
        }
        
        if($criterio_parada > 0){
            if($criterios[$criterio_parada] == Application_Model_Tests::CRITERIO_NIVEL_CONOCIMIENTO){
                $validators['valor_criterio'] = array(
                    'NotEmpty',
                    'Float',
                    array('Between', array('min' => -3, 'max' => 3)),
                    'messages' => array(
                        '0' => 'El campo "Valor criterio de parada" es obligatorio',
                        '1' => 'El campo "Valor criterio de parada" debe ser un valor decimal',
                        '2' => 'El campo "Valor criterio de parada" debe tener un valor entre -3 y 3'
                    )
                );
            }
        
            if($criterios[$criterio_parada] == Application_Model_Tests::CRITERIO_NUM_ITEMS){
                $validators['valor_criterio'] = array(
                    'NotEmpty',
                    'Int',
                    array('GreaterThan', array('min' => 14)),
                    'messages' => array(
                        '0' => 'El campo "Valor criterio de parada" es obligatorio',
                        '1' => 'El campo "Valor criterio de parada" debe ser un valor entero',
                        '2' => 'El campo "Valor criterio de parada" debe ser un valor mayor o igual a 15',
                    )
                );
            }
        }
        
        if($this->_auth->hasIdentity()){
            $data = array(
                'categoria' => $categoria,
                'criterio_parada' => $criterio_parada,
                'valor_criterio' => $valor_criterio,
                'grupo' => $grupo,
                'codigo_inicio' => $codigo_inicio,
                'nombre' => $nombre
            );
        }
        else{
            $data = array(
                'categoria' => $categoria,
                'criterio_parada' => $criterio_parada,
                'profile_token' => $profile_token,
                'valor_criterio' => $valor_criterio,
                'grupo' => $grupo,
                'codigo_inicio' => $codigo_inicio,
                'nombre' => $nombre
            );
        }
        
        
        
        $input = new Zend_Filter_Input($filters, $validators, $data);
        
        if($input->isValid()){
//            var_dump($input);
            $save = false;
            $test = new Application_Model_Tests();
            $test->setEstado(1);
            $test->setNombre($input->nombre);
            $test->setGrupo($this->_em->getRepository('Application_Model_Grupos')->find($input->grupo));
            $test->setCodigo_inicio($input->codigo_inicio);
            $date = Datetime::createFromFormat('Y-m-d h:i', $fecha.' '.$hora);
            $test->setFechaprogramada($date);
            $test->setCategoria($this->_em->getRepository('Application_Model_Categorias')->find($input->categoria));
            if($this->_auth->hasIdentity()){
                $identity = $this->_auth->getIdentity();
                $dql = 'select u from Application_Model_Users u where u.id = :idusuario';
                $query = $this->_em->createQuery($dql);
                $query->setParameter('idusuario', $identity['id']);
                $user = $query->getResult();
                $test->setCreador($user[0]);
            }
            else{
                 $dql = 'select u,p from Application_Model_Users u join u.perfil p where p.token = :profile_token';
                 $query = $this->_em->createQuery($dql);
                 $query->setParameter('profile_token', $input->profile_token);
                 $user = $query->getResult();
                 $test->setCreador($user[0]);
            }
            $test->setFechaCreacion(new \Datetime('now'));
            $items = $this->_em->getRepository('Application_Model_Items')->findBy(array('categoria' => $input->categoria));
            if($criterios[$input->criterio_parada] == Application_Model_Tests::CRITERIO_NUM_ITEMS){
                if($input->valor_criterio <= count($items)){
                    $test->setTipo_criterio_parada($criterios[$input->criterio_parada]); 
                    $test->setCriterio_parada($input->valor_criterio);                    
                    $save = true;
                }
                else{
                    $error = array();
                    $error["criterio_parada"]['MaxNumItems'] = 'El valor del criterio de parada sobrepasa el número de ítems de la categoría('.count($items).')';
                    $this->getResponse()->setHttpResponseCode(500);
                    echo Zend_Json::encode($error);
                }
            }
            else{
                if($criterios[$input->criterio_parada] == Application_Model_Tests::CRITERIO_NIVEL_CONOCIMIENTO){
                    if(count($items) >= 15){
                        $test->setTipo_criterio_parada($criterios[$input->criterio_parada]); 
                        $test->setCriterio_parada($input->valor_criterio);
                        $save = true;
                    }
                    else{
                        $error = array();
                        $error["criterio_parada"]['MaxNumItems'] = 'No hay suficientes ítems en la categoría seleccionada para crear el test('.count($items).'). Se requieren 15 ítems como mínimo.';
                        $this->getResponse()->setHttpResponseCode(500);
                        echo Zend_Json::encode($error);
                    }
                }
            }
            if($save){
                $this->_em->persist($test);
                $this->_em->flush();
                echo Zend_Json::encode(array('test_token' => $test->getToken()));
            }
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
    
    public function headAction() {
        
    }


}

