<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Market extends CI_Controller {

	function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
        $this->load->model('market_model');
        header('P3P: CP="NOI ADM DEV COM NAV OUR STP"');
        header('Access-Control-Allow-Origin: *');
    }

    public function init() {
        $data = false;
        $data = $this->market_model->loadMarket();
        $json = json_encode($data); 
        echo $json;
    }
}