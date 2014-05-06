<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

function handleNewToken() {
	$token = hash("sha256",(rand(1,99999)*time())."kur1va".(rand(2,999999)));
	return $token;
}