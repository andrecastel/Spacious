#pragma strict

function Start () {

}

function Update () {

}

function OnTriggerEnter2D(myCol: Collider2D)
{
	if (myCol.gameObject.tag == "Player")
		SendMessageUpwards("CharCloseBy", true);
}

function OnTriggerExit2D(myCol: Collider2D)
{
	if (myCol.gameObject.tag == "Player")
		SendMessageUpwards("CharCloseBy", false);
}