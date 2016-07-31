<?php

class Api_TestadministrationController extends Zend_Rest_Controller
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
        
    }


    public function getAction() {
//        if($this->_auth->hasIdentity()){
            $test_token = $this->_getParam('token');
            $profile_token = $this->_getParam('pid');
            
            $filters = array();
            $validators = array();
            $data = array();
            
            if($this->_auth->hasIdentity()){
                $validators = array(
                    'test_token' => array(
                        'NotEmpty',
                        'messages' => array(
                            '0' => 'El token del test es obligatorio'
                        )
                    )
                );

                $data = array(
                    'test_token' => $test_token
                );
            }
            else{
                $validators = array(
                    'test_token' => array(
                        'NotEmpty',
                        'messages' => array(
                            '0' => 'El token del test es obligatorio'
                        )
                    ),
                    'profile_token' => array(
                        'NotEmpty',
                        'messages' => array(
                            '0' => 'El token del perfil es obligatorio'
                        )
                    )
                );

                $data = array(
                    'test_token' => $test_token,
                    'profile_token' => $profile_token
                );
            }
            

            $input = new Zend_Filter_Input($filters, $validators, $data);

            if($input->isValid()){
                $ability = 0;
                $limite_inferior_items = 5;
                $test = $this->_em->getRepository('Application_Model_Tests')->findBy(array('token' => $input->test_token));
                $categoria = $test[0]->getCategoria();
                $debug = true;
                if($this->_auth->hasIdentity()){
                    $identity = $this->_auth->getIdentity();
                    $dql = 'select u,p,r from Application_Model_Users u join u.perfil p left join p.respuestas r where u.id = :idusuario';
                    $query = $this->_em->createQuery($dql);
                    $query->setParameter('idusuario', $identity['id']);
                    $user = $query->getResult();
                    $perfil = $user[0]->getPerfil();
                }
                else{
                    $_perfil = $this->_em->getRepository('Application_Model_PerfilEstudiante')->findBy(array('token' => $input->profile_token));
                    $perfil = $_perfil[0]; 
                }
                
                if($perfil != null){
                    //numero de preguntas contestadas en el test
                    $num_items_resueltos = 0;
                    foreach($perfil->getRespuestas() as $respuesta){
                        if($respuesta->getTest()->getId() == $test[0]->getId()){
                            $num_items_resueltos++;
                        }
                    }
                    
                    //criterio de parada
                    $parar_test = false;
                    $test_finalizado = false;
                    $tipo_criterio_parada = $test[0]->getTipo_criterio_parada();
                    $criterio_parada = $test[0]->getCriterio_parada();

                    $categorias = $perfil->getNivelesCategorias();
                    if($categorias->count() > 0){
                        foreach($categorias as $_categoria){
                            if($_categoria->getCategoria()->getId() == $categoria->getId()){
                                $ability = $_categoria->getAbility();
                            }
                        }
                    }
                    $next_item_array = array();
                    
                     //verificar si el test ha finalizado
                    foreach($perfil->getTestsFinalizados() as $testfinalizado){
                        if($testfinalizado->getTest()->getId() == $test[0]->getId()){
                            $test_finalizado = true;
                        }
                    }
                    
                    if($test_finalizado){
                        $next_item_array['test_status'] = -1;
                        $next_item_array['ability_final'] = $ability;
                        $next_item_array['ability_final_txt'] = Application_Model_Tests::ability($ability).' ('.$ability.')';
                        $next_item_array['num_items_resueltos'] = $num_items_resueltos;
                        echo Zend_Json::encode($next_item_array);
                    }
                    else{
                        //suponiendo que al recibir una respuesta se almacena en el perfil del estudiante
                        if($num_items_resueltos >= $limite_inferior_items && $tipo_criterio_parada == Application_Model_Tests::CRITERIO_NUM_ITEMS){
                            if($num_items_resueltos == $criterio_parada){
                                $parar_test = true;
                                $next_item_array['motivo'] = 'Criterio de parada alcanzado: '.$num_items_resueltos.' items administrados';
                            }

                        }
                        //suponiendo que al recibir una respuesta se actualiza el nivel de conocimiento para la categoria
                        if($num_items_resueltos >= $limite_inferior_items && $tipo_criterio_parada == Application_Model_Tests::CRITERIO_NIVEL_CONOCIMIENTO){
                            if($ability >= $criterio_parada){
                                $parar_test = true;      
                                $next_item_array['motivo'] = 'Criterio de parada alcanzado: '.$ability.' mayor o igual que '.$criterio_parada;
                            }
                        }

                        if(!$parar_test){
                            //obtener preguntas no contestadas en el test actual
                            
                            $categorias = $this->_em->getRepository('Application_model_Categorias')->findBy(array('padre' => $categoria));
                            $categorias[] = $categoria;
                            $_items = $this->_em->getRepository('Application_Model_Items')->findBy(array('categoria' => $categorias));
//                            $_items = "select i from Application_Model_Items i join i.categoria c where c.id = :idcategoria or i."
                            $items = array();
                            foreach($_items as $_item){
                                if(!$_item->isRespondida($perfil, $_item->getId() ,$test[0]->getId())){
                                    $items[] = $_item;
                                }
                            }

                            //preparar items para maximum information...
                            $prep_items = Application_Model_Tests::prepararItems($items, $perfil, $test);
                            //obtener siguiente item
                            $_next_item = Application_Model_Tests::MaximumInformationItem($ability, $prep_items, $debug);

                            if($debug){
                                $next_item_array['debug'] = $_next_item['debug']; 
                                $next_item_array['debug']['ability'] = $ability;
                            }
                            if($_next_item['item']['id'] != null){
                                $next_item_array['test_status'] = 0;
                                $next_item = $this->_em->getRepository('Application_Model_Items')->find($_next_item['item']['id']);
                                $next_item_array['enunciado'] = html_entity_decode($next_item->getEnunciado());
                                $next_item_array['id'] = html_entity_decode($next_item->getId());
                                $next_item_array['complejidad'] = $next_item->getComplejidad();

                                foreach($next_item->getOpciones() as $opcion){
                                    $tmp = array();
                                    $tmp['opcion']['enunciado'] = html_entity_decode($opcion->getEnunciado());
                                    $tmp['opcion']['id'] = $opcion->getId();
                                    $next_item_array['opciones'][] = $tmp;
                                    if($debug){
                                        if($opcion->isCorrecta()){
                                            $next_item_array['debug']['correcta'] = html_entity_decode($opcion->getEnunciado());
                                        }
                                    }
                                }
                                echo Zend_Json::encode($next_item_array);
                            }
                            else{
                                //no hay mas ítems!
                                $perfil->getTestsFinalizados()->add(new Application_Model_ResultadosTest($ability, $test[0], $num_items_resueltos, new \Datetime('now')));
                                $this->_em->persist($perfil);
                                $this->_em->flush();
                                $next_item_array['test_status'] = -1;
                                $next_item_array['ability_final'] = $ability;
                                $next_item_array['ability_final_txt'] = Application_Model_Tests::ability($ability).' ('.$ability.')';
                                $next_item_array['num_items_resueltos'] = $num_items_resueltos;
                                $next_item_array['motivo'] = 'No hay más ítems';
                                echo Zend_Json::encode($next_item_array);
                            }
                        }
                        else{
                            //criterio de parada alcanzado
                            $perfil->getTestsFinalizados()->add(new Application_Model_ResultadosTest($ability, $test[0], $num_items_resueltos, new \Datetime('now')));
                            $this->_em->persist($perfil);
                            $this->_em->flush();
                            $next_item_array['test_status'] = -1;
                            $next_item_array['ability_final'] = $ability;
                            $next_item_array['ability_final_txt'] = Application_Model_Tests::ability($ability).' ('.$ability.')';
                            $next_item_array['num_items_resueltos'] = $num_items_resueltos;
                            echo Zend_Json::encode($next_item_array);
                        }
                    }
                } 
            }        
            else{   
                echo Zend_Json::encode($input->getMessages());
            }
//        }
    }
    
    public function postAction() {
//         if($this->_auth->hasIdentity()){
             $test_token = $this->_getParam('test_token');
             $opcion = $this->_getParam('opcion_id');
             $item_id = $this->_getParam('item_id');
             $profile_token = $this->_getParam('profile_token');
             
             $filters = array();
             $validators = array();
             $data = array();

            if($this->_auth->hasIdentity()){
                    $validators = array(
                        'test_token' => array(
                            'NotEmpty',
                            'messages' => array(
                                '0' => 'El token del test es obligatorio'
                            )
                        ),
                        'opcion' => array(
                            'NotEmpty',
                            array('GreaterThan', array('min' => 0)),
                            'messages' => array(
                                '0' => 'La opción es obligatoria',
                                '1' => 'La opción no es válida'
                            )
                        ),
                        'item_id' => array(
                            'NotEmpty',
                            array('GreaterThan', array('min' => 0)),
                            'messages' => array(
                                '0' => 'No se pudo obtener el ítem actual',
                                '1' => 'No se pudo obtener el ítem actual'
                            )
                        )
                    );

                    $data = array(
                        'test_token' => $test_token,
                        'opcion' => $opcion,
                        'item_id' => $item_id
                    );
            } 
            else{
                $validators = array(
                    'test_token' => array(
                        'NotEmpty',
                        'messages' => array(
                            '0' => 'El token del test es obligatorio'
                        )
                    ),
                    'profile_token' => array(
                        'NotEmpty',
                        'messages' => array(
                            '0' => 'El token del perfil es obligatorio'
                        )
                    ),
                    'opcion' => array(
                        'NotEmpty',
                        array('GreaterThan', array('min' => 0)),
                        'messages' => array(
                            '0' => 'La opción es obligatoria',
                            '1' => 'La opción no es válida'
                        )
                    ),
                    'item_id' => array(
                        'NotEmpty',
                        array('GreaterThan', array('min' => 0)),
                        'messages' => array(
                            '0' => 'No se pudo obtener el ítem actual',
                            '1' => 'No se pudo obtener el ítem actual'
                        )
                    )
                );

                $data = array(
                    'test_token' => $test_token,
                    'opcion' => $opcion,
                    'item_id' => $item_id,
                    'profile_token' => $profile_token
                );
            }
            

            $input = new Zend_Filter_Input($filters, $validators, $data);
            
            if($input->isValid()){
                $test = $this->_em->getRepository('Application_Model_Tests')->findBy(array('token' => $input->test_token));
                $categoria = $test[0]->getCategoria();
                $opcion = $this->_em->getRepository('Application_Model_Opciones')->find($input->opcion);
                $item = $this->_em->getRepository('Application_Model_Items')->find($input->item_id);
                if($this->_auth->hasIdentity()){
                    $identity = $this->_auth->getIdentity();
                    $dql = 'select u,p,r from Application_Model_Users u join u.perfil p left join p.respuestas r where u.id = :idusuario';
                    $query = $this->_em->createQuery($dql);
                    $query->setParameter('idusuario', $identity['id']);
                    $user = $query->getResult();
                    $perfil = $user[0]->getPerfil();
                }
                else{
                    $_perfil = $this->_em->getRepository('Application_Model_PerfilEstudiante')->findBy(array('token' => $input->profile_token));
                    $perfil = $_perfil[0]; 
                }
                
                if($perfil != null){
                     //guardar respuesta
                    if(!$item->isRespondida($perfil, $item->getId() ,$test[0]->getId())){
                        $respuesta = new Application_Model_Respuestas();
                        $respuesta->setRespuesta($opcion);
                        $respuesta->setTest($test[0]);
                        $respuesta->setItem($item);
                        $perfil->getRespuestas()->add($respuesta);
                        $this->_em->persist($respuesta);
                        $this->_em->persist($perfil);
                        $this->_em->flush();
                    }
                    else{
                    //ya fue respondida
                    }

                    $respuestas = $perfil->getRespuestas();                
                    $prep_items = Application_Model_Tests::prepararRespuestas($respuestas, $test[0]);

                    $ability = Application_Model_Tests::calcularHabilidad($prep_items);
    
    //                almacenar en perfil  
                    if($ability == null){
                        $ability = 0;
                    }
                    $categorias = $perfil->getNivelesCategorias();
                    if($categorias->count() > 0){
                        foreach($categorias as $_categoria){
                            if($_categoria->getCategoria()->getId() == $categoria->getId()){
                                $_categoria->setAbility($ability);
                            }
                        }

                        $this->_em->persist($perfil);
                        $this->_em->flush();
                    }
                    else{
                        $categorias->add(new Application_Model_NivelCategoria($ability, $categoria));
                        $this->_em->persist($perfil);
                        $this->_em->flush();
                    }
                }
                else{
                    //no se encontro el perfil
                }
            }
//         }
    }
    
    public function deleteAction() {
        
    }
    
    public function headAction() {}
    
    public function putAction() {}
}

