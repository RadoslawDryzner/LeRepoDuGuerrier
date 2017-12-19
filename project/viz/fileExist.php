<?
if (file_exists(str_replace("_", "&", $_GET['file']))) {
	echo "true";
}
else {
	echo "false";
}
?>