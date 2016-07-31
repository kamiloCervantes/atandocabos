<?php
use \Doctrine\Common\Collections\ArrayCollection;
/**
 * @Entity
 * @Table(name="respuesta")
 */
class Application_Model_Respuestas
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $idRespuesta;
    
    
    /** @Column(type="string") */
    private $no_form;
    
     
    /** @Column(type="string") */
    private $annos;
    
     
    /** @Column(type="string") */
    private $educa;
    
    /**
     * @ManyToOne(targetEntity="Application_Model_Ciudades")
     * @JoinColumn(name="ciudad_idciudad", referencedColumnName="idciudad")
     */
    private $ciudad_idciudad;
    
     
    /** @Column(type="float") */
    private $ponderador;
    
    /** @Column(type="string") */
    private $edad_cat;
    
    /** @Column(type="string") */
    private $sexo;
    
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

