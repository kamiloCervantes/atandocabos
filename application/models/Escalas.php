<?php
use \Doctrine\Common\Collections\ArrayCollection;
/**
 * @Entity
 * @Table(name="escala")
 */
class Application_Model_Escalas
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $idescala;
    
    
    /** @Column(type="string") */
    private $nombre_escala;
    
     /** 
     * @OneToMany(targetEntity="Application_Model_Opcionesrespuesta", mappedBy="escala_idescala")
     */
    private $opciones_respuesta; 

    
    public function __construct() {
        $this->opciones_respuesta = new ArrayCollection();
    }
    
   

}

