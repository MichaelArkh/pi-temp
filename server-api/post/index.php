<?php
    
    require_once 'temp.php';
    
	
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	$token = $obj['token'];
	$temp = $obj['temp'];
	$humidity = $obj['humidity'];
	$table = $obj['table'];
	
    $tempObject = new Temp();
    
	if(!empty($token) && !empty($temp) && !empty($humidity) && !empty($table)){
		
		$value = $tempObject->storeTemp($token, $temp, $humidity, $table);
		
		echo json_encode($value);
	}
    ?>