<?php

class ServiciosController extends Zend_Controller_Action
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
        
    }
    
    public function gettemasAction(){
        $tematica = $this->_getParam('tematica');
        $dql = "select t from Application_Model_Temas t join t.tematica tem where tem.idTematica = :tematica";
        $query = $this->_em->createQuery($dql);
        $query->setParameter('tematica', $tematica);
        $temas = $query->getArrayResult();
        echo Zend_Json::encode($temas);
    }
    
    public function getindicadoresAction(){
        $tema = $this->_getParam('tema');
        $dql = "select i from Application_Model_Indicadores i join i.tema_idTema tem where 
            tem.idTema = :tema and i.tipo_grafica in (1,2,3,4) and i.visible=1";
        $query = $this->_em->createQuery($dql);
        $query->setParameter('tema', $tema);
        $indicadores = $query->getArrayResult();
        echo Zend_Json::encode($indicadores);
    }
    
    public function gettoleranciaAction(){
        $params = Zend_Json::decode($this->getRequest()->getRawBody());
        $indicador = $params['indicador'];
        $vista = $params['vista'];
        
         $ciudades = array(
            1 => 'San Andrés',
            2 => 'Providencia y Santa Catalina'
        );
         
         $sexo = array(
             'Masculino', 'Femenino'
         );
        
        $dql_1 = "select i,p,sub
            from Application_Model_Indicadores i join i.pregunta_idPregunta 
            p join p.subpreguntas sub where i.idIndicador = :indicador"; 


        $query_1 = $this->_em->createQuery($dql_1);
        $query_1->setParameter('indicador', $indicador);
        $result_1 = $query_1->getArrayResult(); 
        switch($vista){
            case 'todos':
                foreach($result_1 as $r){
                    foreach($r["pregunta_idPregunta"]["subpreguntas"] as $key=>$sub){
                        foreach($ciudades as $k=>$c){
                            $dql_2 = 'select opr.descripcion as respuesta, sum(res.ponderador) as valor from
                            Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
                            pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
                            join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad group by opr.descripcion';  

                            $query_2 = $this->_em->createQuery($dql_2); 
                            $query_2->setParameter('idsubpregunta', $sub['idsubpregunta']);
                            $query_2->setParameter('indicador', $indicador); 
                            $query_2->setParameter('ciudad', $k);

                            $data = $query_2->getArrayResult();
//                            $r["pregunta_idPregunta"]["subpreguntas"][$key][$k]["subpregunta"] = $sub['idsubpregunta'];
                            $r["pregunta_idPregunta"]["subpreguntas"][$key][$k]["datos"] = $data;
                            $r["pregunta_idPregunta"]["subpreguntas"][$key][$k]["territorio"] = $c;
                            $r["pregunta_idPregunta"]["subpreguntas"][$key][$k]["titulo"] = $sub['descripcion'];
                            $r["pregunta_idPregunta"]["subpreguntas"][$key][$k]["subpregunta"] = $sub['idsubpregunta'];
//                            $r["pregunta_idPregunta"]["subpreguntas"][$key]["territorio"] = $c;

                            $total = 0;
                            foreach($data as $d){
                                $total += $d['valor'];
                            }
                            $r["pregunta_idPregunta"]["subpreguntas"][$key][$k]["total"] = $total;
                            foreach($data as $kd=>$d){
//                                $r["pregunta_idPregunta"]["subpreguntas"][$key][$k]["data"][$kd]["respuesta"] = $r["pregunta_idPregunta"]["subpreguntas"][$key][$k]["data"][$kd]["respuesta"] == null ? 'N/A' : $r["pregunta_idPregunta"]["subpreguntas"][$key][$k]["data"][$kd]["respuesta"]; 
                                $r["pregunta_idPregunta"]["subpreguntas"][$key][$k]["datos"][$kd]["valor"] = ($d["valor"]/$total);
                            }
                        }
                        
                        //nacional
                        $dql_3 = 'select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
                            join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
                            join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta group by opc.descripcion'; 
                        
                        $query_3 = $this->_em->createQuery($dql_3);
                        $query_3->setParameter('idsubpregunta', $sub['idsubpregunta']);
                        $query_3->setParameter('indicador', $indicador); 
                        
                        $data_c = $query_3->getArrayResult();
                        $r["pregunta_idPregunta"]["subpreguntas"][$key][3]["datos"] = $data_c;
                        $r["pregunta_idPregunta"]["subpreguntas"][$key][3]["territorio"] = 'Nacional';
                                                    $r["pregunta_idPregunta"]["subpreguntas"][$key][3]["titulo"] = $sub['descripcion'];

                        $r["pregunta_idPregunta"]["subpreguntas"][$key][3]["subpregunta"] = $sub['idsubpregunta'];
                        foreach($data_c as $kd=>$d){
//                             $r["pregunta_idPregunta"]["subpreguntas"][$key][3]["data"][$kd]["respuesta"] = $r["pregunta_idPregunta"]["subpreguntas"][$key][3]["data"][$kd]["respuesta"] == null ? 'N/A' : $r["pregunta_idPregunta"]["subpreguntas"][$key][3]["data"][$kd]["respuesta"];
                             $r["pregunta_idPregunta"]["subpreguntas"][$key][3]["datos"][$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
                        }
                        

                    }
                }
                break;
            case 'sexo':
                foreach($result_1 as $r){
                    foreach($r["pregunta_idPregunta"]["subpreguntas"] as $key=>$sub){
                        foreach($ciudades as $k=>$c){
                            foreach($sexo as $sk=>$s){
                            $dql_2 = "select opr.descripcion as respuesta, sum(res.ponderador) as valor from
                            Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
                            pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
                            join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad 
                            and res.sexo = '".$s."'
                            group by opr.descripcion";  
                            
//                            var_dump($dql_2);

                            $query_2 = $this->_em->createQuery($dql_2); 
                            $query_2->setParameter('idsubpregunta', $sub['idsubpregunta']);
                            $query_2->setParameter('indicador', $indicador); 
                            $query_2->setParameter('ciudad', $k);

                            $data = $query_2->getArrayResult();
                            $r["pregunta_idPregunta"]["subpreguntas"][$key][$k][$sk]["datos"] = $data;
                            $r["pregunta_idPregunta"]["subpreguntas"][$key][$k][$sk]["territorio"] = $c;
                            $r["pregunta_idPregunta"]["subpreguntas"][$key][$k][$sk]["sexo"] = $s;
                            $r["pregunta_idPregunta"]["subpreguntas"][$key][$k][$sk]["titulo"] = $sub['descripcion'];
                            $r["pregunta_idPregunta"]["subpreguntas"][$key][$k][$sk]["subpregunta"] = $sub['idsubpregunta'];


                            $total = 0;
                            foreach($data as $d){
                                $total += $d['valor'];
                            }
                            $r["pregunta_idPregunta"]["subpreguntas"][$key][$k][$sk]["total"] = $total;
                            foreach($data as $kd=>$d){
                                $r["pregunta_idPregunta"]["subpreguntas"][$key][$k][$sk]["datos"][$kd]["valor"] = ($d["valor"]/$total);
                            }
                          }
                        }
                        //nacional
                        foreach($sexo as $sk=>$s){
                            try{
                                
                            
                        $dql_3 = "select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
                            join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
                            join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and tn.descripcion = '".$s."' group by opc.descripcion";  
                        
                        $query_3 = $this->_em->createQuery($dql_3);
                        $query_3->setParameter('idsubpregunta', $sub['idsubpregunta']);
                        $query_3->setParameter('indicador', $indicador); 
                        
                        $data_c = $query_3->getArrayResult();
                        $r["pregunta_idPregunta"]["subpreguntas"][$key][3][$sk]["datos"] = $data_c;
                        $r["pregunta_idPregunta"]["subpreguntas"][$key][3][$sk]["territorio"] = 'Nacional';
                        $r["pregunta_idPregunta"]["subpreguntas"][$key][3][$sk]["sexo"] = $s;
                        $r["pregunta_idPregunta"]["subpreguntas"][$key][3][$sk]["titulo"] = $sub['descripcion'];

                        $r["pregunta_idPregunta"]["subpreguntas"][$key][3][$sk]["subpregunta"] = $sub['idsubpregunta'];
                        foreach($data_c as $kd=>$d){
                             $r["pregunta_idPregunta"]["subpreguntas"][$key][3][$sk]["datos"][$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
                        }
                        
                        
                        } catch (Exception $ex) {
                            echo $ex->getMessage();
                            }
                    }
                }
                }
                break;
        }
        echo Zend_Json::encode($result_1);
    }
    
    public function getestrellaAction(){
        $params = Zend_Json::decode($this->getRequest()->getRawBody());
        $indicador = $params['indicador'];
        $vista = $params['vista'];
 
        $ciudades = array(
            1 => 'San Andrés',
            2 => 'Providencia y Santa Catalina'
        );
        
        $grupos_edades = array(
            0 => 'Menor a 18',
            1 => 'Entre 18 y 25 a&ntilde;os',
            2 => 'Entre 26 y 35 a&ntilde;os',
            3 => 'Entre 36 y 45 a&ntilde;os',
            4 => 'Entre 46 y 55 a&ntilde;os',
            5 => 'Mayores a 55 a&ntilde;os'
        );
        
        $grupos_edades_nal = array(
            0 => 'Menor a 18',
            1 => '18-25',
            2 => '26-35',
            3 => '36-45',
            4 => '46-55',
            5 => 'Mayor a 55'
        );
        
        $dql_1 = "select i,p,sub
            from Application_Model_Indicadores i join i.pregunta_idPregunta 
            p join p.subpreguntas sub where i.idIndicador = :indicador"; 


        $query_1 = $this->_em->createQuery($dql_1);
        $query_1->setParameter('indicador', $indicador);
        $result_1 = $query_1->getArrayResult(); 
        
        switch($vista){
            case 'todos':
                foreach($result_1 as $r){
                    foreach($r["pregunta_idPregunta"]["subpreguntas"] as $key=>$sub){
                        foreach($ciudades as $k=>$c){
                            $dql_2 = 'select opr.descripcion as respuesta, sum(res.ponderador) as valor from
                            Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
                            pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
                            join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad group by opr.descripcion';  

                            $query_2 = $this->_em->createQuery($dql_2); 
                            $query_2->setParameter('idsubpregunta', $sub['idsubpregunta']);
                            $query_2->setParameter('indicador', $indicador); 
                            $query_2->setParameter('ciudad', $k);

                            $data = $query_2->getArrayResult();
                            $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["data"] = $data;

                            $total = 0;
                            foreach($data as $d){
                                $total += $d['valor'];
                            }
                            $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["total"] = $total;
                            foreach($data as $kd=>$d){
                                 $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["data"][$kd]["valor"] = ($d["valor"]/$total);
                            }
                        }
                        
                        //nacional
                        $dql_3 = 'select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
                            join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
                            join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta group by opc.descripcion'; 
                        
                        $query_3 = $this->_em->createQuery($dql_3);
                        $query_3->setParameter('idsubpregunta', $sub['idsubpregunta']);
                        $query_3->setParameter('indicador', $indicador); 
                        
                        $data_c = $query_3->getArrayResult();
                        $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3]["data"] = $data_c;
                        foreach($data_c as $kd=>$d){
                             $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3]["data"][$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
                        }
                        

                    }
                }
                break;
            case 'sexo':
                $sexo = $params['sexo'];                
                foreach($result_1 as $r){
                    foreach($r["pregunta_idPregunta"]["subpreguntas"] as $key=>$sub){
                        foreach($ciudades as $k=>$c){
                            if($sexo !== 'Todos'){
                            $dql_2 = "select opr.descripcion as respuesta, sum(res.ponderador) 
                                as valor from Application_Model_Indicadores ind 
                                join ind.pregunta_idPregunta pre join pre.subpreguntas sub 
                                join sub.respuestas res join sub.escala_idEscala esc 
                                join res.cod_respuesta opr join res.ciudad_idciudad ciu 
                                where ind.idIndicador = :indicador and sub.idsubpregunta=:idsubpregunta 
                                and ciu.idciudad=:ciudad and res.sexo like '".$sexo."'
                                group by opr.descripcion"; 
                            
                                
                            }
                            else{
                                $dql_2 = "select opr.descripcion as respuesta, sum(res.ponderador) 
                                as valor from Application_Model_Indicadores ind 
                                join ind.pregunta_idPregunta pre join pre.subpreguntas sub 
                                join sub.respuestas res join sub.escala_idEscala esc 
                                join res.cod_respuesta opr join res.ciudad_idciudad ciu 
                                where ind.idIndicador = :indicador and sub.idsubpregunta=:idsubpregunta 
                                and ciu.idciudad=:ciudad group by opr.descripcion";  
                            }
                            
                            try{
                                $query_2 = $this->_em->createQuery($dql_2); 
                                $query_2->setParameter('idsubpregunta', $sub['idsubpregunta']);
                                $query_2->setParameter('indicador', $indicador); 
                                $query_2->setParameter('ciudad', $k);
//                                $query_2->setParameter('sexo', $sexo);
//                                echo $query_2->getSQL();
                                $data = $query_2->getArrayResult();
                                
                                $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["data"] = $data;

                                $total = 0;
                                foreach($data as $d){
                                    $total += $d['valor'];
                                }
                                $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["total"] = $total;
                                foreach($data as $kd=>$d){
                                     $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["data"][$kd]["valor"] = ($d["valor"]/$total);
                                }
                                
                                
                                
                            } catch (Exception $ex) {
                                echo $ex->getMessage();
                            }
                            
                            
                        }
                        
                        if($sexo != 'Todos'){
                            $dql_3 = "select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
                                join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
                                join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
                                and sub.idsubpregunta=:idsubpregunta and tn.descripcion='".$sexo."' group by opc.descripcion"; 
//                            var_dump($dql_3);
                        }
                        else{
                            $dql_3 = 'select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
                            join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
                            join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta group by opc.descripcion'; 
                        }
                        
                        $query_3 = $this->_em->createQuery($dql_3);
                        $query_3->setParameter('idsubpregunta', $sub['idsubpregunta']);
                        $query_3->setParameter('indicador', $indicador); 

                        $data_c = $query_3->getArrayResult();
                        $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3]["data"] = $data_c;
                        foreach($data_c as $kd=>$d){
                             $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3]["data"][$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
                        }

                    }
                }
                break;
            case 'edades':
                foreach($result_1 as $r){
                    foreach($r["pregunta_idPregunta"]["subpreguntas"] as $key=>$sub){
                        foreach($ciudades as $k=>$c){
                            foreach($grupos_edades as $kge=>$ge){
                            $dql_2 = "select opr.descripcion as respuesta, sum(res.ponderador) as valor from
                            Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
                            pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
                            join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad and res.edad_cat = '".$ge."' group by opr.descripcion";  

                            $query_2 = $this->_em->createQuery($dql_2); 
                            $query_2->setParameter('idsubpregunta', $sub['idsubpregunta']);
                            $query_2->setParameter('indicador', $indicador); 
                            $query_2->setParameter('ciudad', $k);

                            $data = $query_2->getArrayResult();
                            $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k][$kge]["data"] = $data;

                            $total = 0;
                            foreach($data as $d){
                                $total += $d['valor'];
                            }
                            $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k][$kge]["total"] = $total;
                            foreach($data as $kd=>$d){
                                 $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k][$kge]["data"][$kd]["valor"] = ($d["valor"]/$total);
                            }
                        }
                        
                            }
                            
                            //nacional
                        foreach($grupos_edades as $kge=>$ge){
                        $dql_3 = "select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
                            join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
                            join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and tn.descripcion = '".$grupos_edades_nal[$kge]."' group by opc.descripcion"; 
                        
                        
                            $query_3 = $this->_em->createQuery($dql_3);
                            $query_3->setParameter('idsubpregunta', $sub['idsubpregunta']);
                            $query_3->setParameter('indicador', $indicador); 

                            $data_c = $query_3->getArrayResult();
                            $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3][$kge]["data"] = $data_c;
                            foreach($data_c as $kd=>$d){
                                 $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3][$kge]["data"][$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
                            }
                        }
                    }
                }
                break;
        }
        

       echo Zend_Json::encode($result_1);
        
                
    }
    
    public function getlineaAction(){
        try{          
        $params = Zend_Json::decode($this->getRequest()->getRawBody());
        $indicador = $params['indicador'];
        $vista = $params['vista'];
        
        $sexo = array('Masculino', 'Femenino');
        
        switch($vista){
            case 'Sexo':      
                $datos = array();
                foreach($sexo as $s){
                    $dql = "select i.idIndicador as indicador, ciu.ciudadcol as territorio, ml.anno as fecha, ml.total as valor, ml.descripcion as sexo from Application_Model_Medicinalegal ml join ml.indicador_idindicador i join
                    ml.ciudad_idciudad ciu where i.idIndicador = :indicador and
                    ml.descripcion = '".$s."'";

                    $query = $this->_em->createQuery($dql);

                    $query->setParameter('indicador', $indicador); 
                    $data = $query->getArrayResult();
                    $datos[] = $data;
                }
                $data = $datos;
                $arr = array();
                foreach($data as $d){
                    foreach($d as $dat){                        
                        $arr[] = $dat;
                    }
                }
                $data = $arr;
                break;
            default:
                $dql = "select i.idIndicador as indicador, ciu.ciudadcol as territorio, ml.anno as fecha, ml.total as valor from Application_Model_Medicinalegal ml join ml.indicador_idindicador i join
                ml.ciudad_idciudad ciu where i.idIndicador = :indicador and
                ml.descripcion = '".$vista."'";

                $query = $this->_em->createQuery($dql);

                $query->setParameter('indicador', $indicador); 
                $data = $query->getArrayResult();
        
                break;
        }
        
        echo Zend_Json::encode($data);
        } catch (Exception $ex) {
            echo $ex->getMessage();
        }
    }
    
    public function getmultipleAction(){
//        $tipografico = 'estrella';
//        $vista = 'general';
//        $subpregunta = 0;
//        $indicador = 25;
//        
        $params = Zend_Json::decode($this->getRequest()->getRawBody());
        $tipografico = $params['tipografico'];
        $vista = $params['vista'];
        $subpregunta = $params['subpregunta'];
        $indicador = $params['indicador'];
//        $hasdata = true;
//        $sexo = $params['sexo'];
        
        $ciudades = array(
            1 => 'San Andres',
            2 => 'Providencia'
//            3 => 'Nacional'
        );
        
        $generos = array(
            1 => 'Masculino',
            2 => 'Femenino'
        );
        

        $edades = array(
            'Menor a 18',
            'Entre 18 y 25 a&ntilde;os',
            'Entre 26 y 35 a&ntilde;os',
            'Entre 36 y 45 a&ntilde;os',
            'Entre 46 y 55 a&ntilde;os',
            'Mayores a 55 a&ntilde;os',
        );
        
        $edades_r = array(
            '-18',
            '18-25',
            '26-35',
            '36-45',
            '46-55',
            '+55'
        );
        
        $edades_s = array(
            'Menor a 18'=>  '-18',
            'Entre 18 y 25 a&ntilde;os' => '18-25',
            'Entre 26 y 35 a&ntilde;os' => '26-35',
            'Entre 36 y 45 a&ntilde;os' => '36-45',
            'Entre 46 y 55 a&ntilde;os' => '46-55',
            'Mayores a 55 a&ntilde;os' => '+55'
        );
       
        $edades_tn = array(
            'Menor a 18',
            '18-25',
            '26-35',
            '36-45',
            '46-55',
            'Mayor a 55'
        );
       
        
        $json = array();
        
         $dql_1 = "select i,p,sub
            from Application_Model_Indicadores i join i.pregunta_idPregunta 
            p join p.subpreguntas sub where i.idIndicador = :indicador"; 


        $query_1 = $this->_em->createQuery($dql_1);
        $query_1->setParameter('indicador', $indicador);
        $result_1 = $query_1->getArrayResult(); 
        
//        var_dump($result_1);
        //general, edad y sexo tienen formatos distintos
        //estrella muy similar a tolerancia
        //linea es diferente
        switch($tipografico){
            case 'estrella':
                switch($vista){
                    case 'general':
                        if(!($subpregunta > 0)){
                            $subpregunta = $result_1[0]['pregunta_idPregunta']['subpreguntas'][0]['idsubpregunta'];
//                            var_dump($subpregunta);
                            
                        }
                        foreach($ciudades as $k=>$c){
                            $tmp = array();
                            $tmp['indicador'] = $result_1[0]['idIndicador'];
                            $tmp['territorio'] = $c;
                            $tmp['subpregunta'] = $subpregunta;
//                            
                            $dql_2 = 'select opr.descripcion as respuesta, sum(res.ponderador) as valor from
                            Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
                            pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
                            join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad group by opr.descripcion';  
//                            
//                            var_dump($subpregunta);
                            $query_2 = $this->_em->createQuery($dql_2); 
                            $query_2->setParameter('idsubpregunta', $subpregunta);
                            $query_2->setParameter('indicador', $indicador); 
                            $query_2->setParameter('ciudad', $k);

                            $data = $query_2->getArrayResult();
                            
                            $total = 0;
                            foreach($data as $d){
                                $total += $d['valor'];
                            }
//                            $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["total"] = $total;
                            foreach($data as $kd=>$d){
                                 $data[$kd]["valor"] = ($d["valor"]/$total);
                            }
                            
                            $tmp['datos'] = $data;
                            
                            $json[] = $tmp;
                        }
                        
                        //nacional
                        $tmp = array();
                        $tmp['indicador'] = $result_1[0]['idIndicador'];
                        $tmp['territorio'] = 'Nacional';
                        
                        $hasdata = true;
                        
                        
                        $dql_3 = "select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
                            join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
                            join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and tn.descripcion = 'Nacional' group by opc.descripcion"; 
                        
                        $query_3 = $this->_em->createQuery($dql_3);
                        $query_3->setParameter('idsubpregunta', $subpregunta);
                        $query_3->setParameter('indicador', $indicador); 
                        
                        $data_c = $query_3->getArrayResult();
//                        var_dump($data_c);
//                        $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3]["data"] = $data_c;
                        foreach($data_c as $kd=>$d){
                            $data_c[$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
                            if($data_c[$kd]["valor"] == 0){
                                $hasdata = false;
                            }
                             
//                             var_dump($data_c[$kd]["valor"]);
//                             var_dump($data_c[$kd]["valor"] == 0);
                        }
                        
                        if($hasdata){
                            $tmp['datos'] = $data_c;
                        }
                        
                        $json[] = $tmp;
                        
                        break;
                    case 'sexo':
                        if(!($subpregunta > 0)){
                            $subpregunta = $result_1[0]['pregunta_idPregunta']['subpreguntas'][0]['idsubpregunta'];
                            
                        }
                        foreach($ciudades as $k=>$c){
//                            echo $c;
                            foreach($generos as $g){                                
                                $tmp = array();
                                $tmp['indicador'] = $result_1[0]['idIndicador'];
                                $tmp['territorio'] = $c;
                                $tmp['sexo'] = $g;

    //                            
                                $dql_2 = sprintf("select opr.descripcion as respuesta, sum(res.ponderador) as valor from
                                Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
                                pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
                                join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
                                and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad and res.sexo = '%s' group by opr.descripcion", $g);  


                                $query_2 = $this->_em->createQuery($dql_2); 
                                $query_2->setParameter('idsubpregunta', $subpregunta);
                                $query_2->setParameter('indicador', $indicador); 
                                $query_2->setParameter('ciudad', $k);

                                $data = $query_2->getArrayResult();

                                $total = 0;
                                foreach($data as $d){
                                    $total += $d['valor'];
                                }
    //                            $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["total"] = $total;
                                foreach($data as $kd=>$d){
                                     $data[$kd]["valor"] = ($d["valor"]/$total);
                                }
                                
                                $tmp['datos'] = $data;

                                $json[] = $tmp;
                            }
                        }
                        //nacional
                        foreach($generos as $g){
                        $tmp = array();
                        $tmp['indicador'] = $result_1[0]['idIndicador'];
                        $tmp['territorio'] = 'Nacional';
                        $tmp['sexo'] = $g;
                        
                        $hasdata = true;
                        
                        $dql_3 = sprintf("select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
                            join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
                            join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and tn.descripcion = '%s' group by opc.descripcion", $g); 
//                        
                        $query_3 = $this->_em->createQuery($dql_3);
                        $query_3->setParameter('idsubpregunta', $subpregunta);
                        $query_3->setParameter('indicador', $indicador); 
//                        
                        $data_c = $query_3->getArrayResult();
//                        var_dump($data_c);
//                        $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3]["data"] = $data_c;
                        foreach($data_c as $kd=>$d){
                            $data_c[$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
                            if($data_c[$kd]["valor"] == 0){
                                $hasdata = false;
                            }
                             
                        }
                        if($hasdata){
                             $tmp['datos'] = $data_c;
                        }  
                       
                        $json[] = $tmp;
                        }
                        break;
                    case 'edad':
                        if(!($subpregunta > 0)){
                            $subpregunta = $result_1[0]['pregunta_idPregunta']['subpreguntas'][0]['idsubpregunta'];
                            
                        }
                        foreach($ciudades as $k=>$c){
//                            echo $c;
                            foreach($edades as $ke=>$e){                                
                                $tmp = array();
                                $tmp['indicador'] = $result_1[0]['idIndicador'];
                                $tmp['territorio'] = $c;
                                $tmp['edad'] = $edades_r[$ke];

    //                            
                                $dql_2 = sprintf("select opr.descripcion as respuesta, sum(res.ponderador) as valor from
                                Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
                                pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
                                join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
                                and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad and res.edad_cat = '%s' group by opr.descripcion", $e);  


                                $query_2 = $this->_em->createQuery($dql_2); 
                                $query_2->setParameter('idsubpregunta', $subpregunta);
                                $query_2->setParameter('indicador', $indicador); 
                                $query_2->setParameter('ciudad', $k);

                                $data = $query_2->getArrayResult();

                                $total = 0;
                                foreach($data as $d){
                                    $total += $d['valor'];
                                }
    //                            $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["total"] = $total;
                                foreach($data as $kd=>$d){
                                     $data[$kd]["valor"] = ($d["valor"]/$total);
                                }

                                $tmp['datos'] = $data;

                                $json[] = $tmp;
                            }
                        }
                        //nacional
                        foreach($edades as $ke=>$e){
                        $tmp = array();
                        $tmp['indicador'] = $result_1[0]['idIndicador'];
                        $tmp['territorio'] = 'Nacional';
                        $tmp['edad'] = $edades_r[$ke];
                        $hasdata = true;
                        
                        $dql_3 = sprintf("select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
                            join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
                            join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and tn.descripcion = '%s' group by opc.descripcion", $edades_tn[$ke]); 
//                        
                        $query_3 = $this->_em->createQuery($dql_3);
                        $query_3->setParameter('idsubpregunta', $subpregunta);
                        $query_3->setParameter('indicador', $indicador); 
//                        
                        $data_c = $query_3->getArrayResult();
//                        $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3]["data"] = $data_c;
                        foreach($data_c as $kd=>$d){
                            $data_c[$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
                            if($data_c[$kd]["valor"] == 0){
                                $hasdata = false;
                            }
                             
                        }
                        if($hasdata){
                             $tmp['datos'] = $data_c;
                        }  
                       
                        $json[] = $tmp;
                        }
                        break;
                
                }
                break;
            case 'tolerancia':
                switch($vista){
                    case 'general':
                        if(!($subpregunta > 0)){
                            $subpregunta = $result_1[0]['pregunta_idPregunta']['subpreguntas'][0]['idsubpregunta'];
//                            var_dump($subpregunta);
                            
                        }
                        foreach($ciudades as $k=>$c){
                            $tmp = array();
                            $tmp['indicador'] = $result_1[0]['idIndicador'];
                            $tmp['territorio'] = $c;
                            $tmp['subpregunta'] = $subpregunta;
//                            
                            $dql_2 = 'select opr.descripcion as respuesta, sum(res.ponderador) as valor from
                            Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
                            pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
                            join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad group by opr.descripcion';  
//                            
                            
                            $query_2 = $this->_em->createQuery($dql_2); 
                            $query_2->setParameter('idsubpregunta', $subpregunta);
                            $query_2->setParameter('indicador', $indicador); 
                            $query_2->setParameter('ciudad', $k);

                            $data = $query_2->getArrayResult();
                            
                            $total = 0;
                            foreach($data as $d){
                                $total += $d['valor'];
                            }
//                            $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["total"] = $total;
                            foreach($data as $kd=>$d){
                                 $data[$kd]["valor"] = ($d["valor"]/$total);
                            }
                            
                            $tmp['datos'] = $data;
                            
                            $json[] = $tmp;
                        }
                        
                        //nacional
                        $tmp = array();
                        $tmp['indicador'] = $result_1[0]['idIndicador'];
                        $tmp['territorio'] = 'Nacional';
                        
                        
                        $dql_3 = 'select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
                            join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
                            join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta group by opc.descripcion'; 
                        
                        $query_3 = $this->_em->createQuery($dql_3);
                        $query_3->setParameter('idsubpregunta', $subpregunta);
                        $query_3->setParameter('indicador', $indicador); 
                        
                        $data_c = $query_3->getArrayResult();
//                        $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3]["data"] = $data_c;
                        foreach($data_c as $kd=>$d){
                             $data_c[$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
                        }
                        
                        $tmp['datos'] = $data_c;
                        $json[] = $tmp;
                        
                        break;
                        case 'sexo':
                        if(!($subpregunta > 0)){
                            $subpregunta = $result_1[0]['pregunta_idPregunta']['subpreguntas'][0]['idsubpregunta'];
                            
                        }
                        foreach($ciudades as $k=>$c){
//                            echo $c;
                            foreach($generos as $g){                                
                                $tmp = array();
                                $tmp['indicador'] = $result_1[0]['idIndicador'];
                                $tmp['territorio'] = $c;
                                $tmp['sexo'] = $g;

    //                            
                                $dql_2 = sprintf("select opr.descripcion as respuesta, sum(res.ponderador) as valor from
                                Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
                                pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
                                join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
                                and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad and res.sexo = '%s' group by opr.descripcion", $g);  


                                $query_2 = $this->_em->createQuery($dql_2); 
                                $query_2->setParameter('idsubpregunta', $subpregunta);
                                $query_2->setParameter('indicador', $indicador); 
                                $query_2->setParameter('ciudad', $k);

                                $data = $query_2->getArrayResult();

                                $total = 0;
                                foreach($data as $d){
                                    $total += $d['valor'];
                                }
    //                            $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["total"] = $total;
                                foreach($data as $kd=>$d){
                                     $data[$kd]["valor"] = ($d["valor"]/$total);
                                }

                                $tmp['datos'] = $data;

                                $json[] = $tmp;
                            }
                        }
                        //nacional
                        foreach($generos as $g){
                        $tmp = array();
                        $tmp['indicador'] = $result_1[0]['idIndicador'];
                        $tmp['territorio'] = 'Nacional';
                        $tmp['sexo'] = $g;
                        
                        
                        $dql_3 = sprintf("select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
                            join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
                            join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and tn.descripcion = '%s' group by opc.descripcion", $g); 
//                        
                        $query_3 = $this->_em->createQuery($dql_3);
                        $query_3->setParameter('idsubpregunta', $subpregunta);
                        $query_3->setParameter('indicador', $indicador); 
//                        
                        $data_c = $query_3->getArrayResult();
//                        $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3]["data"] = $data_c;
                        foreach($data_c as $kd=>$d){
                             $data_c[$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
                        }
//                        
                        $tmp['datos'] = $data_c;
                        $json[] = $tmp;
                        }
                        break;
                        case 'edad':
                        if(!($subpregunta > 0)){
                            $subpregunta = $result_1[0]['pregunta_idPregunta']['subpreguntas'][0]['idsubpregunta'];
                            
                        }
                        foreach($ciudades as $k=>$c){
//                            echo $c;
                            foreach($edades as $ke=>$e){                                
                                $tmp = array();
                                $tmp['indicador'] = $result_1[0]['idIndicador'];
                                $tmp['territorio'] = $c;
                                $tmp['edad'] = $edades_r[$ke];

    //                            
                                $dql_2 = sprintf("select opr.descripcion as respuesta, sum(res.ponderador) as valor from
                                Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
                                pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
                                join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
                                and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad and res.edad_cat = '%s' group by opr.descripcion", $e);  


                                $query_2 = $this->_em->createQuery($dql_2); 
                                $query_2->setParameter('idsubpregunta', $subpregunta);
                                $query_2->setParameter('indicador', $indicador); 
                                $query_2->setParameter('ciudad', $k);

                                $data = $query_2->getArrayResult();

                                $total = 0;
                                foreach($data as $d){
                                    $total += $d['valor'];
                                }
    //                            $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["total"] = $total;
                                foreach($data as $kd=>$d){
                                     $data[$kd]["valor"] = ($d["valor"]/$total);
                                }

                                $tmp['datos'] = $data;

                                $json[] = $tmp;
                            }
                        }
                        //nacional
                        foreach($edades as $ke=>$e){
                        $tmp = array();
                        $tmp['indicador'] = $result_1[0]['idIndicador'];
                        $tmp['territorio'] = 'Nacional';
                        $tmp['edad'] = $edades_r[$ke];
                        
                        
                        $dql_3 = sprintf("select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
                            join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
                            join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and tn.descripcion = '%s' group by opc.descripcion", $edades_tn[$ke]); 
//                        
                        $query_3 = $this->_em->createQuery($dql_3);
                        $query_3->setParameter('idsubpregunta', $subpregunta);
                        $query_3->setParameter('indicador', $indicador); 
//                        
                        $data_c = $query_3->getArrayResult();
//                        $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3]["data"] = $data_c;
                        foreach($data_c as $kd=>$d){
                             $data_c[$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
                        }
//                        
                        $tmp['datos'] = $data_c;
                        $json[] = $tmp;
                        }
                        break;
                }
                break;
            case 'linea':
                $descripcion_opt = array(
                    1 => 'General',
                    2 => 'Masculino',
                    3 => 'Femenino',
                    4 => 'Tasa Homicidio'
                );
                switch($vista){
                    case 'general':
                        if($indicador == 38){
                            //lesiones personales
                            foreach($ciudades as $k=>$c){
                                
                           
                            $dql = "select i.idIndicador as indicador, c.ciudadcol as territorio, SUBSTRING(pn.fecha, 1, 4) as fecha, count(pn.idpolicia_nacional) as valor from Application_Model_Policianacional pn join 
                                pn.ciudad_idciudad c join pn.indicador_idIndicador i
                                where c.idciudad = :ciudad and i.idIndicador = :indicador group by i.idIndicador,territorio,fecha";
                            
                            $query = $this->_em->createQuery($dql);

                            $query->setParameter('indicador', $indicador); 
                            $query->setParameter('ciudad', $k); 
                            $data = $query->getArrayResult();
                            
                            foreach($data as $d){
//                                $d['fecha'] = explode('-', $d['fecha']);
//                                $d['fecha'] = $d['fecha'][0];
                                $json[] = $d;
                                
                            }
                            
                          }
                          
                           $dql = "select i.idIndicador as indicador, c.ciudadcol as territorio, SUBSTRING(pn.fecha, 1, 4) as fecha, count(pn.idpolicia_nacional) as valor from Application_Model_Policianacional pn join 
                                pn.ciudad_idciudad c join pn.indicador_idIndicador i
                                where c.idciudad = :ciudad and i.idIndicador = :indicador group by i.idIndicador,territorio,fecha";
                            
                            $query = $this->_em->createQuery($dql);

                            $query->setParameter('indicador', $indicador); 
                            $query->setParameter('ciudad', 3); 
                            $data = $query->getArrayResult();
                            
                            foreach($data as $d){
//                                $d['fecha'] = explode('-', $d['fecha']);
//                                $d['fecha'] = $d['fecha'][0];
                                $json[] = $d;
                                
                            }

                        }
                        else{
                            $dql = sprintf("select i.idIndicador as indicador, ciu.ciudadcol as territorio, ml.anno as fecha, ml.total as valor from Application_Model_Medicinalegal ml join ml.indicador_idindicador i join
                            ml.ciudad_idciudad ciu where i.idIndicador = :indicador and
                            ml.descripcion = '%s'", $descripcion_opt[1]);

                            $query = $this->_em->createQuery($dql);

                            $query->setParameter('indicador', $indicador); 
                            $data = $query->getArrayResult();
                            $json = $data;
                        }
                        
                        break;
                    case 'sexo':
                        if($indicador == 38){
                            //lesiones personales
                            foreach($ciudades as $k=>$c){
                                foreach($generos as $g){
                           
                            $dql = sprintf("select i.idIndicador as indicador, pn.sexo, c.ciudadcol as territorio, SUBSTRING(pn.fecha, 1, 4) as fecha, count(pn.idpolicia_nacional) as valor from Application_Model_Policianacional pn join 
                                pn.ciudad_idciudad c join pn.indicador_idIndicador i
                                where c.idciudad = :ciudad and i.idIndicador = :indicador and pn.sexo = '%s' group by i.idIndicador,territorio,fecha", strtoupper($g));
                            
                            $query = $this->_em->createQuery($dql);

                            $query->setParameter('indicador', $indicador); 
                            $query->setParameter('ciudad', $k); 
                            $data = $query->getArrayResult();
                            
                            foreach($data as $d){
//                                $d['fecha'] = explode('-', $d['fecha']);
//                                $d['fecha'] = $d['fecha'][0];
                                $json[] = $d;
                                
                            }
                            }
                          }
                          foreach($generos as $g){
                           $dql = sprintf("select i.idIndicador as indicador, pn.sexo, c.ciudadcol as territorio, SUBSTRING(pn.fecha, 1, 4) as fecha, count(pn.idpolicia_nacional) as valor from Application_Model_Policianacional pn join 
                                pn.ciudad_idciudad c join pn.indicador_idIndicador i
                                where c.idciudad = :ciudad and i.idIndicador = :indicador and pn.sexo = '%s' group by i.idIndicador,territorio,fecha", strtoupper($g));
                            
                            $query = $this->_em->createQuery($dql);

                            $query->setParameter('indicador', $indicador); 
                            $query->setParameter('ciudad', 3); 
                            $data = $query->getArrayResult();
                            
                            foreach($data as $d){
                                $json[] = $d;
                                
                            }
                          }
                        }
                        else{
                            foreach($generos as $g){                         
//                        echo $g;
                                $dql = sprintf("select i.idIndicador as indicador, ml.descripcion as sexo, ciu.ciudadcol as territorio, ml.anno as fecha, ml.total as valor from Application_Model_Medicinalegal ml join ml.indicador_idindicador i join
                                ml.ciudad_idciudad ciu where i.idIndicador = :indicador and
                                ml.descripcion = '%s'", $g);

                                $query = $this->_em->createQuery($dql);

                                $query->setParameter('indicador', $indicador); 
                                $data = $query->getArrayResult();

                                foreach($data as $d){
                                    $json[] = $d;
                                }

                        
  
                            }
                        }
                        
                        break;
                    case 'edad':
                        if($indicador == 38){
                            //lesiones personales
                            foreach($ciudades as $k=>$c){
                                foreach($edades as $e){
                           
                            $dql = sprintf("select i.idIndicador as indicador, pn.grupo_edad as edad, c.ciudadcol as territorio, SUBSTRING(pn.fecha, 1, 4) as fecha, count(pn.idpolicia_nacional) as valor from Application_Model_Policianacional pn join 
                                pn.ciudad_idciudad c join pn.indicador_idIndicador i
                                where c.idciudad = :ciudad and i.idIndicador = :indicador and pn.grupo_edad = '%s' group by i.idIndicador,territorio,fecha", $e);
                            
                            $query = $this->_em->createQuery($dql);

                            $query->setParameter('indicador', $indicador); 
                            $query->setParameter('ciudad', $k); 
                            $data = $query->getArrayResult();
                            
                            foreach($data as $d){
                                $d['edad'] = $edades_s[$d['edad']];
//                                foreach($edades as $idx=>$e){
//                                    if($d['edad'] == $e){
//                                        
//                                    }
//                                }
                                $json[] = $d;
                                
                            }
                            }
                          }
                          foreach($edades as $e){
                           $dql = sprintf("select i.idIndicador as indicador, pn.grupo_edad as edad, c.ciudadcol as territorio, SUBSTRING(pn.fecha, 1, 4) as fecha, count(pn.idpolicia_nacional) as valor from Application_Model_Policianacional pn join 
                                pn.ciudad_idciudad c join pn.indicador_idIndicador i
                                where c.idciudad = :ciudad and i.idIndicador = :indicador and pn.grupo_edad = '%s' group by i.idIndicador,territorio,fecha", $e);
                            
                            $query = $this->_em->createQuery($dql);

                            $query->setParameter('indicador', $indicador); 
                            $query->setParameter('ciudad', 3); 
                            $data = $query->getArrayResult();
                            
                            foreach($data as $d){
                                $d['edad'] = $edades_s[$d['edad']];
                                $json[] = $d;
                                
                            }
                          }
                        }
                        else{
                            foreach($edades as $e){                         
//                        echo $g;
                                $dql = sprintf("select i.idIndicador as indicador, ml.descripcion as sexo, ciu.ciudadcol as territorio, ml.anno as fecha, ml.total as valor from Application_Model_Medicinalegal ml join ml.indicador_idindicador i join
                                ml.ciudad_idciudad ciu where i.idIndicador = :indicador and
                                ml.descripcion = '%s'", $e);

                                $query = $this->_em->createQuery($dql);

                                $query->setParameter('indicador', $indicador); 
                                $data = $query->getArrayResult();

                                foreach($data as $d){
                                    $json[] = $d;
                                }
                            }
                        }
                        
                        break;
                }
                
                break;
            case 'bolas':
                switch($vista){
                    case 'general':
                        if(!($subpregunta > 0)){
                            $subpregunta = $result_1[0]['pregunta_idPregunta']['subpreguntas'][0]['idsubpregunta'];
//                            var_dump($subpregunta);
                            
                        }
                        foreach($ciudades as $k=>$c){
                            $tmp = array();
                            $tmp['indicador'] = $result_1[0]['idIndicador'];
                            $tmp['territorio'] = $c;
                            $tmp['subpregunta'] = $subpregunta;
//                            
                            $dql_2 = 'select opr.descripcion as respuesta, sum(res.ponderador) as valor from
                            Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
                            pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
                            join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad group by opr.descripcion';  
//                            
                            
                            $query_2 = $this->_em->createQuery($dql_2); 
                            $query_2->setParameter('idsubpregunta', $subpregunta);
                            $query_2->setParameter('indicador', $indicador); 
                            $query_2->setParameter('ciudad', $k);

                            $data = $query_2->getArrayResult();
                            
                            $total = 0;
                            foreach($data as $d){
                                $total += $d['valor'];
                            }
//                            $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["total"] = $total;
                            foreach($data as $kd=>$d){
                                 $data[$kd]["valor"] = ($d["valor"]/$total);
                            }
                            
                            $tmp['datos'] = $data;
                            
                            $json[] = $tmp;
                        }
                        
                        //nacional
                        $tmp = array();
                        $tmp['indicador'] = $result_1[0]['idIndicador'];
                        $tmp['territorio'] = 'Nacional';
                        
                        
                        $dql_3 = 'select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
                            join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
                            join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
                            and sub.idsubpregunta=:idsubpregunta group by opc.descripcion'; 
                        
                        $query_3 = $this->_em->createQuery($dql_3);
                        $query_3->setParameter('idsubpregunta', $subpregunta);
                        $query_3->setParameter('indicador', $indicador); 
                        
                        $data_c = $query_3->getArrayResult();
//                        $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3]["data"] = $data_c;
                        foreach($data_c as $kd=>$d){
                             $data_c[$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
                        }
                        
                        $tmp['datos'] = $data_c;
                        $json[] = $tmp;
                        break;
                }
                break;
        }
        echo Zend_Json::encode($json);
    }
    
    
    public function getsubpreguntaidxAction(){
//        var_dump($this->_getAllParams());
        $json = array();
        $indicador = $this->_getParam('indicador');
        $actual = $this->_getParam('actual');
        $direccion = $this->_getParam('direccion');
        $index = 0;
        $dql_1 = "select sub.idsubpregunta, sub.descripcion
            from Application_Model_Indicadores i join i.pregunta_idPregunta 
            p join p.subpreguntas sub where i.idIndicador = :indicador"; 
        
        
        $query_1 = $this->_em->createQuery($dql_1);
        $query_1->setParameter('indicador', $indicador);
        $result_1 = $query_1->getArrayResult();
        
        $total = count($result_1);
        if($direccion == 'siguiente'){
            $index = $actual+1;
            
        }
        else{
            if($direccion == 'anterior'){           
                $index = $actual-1;            
            }
        }
        
        if($index == $total){
            $index = 0;
        }
        if($index < 0){
            $index = $total-1;
        }
        
        $json['index'] = $index;
        $json['total_debug'] = $total;
        $json['actual_debug'] = $actual;
        $json['subpregunta'] = $result_1[$index];
        
        echo Zend_Json::encode($json);
    }
    
    
  

}







