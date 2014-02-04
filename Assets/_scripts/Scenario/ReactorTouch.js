#pragma strict

function Start () {

}

function Update () {

}

function OnTriggerEnter2D(myCol: Collider2D)
{
	if (myCol.gameObject.tag == "Player")
		SendMessageUpwards("CharClose", true);
}

function OnTriggerExit2D(myCol: Collider2D)
{
	if (myCol.gameObject.tag == "Player")
		SendMessageUpwards("CharClose", false);
}