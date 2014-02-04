#pragma strict

var reactor : GameObject;


function Start () {
	PickRandomRock();
}


function PickRandomRock()
{
	var n : int = Random.Range(0, transform.childCount);
	var rock : GameObject = transform.GetChild(n).gameObject;
	
	var newRector : GameObject = Instantiate(reactor, rock.transform.position, Quaternion.identity);
	Destroy(rock);
	rock = null;
}