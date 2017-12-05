<?
include("connectServer.php");

echo "[";
$first = true;
$req = $bdd->prepare('SELECT DISTINCT word FROM ADAwords WHERE genre = "' . $_GET['genre'] . '"');
$req->execute();
while ($data = $req->fetch()) {
	if ($first) {
		$first = false;
	}
	else {
		echo ",";
	}
	echo '"' . $data['word'] . '"';
}
echo "]";
?>