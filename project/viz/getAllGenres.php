<?
include("connectServer.php");

echo "[";
$first = true;
$req = $bdd->prepare('SELECT DISTINCT genre FROM ADAwords');
$req->execute();
while ($data = $req->fetch()) {
	if ($first) {
		$first = false;
	}
	else {
		echo ",";
	}
	echo '"' . $data['genre'] . '"';
}
echo "]";
?>