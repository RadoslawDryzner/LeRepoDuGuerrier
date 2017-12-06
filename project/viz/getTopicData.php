<?
include("connectServer.php");

echo "year,value\n";
$first = true;
$req = $bdd->prepare('SELECT year,value FROM ADAtopics WHERE genre = "' . $_GET['genre'] . '" AND topic = "' . $_GET['topic'] . '"');
$req->execute();
while ($data = $req->fetch()) {
	echo $data['year'] . "," . $data['value'] . "\n";
}
?>