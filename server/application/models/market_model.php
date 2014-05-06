<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Market_model extends CI_Model {	

	function loadMarket() {
		$query = "SELECT item.* FROM item ORDER BY price ASC";
		$r = $this->db->query($query);
		return $r->result();
	}

}