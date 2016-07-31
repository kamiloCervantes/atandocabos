<?php
use \Doctrine\Common\Collections\ArrayCollection;
/**
 * @Entity
 * @Table(name="pregunta")
 */
class Application_Model_Preguntas
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $idPregunta;
    
    
    /** @Column(type="string") */
    private $descripcion;
    
     /**
     * @OneToMany(targetEntity="Application_Model_Indicadores", mappedBy="pregunta_idPregunta")
     */
    private $indicadores;
     /**
     * @OneToMany(targetEntity="Application_Model_Subpreguntas", mappedBy="pregunta_idPregunta")
     */
    private $subpreguntas;
   
    
    public function __construct() {
        $this->indicadores = new ArrayCollection();
        $this->subpreguntas = new ArrayCollection();
    }
    
   

}

