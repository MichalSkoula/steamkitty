<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_model extends CI_Model {	

	function signIn($nick,$password) {
		$data = false;
		$query = $this->db->select('id_user,nick,money')->get_where('user', array('nick' => $nick, 'password' => $password), 1);
		if ($query->num_rows() > 0)
		{
			foreach ($query->result() as $row)
			{
			    $data = $row;
			    //create token & update in db
			    $data->token = handleNewToken();
			    $this->db->limit(1);
				$this->db->where('id_user', $row->id_user);
				$this->db->update('user', array('token' => $data->token));
			    
			}
		}
		return $data;
	}

	function signInByToken($id,$token) {
		$data = false;
		$query = $this->db->select('id_user,nick,money')->get_where('user', array('id_user' => $id, 'token' => $token), 1);
		if ($query->num_rows() > 0)
		{
			foreach ($query->result() as $row)
			{
			    $data = $row;
			    //create token & update in db
			    $data->token = handleNewToken();
			    $this->db->limit(1);
				$this->db->where('id_user', $row->id_user);
				$this->db->update('user', array('token' => $data->token));
			}
		}
		return $data;
	}

	function userExists($nick) {
		$query = $this->db->select('*')->get_where('user', array('nick' => $nick), 1);
		if ($query->num_rows() > 0)
		{
			return true;
		}
		return false;
	}

	function signUp($data) {
		$this->db->insert('user', $data);
		$id = $this->db->insert_id(); 

		$data = false;
		$query = $this->db->select('id_user,nick,money')->get_where('user', array('id_user' => $id), 1);
		if ($query->num_rows() > 0)
		{
			foreach ($query->result() as $row)
			{
			    $data = $row;
			    //create token & update in db
			    $data->token = handleNewToken();
			    $this->db->limit(1);
				$this->db->where('id_user', $row->id_user);
				$this->db->update('user', array('token' => $data->token));
			}
		}
		return $data;
	}

	function updateMoney($id_user,$money) {
		$this->db->where('id_user', $id_user);
		$this->db->update('user', array("money" => $money)); 
	}

	function getUserItems($id_user) {
		$r = $this->db->query("SELECT * FROM item WHERE id_item IN (SELECT id_item FROM item2user WHERE id_user=".$this->db->escape($id_user).")");
		if ($r->num_rows() > 0)
			return $r->result();
		else
			return false;
	}

	function buyItem($id_user,$id_item,$price) {
		$this->db->query("INSERT IGNORE INTO item2user (id_user,id_item) VALUES (".$this->db->escape($id_user).",".$this->db->escape($id_item).")");
		$this->db->query("UPDATE user SET money = money-".((int)($price))." WHERE id_user=".$this->db->escape($id_user));
		return true;
	}

	function sellItem($id_user,$id_item,$price) {
		$this->db->query("DELETE FROM item2user WHERE id_user=".$this->db->escape($id_user)." AND id_item=".$this->db->escape($id_item));
		$this->db->query("UPDATE user SET money = money+".((int)($price))." WHERE id_user=".$this->db->escape($id_user));
		return true;
	}

	function useItem($id_user,$id_item) {
		$this->db->query("DELETE FROM item2user WHERE id_user=".$this->db->escape($id_user)." AND id_item=".$this->db->escape($id_item));
		return true;
	}
}