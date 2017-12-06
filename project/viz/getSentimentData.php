<?
include("connectServer.php");

echo "year,value\n";
$first = true;
$req = $bdd->prepare('SELECT year,value FROM ADAsentiments WHERE genre = "' . $_GET['genre'] . '"');
$req->execute();
while ($data = $req->fetch()) {
	echo $data['year'] . "," . $data['value'] . "\n";
}
?>