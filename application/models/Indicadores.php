<?php
use \Doctrine\Common\Collections\ArrayCollection;
/**
 * @Entity
 * @Table(name="indicador")
 */
class Application_Model_Indicadores
{
    /**
     * @Id @Column(type="integer")
     * @GeneratedValue
     */
    private $idIndicador;
    
    /**
     * @ManyToOne(targetEntity="Application_Model_Temas")
     * @JoinColumn(name="tema_idTema", referencedColumnName="idTema")
     */
    private $tema_idTema;
    
    /** @Column(type="string") */
    private $nombre_indicador;
    
   /**
     * @ManyToOne(targetEntity="Application_Model_Preguntas")
     * @JoinColumn(name="pregunta_idPregunta", referencedColumnName="idPregunta")
     */
    private $pregunta_idPregunta;
    
    /** @Column(type="string") */
    private $tipo_grafica;
    
    /** @Column(type="integer") */
    private $visible;
    
    public function __construct() {
     
    }
    
   

}

