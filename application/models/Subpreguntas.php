<?php
use \Doctrine\Common\Collections\ArrayCollection;
/**
 * @Entity
 * @Table(name="subpregunta")
 */
class Application_Model_Subpreguntas
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $idsubpregunta;
    
    
    /** @Column(type="string") */
    private $descripcion;
    
    
    /**
     * @ManyToOne(targetEntity="Application_Model_Preguntas")
     * @JoinColumn(name="pregunta_idPregunta", referencedColumnName="idPregunta")
     */
    private $pregunta_idPregunta;
    
    /**
     * @ManyToOne(targetEntity="Application_Model_Escalas")
     * @JoinColumn(name="escala_idEscala", referencedColumnName="idescala")
     */
    private $escala_idEscala;
    
     /** 
     * @OneToMany(targetEntity="Application_Model_Respuestas", mappedBy="subpregunta_idsubpregunta")
     */
    private $respuestas; 
    
    
    public function __construct() {
     
    }
    
   

}

