<?php
    
    require_once 'temp.php';
    header('Content-Type: application/json');
	$afterdate = $_GET['from'];
	$beforedate = $_GET['before'];
	$maxresults = $_GET['count'];
	$table = $_GET['room'];
	$includestats = $_GET['statistics'];
	$units = $_GET['units'];
	
    $tempObject = new Temp();
	
	if(empty($maxresults)){
		$maxresults = 10;
	}
	if(empty($table)){
		$table = "bedroom";
	}
	if(empty($includestats)){
		$includestats = true;
	}
	if(empty($units)){
		$units = "fahrenheit";
	}
    
	$value = $tempObject->getData($afterdate, $beforedate, $maxresults, $table, $includestats, $units);
	echo json_encode($value, JSON_PRETTY_PRINT);
	
    ?>