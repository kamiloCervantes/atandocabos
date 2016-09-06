<?php

require_once 'PHPExcel-1.8/Classes/PHPExcel.php';

class ReportesController extends Zend_Controller_Action
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
        date_default_timezone_set('America/Bogota');
       $registry = Zend_Registry::getInstance();
       $this->_em = $registry->entitymanager;
       $this->_helper->viewRenderer->setNoRender();
       $this->_helper->getHelper('layout')->disableLayout();
       header('Content-type: application/json');
    }

    public function indexAction()
    {
        
    }
    
    public function multipleAction(){
        $indicador = $this->_getParam('i');
        $tipo_grafica = $this->_getParam('t');
        $subpregunta = $this->_getParam('s') > 0 ? $this->_getParam('s') : 0;
        switch($tipo_grafica){
            case 'estrella':
                $this->generarEstrella($indicador);
                break;
            case 'tolerancia':
                $this->generarEstrella($indicador);
                break;
            case 'bolas':
                $this->generarEstrella($indicador);
                break;
            case 'linea':
                $this->generarLinea($indicador);
                break;
        }        
    }
   
  
  private function generarLinea($indicador){
       $generos = array(
            1 => 'Masculino',
            2 => 'Femenino'
        );
       
       $edades_r = array(
            '-18',
            '18-25',
            '26-35',
            '36-45',
            '46-55',
            '+55'
        );
      
      $objPHPExcel = PHPExcel_IOFactory::load(APPLICATION_PATH . "/../library/PHPExcel-1.8/templates/linea.xlsx");
      $objPHPExcel->setActiveSheetIndex(0);
      
      $dql_1 = "select i,p
        from Application_Model_Indicadores i join i.pregunta_idPregunta 
        p where i.idIndicador = :indicador"; 


    $query_1 = $this->_em->createQuery($dql_1);
    $query_1->setParameter('indicador', $indicador);
    $result_1 = $query_1->getArrayResult(); 
      
      $objPHPExcel->getActiveSheet()->setCellValue('C2', utf8_encode(html_entity_decode($result_1[0]['nombre_indicador'])));
//      var_dump($result_1);
      $col_ini = 67;
      $json = array();
      $ciudades = array(
        1 => 'San Andrés',
        2 => 'Providencia'
      );
      $descripcion_opt = array(
            1 => 'General',
            2 => 'Masculino',
            3 => 'Femenino',
            4 => 'Tasa Homicidio'
      );
      if($indicador == 38){
            //lesiones personales
            foreach($ciudades as $k=>$c){


            $dql = "select i.idIndicador as indicador, c.ciudadcol as territorio, SUBSTRING(pn.fecha, 1, 4) as fecha, sum(pn.victimas) as valor from Application_Model_Policianacional pn join 
                pn.ciudad_idciudad c join pn.indicador_idIndicador i
                where c.idciudad = :ciudad and i.idIndicador = :indicador group by i.idIndicador,territorio,fecha";

            $query = $this->_em->createQuery($dql);

            $query->setParameter('indicador', $indicador); 
            $query->setParameter('ciudad', $k); 
            $data = $query->getArrayResult();

            foreach($data as $data_idx=>$d){
//                                $d['fecha'] = explode('-', $d['fecha']);
//                                $d['fecha'] = $d['fecha'][0];
                $d['territorio'] = $c;
                $json[] = $d;
                $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ini+$data_idx).(5+$k), round($d["valor"],2));

            }

          }

           $dql = "select i.idIndicador as indicador, c.ciudadcol as territorio, SUBSTRING(pn.fecha, 1, 4) as fecha, count(pn.idpolicia_nacional) as valor from Application_Model_Policianacional pn join 
                pn.ciudad_idciudad c join pn.indicador_idIndicador i
                where c.idciudad = :ciudad and i.idIndicador = :indicador group by i.idIndicador,territorio,fecha";

            $query = $this->_em->createQuery($dql);

            $query->setParameter('indicador', $indicador); 
            $query->setParameter('ciudad', 3); 
            $data = $query->getArrayResult();

            foreach($data as $key=>$d){
                $json[] = $d;
                $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ini+$key).(5+3), round($d["valor"],2));

            }

        }
        else{
            foreach($ciudades as $k=>$c){
                
            
            $dql = sprintf("select i.idIndicador as indicador, ciu.ciudadcol as territorio, ml.anno as fecha, ml.total as valor from Application_Model_Medicinalegal ml join ml.indicador_idindicador i join
            ml.ciudad_idciudad ciu where i.idIndicador = :indicador and
            ml.descripcion = '%s' and ciu.idciudad = :ciudad", $descripcion_opt[1]);

            $query = $this->_em->createQuery($dql);

            $query->setParameter('indicador', $indicador); 
            $query->setParameter('ciudad', $k); 
            $data = $query->getArrayResult();

             foreach($data as $key=>$d){
                $d['territorio'] = $c;
//                var_dump(chr($col_ini+$key+1).(5+$k));
//                var_dump(round($d["valor"],2));
                $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ini+$key+1).(5+$k), round($d["valor"],2));
            }
            
                foreach($edades_r as $ke => $e){
                    
                    $dql = sprintf("select i.idIndicador as indicador, ciu.ciudadcol as territorio, ml.anno as fecha, ml.total as valor from Application_Model_Medicinalegal ml join ml.indicador_idindicador i join
                    ml.ciudad_idciudad ciu where i.idIndicador = :indicador and
                    ml.descripcion = '%s' and ciu.idciudad = :ciudad", $e);
                    
                    $query = $this->_em->createQuery($dql);
                    
                    $query->setParameter('indicador', $indicador); 
                    $query->setParameter('ciudad', $k); 
                    $data = $query->getArrayResult();
                    
                    foreach($data as $key=>$d){
                        $d['territorio'] = $c;         
                        $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ini+$key+1).(15+(6*($k-1))+$ke), round($d["valor"],2));
                    }
                    
                }
                foreach($generos as $kg => $g){
                    
                    $dql = sprintf("select i.idIndicador as indicador, ciu.ciudadcol as territorio, ml.anno as fecha, ml.total as valor from Application_Model_Medicinalegal ml join ml.indicador_idindicador i join
                    ml.ciudad_idciudad ciu where i.idIndicador = :indicador and
                    ml.descripcion = '%s' and ciu.idciudad = :ciudad", $g);
                    
                    $query = $this->_em->createQuery($dql);
                    
                    $query->setParameter('indicador', $indicador); 
                    $query->setParameter('ciudad', $k); 
                    $data = $query->getArrayResult();
                    
                    foreach($data as $key=>$d){
                        $d['territorio'] = $c;
//                        var_dump($k.':'.$c);
//                        var_dump($g);
//                        var_dump(chr($col_ini+$key+1).(8+(2*($k-1))+$kg).':'.round($d["valor"],2));
                        $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ini+$key+1).(8+(2*($k-1))+$kg), round($d["valor"],2));
                    }
                    
                    $dql2 = sprintf("select i.idIndicador as indicador, ciu.ciudadcol as territorio, ml.anno as fecha, ml.total as valor from Application_Model_Medicinalegal ml join ml.indicador_idindicador i join
                    ml.ciudad_idciudad ciu where i.idIndicador = :indicador and
                    ml.descripcion = '%s' and ciu.idciudad = :ciudad", $g);

                    $query2 = $this->_em->createQuery($dql2);

                    $query2->setParameter('indicador', $indicador); 
                    $query2->setParameter('ciudad', 3); 
                    $data = $query2->getArrayResult();

                    foreach($data as $key=>$d){
//                        var_dump(chr($col_ini+$key+1).(12+$kg));
//                        var_dump(round($d["valor"],2));
                        $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ini+$key+1).(12+$kg), round($d["valor"],2));
                    }
                    
                }
            }
            
            $sql2 = sprintf("select i.idIndicador as indicador, ciu.ciudadcol as territorio, ml.anno as fecha, ml.total as valor from Application_Model_Medicinalegal ml join ml.indicador_idindicador i join
            ml.ciudad_idciudad ciu where i.idIndicador = :indicador and
            ml.descripcion = '%s' and ciu.idciudad = :ciudad", $descripcion_opt[1]);
            
//            var_dump($sql2);

            $query2 = $this->_em->createQuery($sql2);

            $query2->setParameter('indicador', $indicador); 
            $query2->setParameter('ciudad', 3); 
            $data2 = $query2->getArrayResult();
            
            foreach($data2 as $key=>$d){
//                var_dump(chr($col_ini+$key+1).(5+3));
//                var_dump(round($d["valor"],2));
                $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ini+$key+1).(5+3), round($d["valor"],2));
            }
            
             foreach($edades_r as $ke => $e){
                    
                    $dql = sprintf("select i.idIndicador as indicador, ciu.ciudadcol as territorio, ml.anno as fecha, ml.total as valor from Application_Model_Medicinalegal ml join ml.indicador_idindicador i join
                    ml.ciudad_idciudad ciu where i.idIndicador = :indicador and
                    ml.descripcion = '%s' and ciu.idciudad = :ciudad", $e);
                    
                    $query = $this->_em->createQuery($dql);
                    
                    $query->setParameter('indicador', $indicador); 
                    $query->setParameter('ciudad', 3); 
                    $data = $query->getArrayResult();
                    
                    foreach($data as $key=>$d){
                        $d['territorio'] = $c;         
                        $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ini+$key+1).(27+$ke), round($d["valor"],2));
                    }
                    
                }
        }
        
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="'.html_entity_decode($result_1[0]['nombre_indicador']).'.xlsx"');
        header('Cache-Control: max-age=0');
        ob_end_clean();
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter->save('php://output');    
        ob_end_clean();
  }

  private function generarEstrella($indicador){   
    $data = array();
    $general = array();
    $edades_d = array();
    $cols = true;
    $col_ciudad = 66;
    $row_respuesta = 5;
    $subpregunta = 0;
//    $col_tags = true;
    if($indicador == 21 || $indicador == 55){
        $ciudades = array(
            2 => 'Providencia'

        );
    }
    else{
        $ciudades = array(
            1 => 'San Andrés',
            2 => 'Providencia'

        );
    }
     
     
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
     
    $edades_tn = array(
            'Menor a 18',
            '18-25',
            '26-35',
            '36-45',
            '46-55',
            'Mayor a 55'
        );
    
    $generos = array(
            1 => 'Femenino',
            2 => 'Masculino'
        );
   if($indicador == 21 || $indicador == 55){
       $objPHPExcel = PHPExcel_IOFactory::load(APPLICATION_PATH . "/../library/PHPExcel-1.8/templates/providencia.xlsx");
   }
   else{
       $objPHPExcel = PHPExcel_IOFactory::load(APPLICATION_PATH . "/../library/PHPExcel-1.8/templates/estrella.xlsx");
   }
   
   $objPHPExcel->setActiveSheetIndex(0);
     $dql_1 = "select i,p,sub
        from Application_Model_Indicadores i join i.pregunta_idPregunta 
        p join p.subpreguntas sub where i.idIndicador = :indicador"; 


    $query_1 = $this->_em->createQuery($dql_1);
    $query_1->setParameter('indicador', $indicador);
    $result_1 = $query_1->getArrayResult(); 
   
    
    $general['indicador'] = $result_1[0]['nombre_indicador'];
    $objPHPExcel->getActiveSheet()->setCellValue('C2', html_entity_decode($result_1[0]['nombre_indicador']));

    if(!($subpregunta > 0)){
        $subpregunta = $result_1[0]['pregunta_idPregunta']['subpreguntas'][0]['idsubpregunta'];                            
        $subpregunta_nombre = $result_1[0]['pregunta_idPregunta']['subpreguntas'][0]['descripcion'];                            
    }
    else{
        foreach($result_1[0]['pregunta_idPregunta']['subpreguntas'] as $s){
            if($s['idsubpregunta'] == $subpregunta){
                $subpregunta_nombre = $s['descripcion'];
            }
        }

    }
    $objPHPExcel->getActiveSheet()->setCellValue('C3', html_entity_decode($subpregunta_nombre));
//    var_dump($ciudades);
    foreach($ciudades as $k=>$c){
        $tmp = array();
        $tmp['indicador'] = $result_1[0]['idIndicador'];
        $tmp['territorio'] = $c;
        $tmp['subpregunta'] = $subpregunta;
        $tmp['subpregunta_nombre'] = $subpregunta_nombre;
//                            
        $dql_2 = 'select opr.descripcion as respuesta, sum(res.ponderador) as valor from
        Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
        pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
        join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
        and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad group by opr.descripcion order by opr.orden';  
//                            

        $query_2 = $this->_em->createQuery($dql_2); 
        $query_2->setParameter('idsubpregunta', $subpregunta);
        $query_2->setParameter('indicador', $indicador); 
        $query_2->setParameter('ciudad', $k);

        $data = $query_2->getArrayResult();
        
        if($cols){
//            var_dump($data);
            $objPHPExcel->getActiveSheet()->insertNewColumnBefore('D',count($data)-1);
            $cols = false;
        }

        $total = 0;
        foreach($data as $d){
            $total += $d['valor'];
        }
//                            $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][$k]["total"] = $total;
           
        foreach($data as $kd=>$d){
             $data[$kd]["valor"] = ($d["valor"]/$total);
//             var_dump(chr($col_ciudad).($k+4));
             if($indicador == 21 || $indicador == 55){
//                var_dump(chr($col_ciudad+$kd+1).(4));
                $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad).($k+4), $c);
                $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad+$kd+1).(5), html_entity_decode($data[$kd]["respuesta"]));
                $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad+$kd+1).(4+$k), round($data[$kd]["valor"],3)*100);
             }
             else{
                $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad).($k+5), $c);
                $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad+$kd+1+1).(5), html_entity_decode($data[$kd]["respuesta"]));
                $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad+$kd+1+1).(5+$k), round($data[$kd]["valor"],3)*100);
             }
             
        }
