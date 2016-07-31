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
    

    
    public function __construct() {
     
    }
    
   

}

