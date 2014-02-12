#pragma strict
 var maxAliensOut : int = 10;

function Start () {
	SpawnAliens();
}


function SpawnAliens()
{
	var n : int = Random.Range(4,maxAliensOut);

	Debug.Log(n);
	
	var usedN : int[] = new int[transform.childCount];
	
	for(var i:int = 0; i<transform.childCount; i++)
	{
		usedN[i] = i;
	}
	
	RandomizeList(usedN);


	for(var j:int = 0; j<n; j++)
	{
		var alien : GameObject = transform.GetChild(usedN[j]).gameObject;
		Destroy(alien);
	}
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