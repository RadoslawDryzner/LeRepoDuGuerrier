<?php

echo "year,value\n";

for($i = 1900; $i <= 2020; $i += 10) {
	echo $i . "," . mt_rand() / mt_getrandmax() . "\n";
}

?>