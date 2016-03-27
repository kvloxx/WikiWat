<?php
echo "<pre>";
print_r($_POST);
	if (isset($_POST['guess'])) {
		if (strlen($_POST['guess']) <= 256 && strlen($_POST['guess'])>=1)
			$guess = strip_tags(trim($_POST['guess']));
	}
	
?>