//         var_dump($data);
        $tmp['datos'] = $data;

        $general[] = $tmp;
        
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
            and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad and res.edad_cat = '%s' group by opr.descripcion order by opr.orden", $e);  


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
//                 var_dump(chr($col_ciudad+$kd+1).(1+(6*($k-1))+$ke));
//                 var_dump($data[$kd]["valor"]);
//                 var_dump($data[$kd]["respuesta"]);
                 if($indicador == 21 || $indicador == 55){
                    $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad).(1+(6*($k-1))), $c);
                    $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad).(8+(6*($k-1))), $c);
                    $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad+$kd+1+1).(1+(6*($k-1))+$ke), round($data[$kd]["valor"],3)*100);
                 }
                 else{
//                    var_dump(chr($col_ciudad).(15+(6*($k-1))));
//                    var_dump(chr($col_ciudad+$kd+1+1).(15+(6*($k-1))+$ke));
                    $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad).(15+(6*($k-1))), $c);
                    $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad+$kd+1+1).(15+(6*($k-1))+$ke), round($data[$kd]["valor"],3)*100);
                 }
                 
//                 $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad+$kd+1).(8+$k), $data[$kd]["valor"]);
            }

            $tmp['datos'] = $data;

            $edades_d[] = $tmp;
        }
        
         foreach($generos as $kg=>$g){                                
            $tmp = array();
            $tmp['indicador'] = $result_1[0]['idIndicador'];
            $tmp['territorio'] = $c;
            $tmp['sexo'] = $g;

//                            
            $dql_2 = sprintf("select opr.descripcion as respuesta, sum(res.ponderador) as valor from
            Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
            pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
            join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
            and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad and res.sexo = '%s' group by opr.descripcion order by opr.orden", $g);  


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
//                 var_dump(chr($col_ciudad).(8+(6*($k-1))));
//                 var_dump($data[$kd]["respuesta"]);
//                 $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad).(22+(6*($k-1))), $c);
                 if($indicador == 21 || $indicador == 55){
                     $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad).(7+(6*($k-1))), $c);
                     $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad+$kd+1+1).(10+$kg+(2*($k-1))), round($data[$kd]["valor"],3)*100);
                 }
                 else{
//                     var_dump(chr($col_ciudad+$kd+1+1).(8+$kg+(2*($k-1))));
                     $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad+$kd+1+1).(8+$kg+(2*($k-1))), round($data[$kd]["valor"],3)*100);
                 }
                 
            }

            $tmp['datos'] = $data;

