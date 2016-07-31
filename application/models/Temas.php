<?php
use Doctrine\Common\Collections\ArrayCollection;
/**
 * @Entity
 * @Table(name="tema")
 */
class Application_Model_Temas
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $idTema;
    
    /** @Column(type="string") */
    private $nom_tema;
    
    /**
     * @ManyToOne(targetEntity="Application_Model_Tematicas")
     * @JoinColumn(name="tematica_idTematica", referencedColumnName="idTematica")
     **/
    private $tematica;
    
    
    
    public function __construct(){
       
    }
    

}

