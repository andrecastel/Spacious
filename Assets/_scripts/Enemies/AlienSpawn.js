#pragma strict
 var maxAliensOut : int = 10;

function Start () {
	yield;
	SpawnAliens();
	yield;
	if(PlayerPrefsX.GetBool("saved"))
		LoadAliens();
}


function SpawnAliens()
{
	var n : int = Random.Range(4,maxAliensOut);
	
	var usedN : int[] = new int[transform.childCount];
	
	for(var i:int = 0; i<transform.childCount; i++)
	{
		usedN[i] = i;
	}
	
	RandomizeList(usedN);
	
	if(PlayerPrefsX.GetBool("saved"))
	{
		n = PlayerPrefs.GetInt("aliensN");
		usedN = PlayerPrefsX.GetIntArray("aliensUsedN");
	}


	for(var j:int = 0; j<n; j++)
	{
		var alien : GameObject = transform.GetChild(usedN[j]).gameObject;
		Destroy(alien);
	}
	
	PlayerPrefs.SetInt("aliensN", n);
	PlayerPrefsX.SetIntArray("aliensUsedN", usedN);
}

function LoadAliens()
{
	
}

function RandomizeList(arr : int[])
{
    for (var i = arr.Length - 1; i > 0; i--) {
        var r = Random.Range(0,i);
        var tmp = arr[i];
        arr[i] = arr[r];
        arr[r] = tmp;
    }
}