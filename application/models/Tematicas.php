<?php

/**
 * @Entity
 * @Table(name="tematica")
 */
class Application_Model_Tematicas
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $idTematica;    
    
    /** @Column(type="string") */
    private $nom_tematica;
    
    
    public function __construct(){
       
    }
    
   
    
}

