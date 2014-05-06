<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cat extends CI_Controller {

	function __construct()
    {
        parent::__construct();
        $this->load->model('score_model');
        $this->load->model('user_model');
        header('P3P: CP="NOI ADM DEV COM NAV OUR STP"');
        header('Access-Control-Allow-Origin: *');
    }

    public function gameOver() {
        $id_user = urldecode($_GET['id_user']);
        $score = urldecode($_GET['score']);
        $device = urldecode($_GET['device']);
        $money = urldecode($_GET['money']);

        $data = false;
        if(isset($id_user,$score,$money,$device)) {
            $data = $this->score_model->addScore($id_user,$score,$device);
            $this->user_model->updateMoney($id_user,$money);
        }
        $json = json_encode($data); 
        echo $json;
    }

    public function buyItem() {
        $id_user = urldecode($_GET['id_user']);
        $id_item = urldecode($_GET['id_item']);
        $price = urldecode($_GET['price']);

        $data = false;
        $data = $this->user_model->buyItem($id_user,$id_item,$price);
        $json = json_encode($data); 
        echo $json;
    }

    public function sellItem() {
        $id_user = urldecode($_GET['id_user']);
        $id_item = urldecode($_GET['id_item']);
        $price = urldecode($_GET['price']);

        $data = false;
        $data = $this->user_model->sellItem($id_user,$id_item,$price);
        $json = json_encode($data); 
        echo $json;
    }

    public function useItem() {
        $id_user = urldecode($_GET['id_user']);
        $id_item = urldecode($_GET['id_item']);

        $data = false;
        $data = $this->user_model->useItem($id_user,$id_item);
        $json = json_encode($data); 
        echo $json;
    }

}