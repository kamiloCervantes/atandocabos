<?php
use \Doctrine\Common\Collections\ArrayCollection;
/**
 * @Entity
 * @Table(name="policia_nacional")
 */
class Application_Model_Policianacional
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $idpolicia_nacional;
    
    
    /** @Column(type="string") */
    private $sexo;
    
    /** @Column(type="string") */
    private $grupo_edad;
    
    /** @Column(type="string") */
    private $fecha;
    
    /**
     * @ManyToOne(targetEntity="Application_Model_Ciudades")
     * @JoinColumn(name="ciudad_idciudad", referencedColumnName="idciudad")
     */
    private $ciudad_idciudad;
    
    /**
     * @ManyToOne(targetEntity="Application_Model_Indicadores")
     * @JoinColumn(name="indicador_idIndicador", referencedColumnName="idIndicador")
     */
    private $indicador_idIndicador;
 
    
    
    public function __construct() {
     
    }
    
   

}

