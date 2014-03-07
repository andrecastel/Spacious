#pragma strict

var reactor : GameObject;


function Start () {
	yield;
	PickRandomRock();
}


function PickRandomRock()
{
	var n : int = Random.Range(0, transform.childCount);
	
	var reactorPicked : boolean = false;
	
	if(PlayerPrefsX.GetBool("saved"))
	{
		n = PlayerPrefs.GetInt("reactorRock");
		reactorPicked = PlayerPrefsX.GetBool("reactorCol");
	}
		
	var rock : GameObject = transform.GetChild(n).gameObject;
	
	if(!reactorPicked)
	{
		var newRector : GameObject = Instantiate(reactor, rock.transform.position, Quaternion.identity);
		
		PlayerPrefsX.SetVector3("reactorPos", rock.transform.position);
	}
	
	Destroy(rock);
	rock = null;
	
	PlayerPrefs.SetInt("reactorRock", n);
}