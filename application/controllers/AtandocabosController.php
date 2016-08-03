<?php
use Doctrine\ORM\Query\ResultSetMapping;

class AtandocabosController extends Zend_Controller_Action
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
        $this->_helper->getHelper('layout')->disableLayout();
        $registry = Zend_Registry::getInstance();
       $this->_em = $registry->entitymanager;
    }

    public function indexAction()
    {
        
        $dql_1 = "select i
            from Application_Model_Indicadores i";  
        
        $this->view->dql = $dql_1;
        
        $query_1 = $this->_em->createQuery($dql_1);
        $result_1 = $query_1->getArrayResult();
        
        $this->view->data = $result_1;
    }
    
    public function bolasAction(){
        
    }
    
    public function toleranciaAction(){
        $indicador = $this->_getParam('i');
//        $indicador = 1;
        $this->view->indicador = $indicador;
        
        $dql_1 = "select i,p.descripcion as pregunta,sub.idsubpregunta, sub.descripcion
            from Application_Model_Indicadores i join i.pregunta_idPregunta 
            p join p.subpreguntas sub where i.idIndicador = :indicador"; 
        
        
        $query_1 = $this->_em->createQuery($dql_1);
        $query_1->setParameter('indicador', $indicador);
        $result_1 = $query_1->getArrayResult();
        
        $this->view->data_indicador = $result_1;
    }
    
    public function resultadosAction(){
        $indicador = $this->_getParam('i');
        
        $this->view->indicador = $indicador;
        
        $dql_1 = "select i.tipo_grafica from Application_Model_Indicadores i where i.idIndicador = :indicador"; 
        
        
        $query_1 = $this->_em->createQuery($dql_1);
        $query_1->setParameter('indicador', $indicador);
        $result_1 = $query_1->getSingleScalarResult();
        
        switch($result_1){
            case '1':
                $this->redirect('/atandocabos/estrella/i/'.$indicador);
                break;
            case '2':
                $this->redirect('/atandocabos/tolerancia/i/'.$indicador);
                break;
            case '3':
                $this->redirect('/atandocabos/linea/i/'.$indicador);
                break;
        }
    }
    
    public function lineaAction(){
        $indicador = $this->_getParam('i');
        
        $this->view->indicador = $indicador;
        
        $dql_1 = "select i,p.descripcion as pregunta,sub.idsubpregunta, sub.descripcion
            from Application_Model_Indicadores i join i.pregunta_idPregunta 
            p join p.subpreguntas sub where i.idIndicador = :indicador"; 
        
        
        $query_1 = $this->_em->createQuery($dql_1);
        $query_1->setParameter('indicador', $indicador);
        $result_1 = $query_1->getArrayResult();
        
        $this->view->data_indicador = $result_1;
    }
    
    public function estrellaAction(){
        $indicador = $this->_getParam('i');
        
        $this->view->indicador = $indicador;
        
        $dql_1 = "select i,p.descripcion as pregunta,sub.idsubpregunta, sub.descripcion
            from Application_Model_Indicadores i join i.pregunta_idPregunta 
            p join p.subpreguntas sub where i.idIndicador = :indicador"; 
        
        
        $query_1 = $this->_em->createQuery($dql_1);
        $query_1->setParameter('indicador', $indicador);
        $result_1 = $query_1->getArrayResult();
        
        $this->view->data_indicador = $result_1;
        
        $subpregunta = $result_1[0]['idsubpregunta'];
        
        $dql_2 = 'select opr.descripcion, sum(res.ponderador), ind.tipo_grafica from
            Application_Model_Indicadores ind join ind.pregunta_idPregunta pre join 
            pre.subpreguntas sub join sub.respuestas res join sub.escala_idEscala esc 
            join res.cod_respuesta opr join res.ciudad_idciudad ciu where ind.idIndicador = :indicador 
            and sub.idsubpregunta=:idsubpregunta and ciu.idciudad=:ciudad group by opr.descripcion';  
        
        $query_2 = $this->_em->createQuery($dql_2); 
        $query_2->setParameter('idsubpregunta', $subpregunta);
        $query_2->setParameter('indicador', $indicador);
        $query_2->setParameter('ciudad', 1);
        
        
        $data = $query_2->getArrayResult();
        
        $this->view->data = $data;
        
        $dql_3 = 'select sub.descripcion as subpregunta,esc.nombre_escala,opc.descripcion as opcion from Application_Model_Subpreguntas sub 
            join sub.escala_idEscala esc join esc.opciones_respuesta opc where
            sub.idsubpregunta = :idsubpregunta';
        
        $query_3 = $this->_em->createQuery($dql_3);
        $query_3->setParameter('idsubpregunta', $subpregunta);
        $escala = $query_3->getArrayResult();
        
        $this->view->escala = $escala;
    }

    
    public function multiple1Action(){
        $indicadores = $this->_getParam('i');
        $indicadores = explode('|', $indicadores);
        $indicadores_c = implode(',', $indicadores);
        $this->view->indicadores = $indicadores_c;
        
        $tipo_graficas = array(
            1 => 'estrella',
            2 => 'tolerancia',
            3 => 'linea',
            4 => 'bolas'
        );
        
        $this->view->tipo_graficas = $tipo_graficas;
        
        $dql_1 = sprintf("select i,p.descripcion as pregunta
            from Application_Model_Indicadores i join i.pregunta_idPregunta 
            p where i.idIndicador IN (%s)", $indicadores_c);  
        
        $this->view->dql = $dql_1;
        
        $query_1 = $this->_em->createQuery($dql_1);
        $result_1 = $query_1->getArrayResult();
        
        foreach($result_1 as $key=>$r){
            $dql_2 = "select s from Application_Model_Subpreguntas s join s.pregunta_idPregunta p join
                p.indicadores i where i.idIndicador = :indicador";  
            
            $query_2 = $this->_em->createQuery($dql_2);
            $query_2->setParameter('indicador', $r[0]['idIndicador']);
            $result_2 = $query_2->getArrayResult();
            $result_1[$key]['subpreguntas'] = $result_2;
        }

        $this->view->data_indicador = $result_1;

    }
    
    public function multiple3Action(){
        $indicadores = $this->_getParam('i');
        $indicadores = explode('|', $indicadores);
        $indicadores_c = implode(',', $indicadores);
        $this->view->indicadores = $indicadores_c;
        
        $tipo_graficas = array(
            1 => 'estrella',
            2 => 'tolerancia',
            3 => 'linea',
            4 => 'bolas'
        );
        
        $this->view->tipo_graficas = $tipo_graficas;
        
        $dql_1 = sprintf("select i,p.descripcion as pregunta
            from Application_Model_Indicadores i join i.pregunta_idPregunta 
            p where i.idIndicador IN (%s)", $indicadores_c);  
        
        $this->view->dql = $dql_1;
        
        $query_1 = $this->_em->createQuery($dql_1);
        $result_1 = $query_1->getArrayResult();
        
        foreach($result_1 as $key=>$r){
            $dql_2 = "select s from Application_Model_Subpreguntas s join s.pregunta_idPregunta p join
                p.indicadores i where i.idIndicador = :indicador";  
            
            $query_2 = $this->_em->createQuery($dql_2);
            $query_2->setParameter('indicador', $r[0]['idIndicador']);
            $result_2 = $query_2->getArrayResult();
            $result_1[$key]['subpreguntas'] = $result_2;
        }
        $this->view->tot_subpreguntas = count($result_2);
        $this->view->data_indicador = $result_1;

    }
    
    public function multipleAction(){
        $indicadores = $this->_getParam('i');
        $indicadores = explode('|', $indicadores);
        $indicadores_c = implode(',', $indicadores);
        $this->view->indicadores = $indicadores_c;
        
        $tipo_graficas = array(
            1 => 'estrella',
            2 => 'tolerancia',
            3 => 'linea',
            4 => 'bolas'
        );
        
        $this->view->tipo_graficas = $tipo_graficas;
        
        $dql_1 = sprintf("select i,p.descripcion as pregunta
            from Application_Model_Indicadores i join i.pregunta_idPregunta 
            p where i.idIndicador IN (%s)", $indicadores_c);  
        
        $this->view->dql = $dql_1;
        
        $query_1 = $this->_em->createQuery($dql_1);
        $result_1 = $query_1->getArrayResult();
        
        foreach($result_1 as $key=>$r){
            $dql_2 = "select s from Application_Model_Subpreguntas s join s.pregunta_idPregunta p join
                p.indicadores i where i.idIndicador = :indicador";  
            
            $query_2 = $this->_em->createQuery($dql_2);
            $query_2->setParameter('indicador', $r[0]['idIndicador']);
            $result_2 = $query_2->getArrayResult();
            $result_1[$key]['subpreguntas'] = $result_2;
        }
        $this->view->tot_subpreguntas = count($result_2);
        $this->view->data_indicador = $result_1;

    }

}







