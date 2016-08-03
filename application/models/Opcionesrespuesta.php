<?php
use \Doctrine\Common\Collections\ArrayCollection;
/**
 * @Entity
 * @Table(name="opciones_respuesta")
 */
class Application_Model_Opcionesrespuesta
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $idopciones_respuesta;
    
    
    /** @Column(type="string") */
    private $descripcion;
    
    /**
     * @ManyToOne(targetEntity="Application_Model_Escalas")
     * @JoinColumn(name="escala_idescala", referencedColumnName="idescala")
     */
    private $escala_idescala;
    
    /** @Column(type="integer") */
    private $orden;
    
    public function __construct() {
     
    }
    
   

}

