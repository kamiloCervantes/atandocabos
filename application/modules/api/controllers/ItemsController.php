<?php

class Api_ItemsController extends Zend_Rest_Controller
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
        if($this->_auth->hasIdentity()){
            $items = array();
            $identity = $this->_auth->getIdentity();
            $dql = 'select u, b from Application_Model_Users u left join u.bancoitems b where u.id = :iduser';
            $query = $this->_em->createQuery($dql);
            $query->setParameter('iduser', $identity['id']);
            $user = $query->getResult();
            $bancoitems = $user[0]->getBancoitems();
            $_items = $bancoitems->getItems();
            foreach ($_items as $item){
                $tmp = array();
                $tmp['enunciado'] = html_entity_decode($item->getEnunciado());
                $tmp['categoria'] = $item->getCategoria()->getNombre();
                $tmp['complejidad'] = $item->getComplejidad();
                $items[] = $tmp;
            }
            echo Zend_Json::encode($items);
        }
        else{
            
        }
    }
    
    public function getAction() {
        
    }
    
    public function postAction() {
        if($this->_auth->hasIdentity()){
            $categoria = $this->_getParam('categoria');
            $enunciado = $this->_getParam('enunciado');
            $param_a = $this->_getParam('param_a');
            $param_b = $this->_getParam('param_b');
            $param_c = $this->_getParam('param_c');
            $opciones = Zend_Json::decode($this->_getParam('opciones'));
            
            if(count($opciones) >= 4){
                $filters = array();
                
                $validators = array(
                'categoria' => array(
                    array('GreaterThan', array('min' => 0)),
                    'messages' => array(
                        '0' => 'Debe escoger una categoría'
                    )
                ),
                'enunciado' => array(
                    'NotEmpty',
                    array('StringLength', array('max' => 60000)),
                    'messages' => array(
                        '0' => 'El campo "Enunciado" es obligatorio',
                        '1' => 'El campo "Enunciado" puede tener máximo 2000 caracteres'
                    )
                ),
                'param_a' => array(
                    'NotEmpty',
                    'Float',
//                    array('GreaterThan', array('min' => 0)),
                    'messages' => array(
                        '0' => 'El campo "Parámetro a" es obligatorio',
                        '1' => 'El campo "Parámetro a" debe ser un valor decimal',
//                        '2' => 'El campo "Parámetro a" debe ser un valor positivo'
                    )
                ),
                'param_b' => array(
                    'NotEmpty',
                    'Float',
                    array('Between', array('min' => -4, 'max' => 4)),
                    'messages' => array(
                        '0' => 'El campo "Parámetro b" es obligatorio',
                        '1' => 'El campo "Parámetro b" debe ser un valor decimal',
                        '2' => 'El campo "Parámetro b" debe ser un valor entre -6 y 6'
                    )
                ),
                'param_c' => array(
                    'NotEmpty',
                    'Float',
//                    array('GreaterThan', array('min' => 0)),
                    'messages' => array(
                        '0' => 'El campo "Parámetro c" es obligatorio',
                        '1' => 'El campo "Parámetro c" debe ser un valor decimal',
//                        '2' => 'El campo "Parámetro c" debe ser un valor positivo'
                    )
                )
              );
                
              $data = array(
                'categoria' => $categoria,
                'enunciado' => $enunciado,
                'param_a' => $param_a,
                'param_b' => $param_b,
                'param_c' => $param_c,
                );
              
              for($i=0; $i<count($opciones); $i++){
                  $validators['opcion_'.($i+1)] = array(
                        'NotEmpty',
                        array('StringLength', array('max' => 2000)),
                        'messages' => array(
                            '0' => 'La opción #'.($i+1).' es obligatoria.',
                            '1' => 'La opción #'.($i+1).' tiene más de 2000 caracteres.',
                        )
                    );
                  $data['opcion_'.($i+1)] = $opciones[$i]['enunciado'];
              }
              
               $input = new Zend_Filter_Input($filters, $validators, $data);
                   
                if($input->isValid()){
                    $identity = $this->_auth->getIdentity();
                    $dql = 'select u, b from Application_Model_Users u left join u.bancoitems b where u.id = :iduser';
                    $query = $this->_em->createQuery($dql);
                    $query->setParameter('iduser', $identity['id']);
                    $user = $query->getResult();
                    $bancoitems = $user[0]->getBancoitems();
                    $item = new Application_Model_Items();
                    $item->setEnunciado($input->enunciado);
                    $item->setCategoria($this->_em->getRepository("Application_Model_Categorias")->find($input->categoria));
                    $item->setParam_a($input->param_a);
                    $item->setParam_b($input->param_b);
                    $item->setParam_c($input->param_c);
                    for($i=0; $i<count($opciones); $i++){
                        $variable = "opcion_".($i+1);
                        $opcion = new Application_Model_Opciones();
                        $opcion->setEnunciado($input->$variable);
                        $opcion->setCorrecta($opciones[$i]['correcta']);
                        $item->getOpciones()->add($opcion);
                    }
                    $bancoitems->getItems()->add($item);
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
            
           
            

            

//            if($input->isValid()){
//                $identity = $this->_auth->getIdentity();
//                $dql = 'select u, b from Application_Model_Users u left join u.bancoitems b where u.id = :iduser';
//                $query = $this->_em->createQuery($dql);
//                $query->setParameter('iduser', $identity['id']);
//                $user = $query->getResult();
//                $bancoitems = $user[0]->getBancoitems();
//                $item = new Application_Model_Items();
//                $item->setEnunciado($input->enunciado);
//                $item->setCategoria($this->_em->getRepository("Application_Model_Categorias")->find($input->categoria));
//                $item->setParam_a($input->param_a);
//                $item->setParam_b($input->param_b);
//                $item->setParam_c($input->param_c);
//                $opcion1 = new Application_Model_Opciones();
//                $opcion1->setEnunciado($input->opcion_1);
//                $opcion1->setCorrecta($opciones[0]['correcta']);
//                $opcion2 = new Application_Model_Opciones();
//                $opcion2->setEnunciado($input->opcion_2);
//                $opcion2->setCorrecta($opciones[1]['correcta']);
//                $opcion3 = new Application_Model_Opciones();
//                $opcion3->setEnunciado($input->opcion_3);
//                $opcion3->setCorrecta($opciones[2]['correcta']);
//                $opcion4 = new Application_Model_Opciones();
//                $opcion4->setEnunciado($input->opcion_4);
//                $opcion4->setCorrecta($opciones[3]['correcta']);
//                $opcion5 = new Application_Model_Opciones();
//                $opcion5->setEnunciado($input->opcion_5);
//                $opcion5->setCorrecta($opciones[4]['correcta']);
//                $item->getOpciones()->add($opcion1);
//                $item->getOpciones()->add($opcion2);
//                $item->getOpciones()->add($opcion3);
//                $item->getOpciones()->add($opcion4);
//                $item->getOpciones()->add($opcion5);
//                $bancoitems->getItems()->add($item);
//                $this->_em->persist($bancoitems);
//                $this->_em->flush();
//            }
//            else{
//                $this->getResponse()->setHttpResponseCode(500);
//                echo Zend_Json::encode($input->getMessages());
//            }
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

