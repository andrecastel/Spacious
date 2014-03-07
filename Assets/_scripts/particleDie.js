#pragma strict

var counter : float = 0;
var mySc : float = 0;

function Start () {
	counter = 0;
}

function Update () {
	counter += 0.05;

	
	if(counter < 3)
	{
		transform.localScale = Vector3(1-counter/3,1-counter/6,0.5-counter/6);
		//alpha goes down
	}else
		Destroy(gameObject);
}