#pragma strict
private var touched : boolean = false;

function Start () {

}

function Update () {

}

function OnTriggerEnter2D(myCol: Collider2D)
{
	if (touched)
		return;

	if (myCol.gameObject.tag == "Player")
	{
		SendMessageUpwards("CharTouched");
		touched = true;
		yield;
	}
}

function BackToNormal()
{
	touched = false;
}