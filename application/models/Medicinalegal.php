<?php
use \Doctrine\Common\Collections\ArrayCollection;
/**
 * @Entity
 * @Table(name="medicina_legal")
 */
class Application_Model_Medicinalegal
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $idmedicina_legal;
    
    
    /** @Column(type="float") */
    private $total;
    
    /** @Column(type="string") */
    private $descripcion;
    
    /** @Column(type="integer") */
    private $anno;
    
    /**
     * @ManyToOne(targetEntity="Application_Model_Ciudades")
     * @JoinColumn(name="ciudad_idciudad", referencedColumnName="idciudad")
     **/
    private $ciudad_idciudad;
    
    /**
     * @ManyToOne(targetEntity="Application_Model_Indicadores")
     * @JoinColumn(name="indicador_idindicador", referencedColumnName="idIndicador")
     **/
    private $indicador_idindicador;
    

    
    public function __construct() {
     
    }
    
   

}