//            $json[] = $tmp;
        }
    }

    //nacional
    if($indicador != 21 || $indicador != 55){
    $tmp = array();
    $tmp['indicador'] = $result_1[0]['idIndicador'];
    $tmp['territorio'] = 'Nacional';
    $tmp['subpregunta'] = $subpregunta;
    $tmp['subpregunta_nombre'] = $subpregunta_nombre;


    $dql_3 = "select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
        join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
        join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
        and sub.idsubpregunta=:idsubpregunta and tn.descripcion='Nacional' group by opc.descripcion order by opc.orden"; 

    $query_3 = $this->_em->createQuery($dql_3);
    $query_3->setParameter('idsubpregunta', $subpregunta);
    $query_3->setParameter('indicador', $indicador); 

    $data_c = $query_3->getArrayResult();
    foreach($data_c as $kd=>$d){
         $data_c[$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
         var_dump(chr($col_ciudad+$kd+1+1).(8));
         $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad+$kd+1+1).(8), round($data_c[$kd]["valor"],3)*100);
    }

    $tmp['datos'] = $data_c;
    $general[] = $tmp;
    
    

    $data['general'] = $general;      
    
    //nacional
    foreach($edades as $ke=>$e){
//    var_dump($e);
    $tmp = array();
    $tmp['indicador'] = $result_1[0]['idIndicador'];
    $tmp['territorio'] = 'Nacional';
    $tmp['edad'] = $edades_r[$ke];
    $hasdata = true;

    $dql_3 = sprintf("select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
        join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
        join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
        and sub.idsubpregunta=:idsubpregunta and tn.descripcion = '%s' group by opc.descripcion order by opc.orden", $edades_tn[$ke]); 
//                        
    $query_3 = $this->_em->createQuery($dql_3);
    $query_3->setParameter('idsubpregunta', $subpregunta);
    $query_3->setParameter('indicador', $indicador); 
//                        
    $data_c = $query_3->getArrayResult();
//                        $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3]["data"] = $data_c;
    foreach($data_c as $kd=>$d){
        if($data_c[$kd]["valor"] == 0){
            $hasdata = false;
        }
//         var_dump(chr($col_ciudad+$kd+1).(21+(6*($k-1))+$ke));
//         var_dump($data_c[$kd]["valor"]);
//         var_dump($data_c[$kd]["respuesta"]);
         $data_c[$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
         $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad+$kd+1+1).(21+(6*($k-1))+$ke), round($data_c[$kd]["valor"],3)*100);
    }
    if($hasdata){
         $tmp['datos'] = $data_c;
    }  

//    $json[] = $tmp;
    }
    
    foreach($generos as $kg=>$g){
        $tmp = array();
        $tmp['indicador'] = $result_1[0]['idIndicador'];
        $tmp['territorio'] = 'Nacional';
        $tmp['sexo'] = $g;

        $hasdata = true;

        $dql_3 = sprintf("select opc.descripcion as respuesta, tn.total as valor from Application_Model_Totalnacional tn
            join tn.cod_respuesta opc join tn.subpregunta_idsubpregunta sub join sub.escala_idEscala esc
            join sub.pregunta_idPregunta pre join pre.indicadores ind where ind.idIndicador = :indicador 
            and sub.idsubpregunta=:idsubpregunta and tn.descripcion = '%s' group by opc.descripcion order by opc.orden", $g); 
//                        
        $query_3 = $this->_em->createQuery($dql_3);
        $query_3->setParameter('idsubpregunta', $subpregunta);
        $query_3->setParameter('indicador', $indicador); 
//                        
        $data_c = $query_3->getArrayResult();
//                        $r["pregunta_idPregunta"]["subpreguntas"][$sub['idsubpregunta']][3]["data"] = $data_c;
        foreach($data_c as $kd=>$d){
            if($data_c[$kd]["valor"] == 0){
                $hasdata = false;
            }
             $data_c[$kd]["valor"] = (float) str_replace(',','.',$d["valor"]);
//             var_dump(chr($col_ciudad+$kd+1).(6+(6*($k-1))+$kg));
//                var_dump($data_c[$kd]["valor"]);
//                var_dump($data_c[$kd]["respuesta"]);
             $objPHPExcel->getActiveSheet()->setCellValue(chr($col_ciudad+$kd+1+1).(6+(6*($k-1))+$kg), round($data_c[$kd]["valor"],3)*100);
        }
        if($hasdata){
             $tmp['datos'] = $data_c;
        }  

//        $json[] = $tmp;
        }
    }
    $styleArray = array(
        'borders' => array(
          'allborders' => array(
            'style' => PHPExcel_Style_Border::BORDER_THIN
          )
        )
      );    
     
    $objPHPExcel->getActiveSheet()->getStyle('C32:G32')->applyFromArray($styleArray);
    unset($styleArray);
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment;filename="'.html_entity_decode($result_1[0]['nombre_indicador']).'.xlsx"');
    header('Cache-Control: max-age=0');
    ob_end_clean();
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
    $objWriter->save('php://output');    
    ob_end_clean();

  }

}







