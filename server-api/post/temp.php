<?php

include_once 'db-connect.php';

class Temp
{

	private $db;

	public function __construct()
	{
		$this->db = new DbConnect();
	}
	
	public function doesTokenExist($token)
	{
		$query = "select * from tokens where token = '$token' Limit 1";
		$stmt = $this->db->getDb()->prepare("select * from tokens where token = ? Limit 1");
		$stmt->bind_param("s", $token);
		$stmt->execute();
		$result = $stmt->get_result();
		if (mysqli_num_rows($result) > 0) {
			$stmt->close();
			return true;
		}
		$stmt->close();
		return false;
	}
	
	public function storeTemp($token, $temp, $humidity, $table) {
        if(!$this->doesTokenExist($token)){
			$mess = "Token does not exist";
			return $this->failJSON($mess);
		} else if(!$this->checkTable($table)){
			$mess = "Table does not exist";
			return $this->failJSON($mess);
		} 
		try {
			$stmt = $this->db->getDb()->prepare("INSERT INTO " .$table. " (temperature, humidity, date) VALUES (?, ?, ?)");
			$stmt->bind_param("sss", $temp, $humidity, $date);
			$datea = new Datetime();
			$date = $datea->format('Y-m-d H:i:s');
			$stmt->execute();
			$stmt->close();
			$this->limitRecords($table);
		} catch(PDOException $e) {
			echo "Error: " . $e->getMessage();
		}
		return $this->successJSON();
	}
	
	public function limitRecords($table){
		include '../tables.php';
		$stmt = $this->db->getDb()->prepare("select * from " .$table);
		$stmt->execute();
		$result = $stmt->get_result();
		if (mysqli_num_rows($result) > $limit) {
			$stmt->close();
			$difference = abs(mysqli_num_rows($result) - $limit);
			$stmt = $this->db->getDb()->prepare("DELETE from " .$table. " order by id LIMIT ?");
			$stmt->bind_param("i", $difference);
			$stmt->execute();
		} 
		$stmt->close();
	}
	
	public function checkTable($table){
		include '../tables.php';
		if(in_array($table, $whitelist)){
			return true;
		}
		return false;
	}
	
	public function failJSON($mess){
		$json['success'] = 0;
		$json['message'] = $mess;
		return $json;
	}
	
	public function successJSON(){
		$json['success'] = 1;
		$json['message'] = "Successfully stored the temp/humidity";
		return $json;
	}
}
