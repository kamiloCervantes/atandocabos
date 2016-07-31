<?php
class Acl_Config extends Zend_Acl
{

	public function __construct()
	{
            $this->add(new Zend_Acl_Resource(Acl_Resources::INDEX));
            $this->add(new Zend_Acl_Resource(Acl_Resources::INDEX_ESTUDIANTE));
            $this->add(new Zend_Acl_Resource(Acl_Resources::REGISTER));
            $this->add(new Zend_Acl_Resource(Acl_Resources::LOGIN));
            $this->add(new Zend_Acl_Resource(Acl_Resources::LOGOUT));
            $this->add(new Zend_Acl_Resource(Acl_Resources::ADMIN));
            $this->add(new Zend_Acl_Resource(Acl_Resources::ERROR));
            $this->add(new Zend_Acl_Resource(Acl_Resources::PRUEBAS));
            $this->add(new Zend_Acl_Resource(Acl_Resources::ADMIN_ITEMS));
            $this->add(new Zend_Acl_Resource(Acl_Resources::ADMIN_CATEGORIAS));
            $this->add(new Zend_Acl_Resource(Acl_Resources::ADMIN_TESTS));
            $this->add(new Zend_Acl_Resource(Acl_Resources::ADMIN_GRUPOS));
            $this->add(new Zend_Acl_Resource(Acl_Resources::API_CATEGORIAS));
            $this->add(new Zend_Acl_Resource(Acl_Resources::API_ITEMS));
            $this->add(new Zend_Acl_Resource(Acl_Resources::API_LOGIN));
            $this->add(new Zend_Acl_Resource(Acl_Resources::API_TESTS));
            $this->add(new Zend_Acl_Resource(Acl_Resources::API_USERS));
            $this->add(new Zend_Acl_Resource(Acl_Resources::API_TESTADMINISTRATION));
            $this->add(new Zend_Acl_Resource(Acl_Resources::API_PROFILE));
            $this->add(new Zend_Acl_Resource(Acl_Resources::DOCUMENTACION));
            $this->add(new Zend_Acl_Resource(Acl_Resources::DOCUMENTACION_ADM));
            $this->add(new Zend_Acl_Resource(Acl_Resources::PROFILE));
            $this->add(new Zend_Acl_Resource(Acl_Resources::EMBED_TESTS));

            $this->addRole(new Zend_Acl_Role(Acl_Roles::GUEST_USER));
            $this->addRole(new Zend_Acl_Role(Acl_Roles::NORMAL_USER));
            $this->addRole(new Zend_Acl_Role(Acl_Roles::ESTUDIANTE));
            $this->addRole(new Zend_Acl_Role(Acl_Roles::ADMIN));
            

            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::API_ITEMS);
            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::API_CATEGORIAS);
            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::API_LOGIN);
            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::API_TESTS);
            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::API_USERS);
            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::API_TESTADMINISTRATION);
            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::INDEX);
            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::LOGIN);
            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::REGISTER);
            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::ERROR);
            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::PRUEBAS);
            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::DOCUMENTACION);
            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::EMBED_TESTS);
            $this->allow(Acl_Roles::GUEST_USER, Acl_Resources::API_PROFILE);
            

            $this->allow(Acl_Roles::ADMIN, Acl_Resources::ADMIN);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::ADMIN_CATEGORIAS);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::ADMIN_ITEMS);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::ADMIN_TESTS);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::ADMIN_GRUPOS);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::API_ITEMS);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::API_CATEGORIAS);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::API_LOGIN);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::API_TESTS);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::API_USERS);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::API_TESTADMINISTRATION);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::API_PROFILE);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::ERROR);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::LOGOUT);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::PRUEBAS);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::DOCUMENTACION_ADM);
            $this->allow(Acl_Roles::ADMIN, Acl_Resources::PROFILE);            
            
            $this->allow(Acl_Roles::ESTUDIANTE, Acl_Resources::ADMIN_TESTS);
            $this->allow(Acl_Roles::ESTUDIANTE, Acl_Resources::API_TESTS);
            $this->allow(Acl_Roles::ESTUDIANTE, Acl_Resources::API_TESTADMINISTRATION);
            $this->allow(Acl_Roles::ESTUDIANTE, Acl_Resources::API_LOGIN);
            $this->allow(Acl_Roles::ESTUDIANTE, Acl_Resources::API_PROFILE);
            $this->allow(Acl_Roles::ESTUDIANTE, Acl_Resources::PROFILE); 
            $this->allow(Acl_Roles::ESTUDIANTE, Acl_Resources::ERROR);
            $this->allow(Acl_Roles::ESTUDIANTE, Acl_Resources::DOCUMENTACION);
            $this->allow(Acl_Roles::ESTUDIANTE, Acl_Resources::LOGOUT);
            $this->allow(Acl_Roles::ESTUDIANTE, Acl_Resources::INDEX_ESTUDIANTE);

                
	}
	
}