#pragma strict

var reactor : GameObject;


function Start () {
	PickRandomRock();
}


function PickRandomRock()
{
	var n : int = Random.Range(0, transform.childCount);
	var rock : GameObject = transform.GetChild(n).gameObject;
	
	
	var reactorPicked : boolean = PlayerPrefsX.GetBool("reactorCol");
	if(!reactorPicked)
	{
		var newRector : GameObject = Instantiate(reactor, rock.transform.position, Quaternion.identity);
		
		PlayerPrefsX.SetVector3("reactorPos", rock.transform.position);
	}
	
	Destroy(rock);
	rock = null;
}