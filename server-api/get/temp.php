<?php

include_once 'db-connect.php';

class Temp
{

	private $db;

	public function __construct()
	{
		$this->db = new DbConnect();
	}
	
	public function getData($afterdate, $beforedate, $maxresults, $table, $includestats, $units){
		if(!$this->checkTable($table)){
			$mess = "Room does not exist";
			return $this->failJSON($mess);
		} 
		if(empty($afterdate) && empty($beforedate)){
			$stmt = $this->db->getDb()->prepare("Select * from " .$table. " order by id DESC LIMIT ?");
			$stmt->bind_param("i", $maxresults);
			$stmt->execute();
			$result = $stmt->get_result();
			if (mysqli_num_rows($result) > 0) {
				$json['results'] = $this->getRes($result, $units);
				if($includestats) {
					mysqli_data_seek($result, 0);
					$json['stats'] = $this->calculateStats($result, $units);
				}
				$json['num'] = mysqli_num_rows($result);
				mysqli_data_seek($result, 0);
				
				return $json;
			} else {
				$json['results'] = [];
				if($includestats) {
					$json['stats'] = null;
				}
				$json['num'] = 0;
			}
			$stmt->close();
		} else if(!empty($afterdate) && empty($beforedate)) {
			$stmt = $this->db->getDb()->prepare("Select * from " .$table. " WHERE date > ? order by id DESC LIMIT ?");
			$afterdate .= " 00:00:00";
			$stmt->bind_param("si", $afterdate, $maxresults);
			$stmt->execute();
			$result = $stmt->get_result();
			if (mysqli_num_rows($result) > 0) {
				$json['results'] = $this->getRes($result, $units);
				if($includestats) {
					mysqli_data_seek($result, 0);
					$json['stats'] = $this->calculateStats($result, $units);
				}
				$json['num'] = mysqli_num_rows($result);
				mysqli_data_seek($result, 0);
				
				
			} else {
				$json['results'] = [];
				if($includestats) {
					$json['stats'] = null;
				}
				$json['num'] = 0;
			}
			$stmt->close();
		} else if(!empty($afterdate) && !empty($beforedate)) {
			$stmt = $this->db->getDb()->prepare("Select * from " .$table. " WHERE date BETWEEN ? and ? order by id DESC LIMIT ?");
			$afterdate .= " 00:00:00";
			$beforedate .= " 00:00:00";
			$stmt->bind_param("ssi", $afterdate, $beforedate, $maxresults);
			$stmt->execute();
			$result = $stmt->get_result();
			if (mysqli_num_rows($result) > 0) {
				$json['results'] = $this->getRes($result, $units);
				if($includestats) {
					mysqli_data_seek($result, 0);
					$json['stats'] = $this->calculateStats($result, $units);
				}
				$json['num'] = mysqli_num_rows($result);
				mysqli_data_seek($result, 0);
				
				
			} else {
				$json['results'] = [];
				if($includestats) {
					$json['stats'] = null;
				}
				$json['num'] = 0;
			}
			$stmt->close();
		} else {
			$stmt = $this->db->getDb()->prepare("Select * from " .$table. " WHERE date < ? order by id DESC LIMIT ?");
			$beforedate .= " 00:00:00";
			$stmt->bind_param("si", $beforedate, $maxresults);
			$stmt->execute();
			$result = $stmt->get_result();
			if (mysqli_num_rows($result) > 0) {
				$json['results'] = $this->getRes($result, $units);
				if($includestats) {
					mysqli_data_seek($result, 0);
					$json['stats'] = $this->calculateStats($result, $units);
				}
				$json['num'] = mysqli_num_rows($result);
				mysqli_data_seek($result, 0);
				
				
			} else {
				$json['results'] = [];
				if($includestats) {
					$json['stats'] = null;
				}
				$json['num'] = 0;
			}
			$stmt->close();
		}
		$json['table'] = $table;
		
		return $json;
	}
	
	public function getRes($result, $units){
		$arr = array();
		while($row = $result->fetch_assoc()){
			if($units === "fahrenheit"){
				$temp = ($row['temperature'] * 9/5) + 32;
			} else {
				$temp = $row['temperature'];
			}
			$val['temperature'] = round($temp, 1);
			$val['humidity'] = round($row['humidity'], 1);
			$val['date'] = $row['date'];
		array_push($arr, $val);
		}
		return $arr;
	}
	
	public function calculateStats($result, $units){
		$averageTemp = 0;
		$highTemp = -INF;
		$lowTemp = INF;
		$averageHumid = 0;
		$highHumid = -INF;
		$lowHumid = INF;
		
			while($row = $result->fetch_assoc()){
				if($units === "fahrenheit"){
				$temp = ($row['temperature'] * 9/5) + 32;
				} else {
					$temp = $row['temperature'];
				}
				$averageTemp = $averageTemp + $temp;
				$averageHumid = $averageHumid + $row['humidity'];
				if($temp > $highTemp) {
					$highTemp = $temp;
				}
				if($temp < $lowTemp){
					$lowTemp = $temp;
				}
				if($row['humidity'] > $highHumid){
					$highHumid = $row['humidity'];
				}
				if($row['humidity'] < $lowHumid){
					$lowHumid = $row['humidity'];
				}
			}
			$averageTemp = round($averageTemp / mysqli_num_rows($result), 1);
			$averageHumid = round($averageHumid / mysqli_num_rows($result), 1);
		
		$json['average_temp'] = $averageTemp;
		$json['high_temp'] = round($highTemp, 1);
		$json['low_temp'] = round($lowTemp, 1);
		$json['average_humid'] = $averageHumid;
		$json['high_humid'] = $highHumid;
		$json['low_humid'] = $lowHumid;
		return $json;
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
