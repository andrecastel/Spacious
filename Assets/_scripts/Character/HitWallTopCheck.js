#pragma strict

function Start () {

}

function OnTriggerEnter2D(wallCol: Collider2D)
{
	if (wallCol.gameObject.tag == "Floor")
	{
		SendMessageUpwards("HitTop");
	}
}