<?php
use \Doctrine\Common\Collections\ArrayCollection;
/**
 * @Entity
 * @Table(name="total_nacional")
 */
class Application_Model_Totalnacional
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $idtotal_nacional;
    
    
    /** @Column(type="string") */
    private $total;
    
    /** @Column(type="string") */
    private $descripcion;
    
    /**
     * @ManyToOne(targetEntity="Application_Model_Opcionesrespuesta")
     * @JoinColumn(name="cod_respuesta", referencedColumnName="idopciones_respuesta")
     */
    private $cod_respuesta;
    /**
     * @ManyToOne(targetEntity="Application_Model_Subpreguntas")
     * @JoinColumn(name="subpregunta_idsubpregunta", referencedColumnName="idsubpregunta")
     */
    private $subpregunta_idsubpregunta;
    
    
    public function __construct() {
     
    }
    
   

}

