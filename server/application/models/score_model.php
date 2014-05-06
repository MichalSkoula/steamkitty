<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Score_model extends CI_Model {	

	function getHighscore($limit) {
		$query = "SELECT score.*,user.nick 
					FROM score
					INNER JOIN (SELECT MAX(score) AS maxScore, id_user FROM score GROUP BY id_user) maxScore ON maxScore.maxScore = score.score
					LEFT JOIN user ON user.id_user=score.id_user
					WHERE score.id_user >= 0
					ORDER BY score DESC
					LIMIT ".$this->db->escape($limit);
		$r = $this->db->query($query);
		return $r->result();
	}

	function getPlatformHighscore($limit,$device) {
		$query = "SELECT score.*,user.nick 
					FROM score
					INNER JOIN (SELECT MAX(score) AS maxScore, id_user FROM score WHERE score.device=".$this->db->escape($device)." GROUP BY id_user) maxScore ON maxScore.maxScore = score.score
					LEFT JOIN user ON user.id_user=score.id_user
					WHERE score.id_user >= 0
					ORDER BY score DESC
					LIMIT ".$this->db->escape($limit);
		$r = $this->db->query($query);
		return $r->result();
	}

	function getMyHighscore($id_user,$limit) {
		$query = "SELECT *
					FROM score 
					WHERE id_user=".$this->db->escape($id_user)."
					ORDER BY score DESC
					LIMIT ".$this->db->escape($limit);
		$r = $this->db->query($query);
		return $r->result();
	}

	function addScore($id_user,$score,$device) {
		$this->db->insert('score',array('id_user' => $id_user, 'score' => $score, 'device' => $device, 'published' => date("Y-m-d H:i:s", time())));
		return $this->db->insert_id();
	}
}