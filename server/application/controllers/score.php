<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Score extends CI_Controller {

	function __construct()
    {
        parent::__construct();
        $this->load->model('score_model');
        header('P3P: CP="NOI ADM DEV COM NAV OUR STP"');
        header('Access-Control-Allow-Origin: *');
    }

    public function getGlobalHighscore() {
        $data = false;
        $data = $this->score_model->getHighscore(100);
        $json = json_encode($data); 
        echo $json;
    }

    public function getGlobalPlatformHighscore($device) {
        $data = false;
        $data = $this->score_model->getPlatformHighscore(100,$device);
        $json = json_encode($data); 

        echo $json;
    }

    public function getMyHighscore() {
        $id_user = urldecode($_GET['id_user']);

        $data = false;
        $data = $this->score_model->getMyHighscore($id_user,100);
        $json = json_encode($data); 
        echo $json;
    }

}