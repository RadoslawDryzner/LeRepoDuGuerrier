<?
include("connectServer.php");

echo "year,value\n";
$req = $bdd->prepare('SELECT * FROM ADAtest ORDER BY year');
$req->execute();
while ($data = $req->fetch()) {
	echo $data['year'] . "," . $data['value'] . "\n";
}
?>