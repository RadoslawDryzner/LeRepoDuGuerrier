<?
include("connectServer.php");

echo "year,value\n";
$first = true;
$req = $bdd->prepare('SELECT year,value FROM ADAwords WHERE genre = "' . $_GET['genre'] . '" AND word = "' . $_GET['word'] . '"');
$req->execute();
while ($data = $req->fetch()) {
	echo $data['year'] . "," . $data['value'] . "\n";
}
?>