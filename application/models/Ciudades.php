<?php
use \Doctrine\Common\Collections\ArrayCollection;
/**
 * @Entity
 * @Table(name="ciudad")
 */
class Application_Model_Ciudades
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $idciudad;
    
    
    /** @Column(type="string") */
    private $ciudadcol;
    

    
    public function __construct() {
     
    }
    
   

}

