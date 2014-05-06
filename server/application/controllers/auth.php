<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Auth extends CI_Controller {

	function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
        header('P3P: CP="NOI ADM DEV COM NAV OUR STP"');
        header('Access-Control-Allow-Origin: *');
    }

	public function signIn()
	{
        $nick = strtoupper(urldecode($_GET['nick']));
        $password = urldecode($_GET['password']);

		$data = false;
		if(isset($nick,$password)) {
			$data = $this->user_model->signIn($nick,$password);
			if($data != false) {
				$items = $this->user_model->getUserItems($data->id_user);
				if($items != false)
					$data->items = $this->user_model->getUserItems($data->id_user);
				else
					$data->items = array();
			}
		}
		$json = json_encode($data); 
		echo $json;
	}

	public function signInByToken()
	{
        $id = urldecode($_GET['id']);
        $token = urldecode($_GET['token']);

		$data = false;
		if(isset($id,$token)) {
			$data = $this->user_model->signInByToken($id,$token);
			if($data != false) {
				$items = $this->user_model->getUserItems($data->id_user);
				if($items != false)
					$data->items = $this->user_model->getUserItems($data->id_user);
				else
					$data->items = array();
			}
		}
		$json = json_encode($data); 
		echo $json;
	}

	public function signUp()
	{
		$nick = strtoupper(urldecode($_GET['nick']));
		$email = urldecode($_GET['email']);
        $password = urldecode($_GET['password']);

		$data = false;
		if(isset($nick,$email,$password)) {
			if(!$this->user_model->userExists($nick)) {
				$data = $this->user_model->signUp(array("nick" => $nick, "email" => $email, "password" => $password, "money" => 0));
				$data->items = array();
			}
		}
        $json = json_encode($data); 
		echo $json;
	}
}