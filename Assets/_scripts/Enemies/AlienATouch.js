#pragma strict
private var touched : boolean = false;
private var bodyAnim : Animator;

function Awake () {
	bodyAnim = GetComponent(Animator);
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
	
	if(myCol.gameObject.tag == "Bomb")
	{
		touched = true;
		SendMessageUpwards("StopAlien");
		myCol.gameObject.rigidbody2D.isKinematic = true;
		myCol.gameObject.renderer.enabled = false;
		bodyAnim.SetTrigger("Eat");
	}
}

function BackToNormal()
{
	touched = false;
}

function Explode()
{
	SendMessageUpwards("KillAlien");
}