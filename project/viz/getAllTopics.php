<?
include("connectServer.php");

echo "[";
$first = true;
$req = $bdd->prepare('SELECT DISTINCT topic FROM ADAtopics WHERE genre = "' . $_GET['genre'] . '"');
$req->execute();
while ($data = $req->fetch()) {
	if ($first) {
		$first = false;
	}
	else {
		echo ",";
	}
	echo '"' . $data['topic'] . '"';
}
echo "]";
?>