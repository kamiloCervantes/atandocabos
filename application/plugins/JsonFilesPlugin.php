<?php
class Application_Plugin_JsonFilesPlugin extends Zend_Controller_Plugin_Abstract
{
    private $_auth = null;
    
    private $_acl = null;
    
    
    public function preDispatch(Zend_Controller_Request_Abstract $request)
    {
        var_dump($request->getRequestUri());
//        $this->_acl = new Acl_Config();
//        $this->_auth = Zend_Auth::getInstance(); 
//        $identity = $this->_auth->getIdentity();       
//        $redirector = Zend_Controller_Action_HelperBroker::getStaticHelper('Redirector');
//
//        if(!$this->_auth->hasIdentity()){
//            $isAllowed = $this->_acl->isAllowed(Acl_Roles::GUEST_USER , $request->getModuleName().':'.$request->getControllerName(), $request->getActionName());
//            if(!$isAllowed){
//                $redirector->gotoUrl('/login');
//            }
//        }
//        if($this->_auth->hasIdentity()){
//            $isAllowed = $this->_acl->isAllowed($identity['role'], $request->getModuleName().':'.$request->getControllerName(), $request->getActionName());
//            if(!$isAllowed){
//                switch($identity['role']){
//                    case Acl_Roles::ADMIN:
//                        $redirector->gotoUrl('/admin');
//                        break;
//                    case Acl_Roles::ESTUDIANTE:
//                        $redirector->gotoUrl('/inicio');
//                        break;
//                }
//                
//            }
//        }
    }
}
