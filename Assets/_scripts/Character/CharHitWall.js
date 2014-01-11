#pragma strict
private var hitDirection : float;
private var myChar : GameObject;
private var charCtrl : CharCtrl;
var hitForce : float = 200f;

function Awake () {
	myChar = transform.parent.gameObject;
	charCtrl = myChar.GetComponent(CharCtrl);
}

function Update () {

}

function OnTriggerEnter2D(wallCol: Collider2D)
{
	if (wallCol.gameObject.tag == "Floor")
	{
		SendMessageUpwards("TouchFloor");
		charCtrl.canJet = false;
		hitDirection = wallCol.transform.position.x - transform.position.x;
		hitDirection = hitDirection / Mathf.Abs(hitDirection);
		myChar.rigidbody2D.AddForce(new Vector2(hitDirection * -hitForce, -50));
	}
}

function OnTriggerExit2D(wallCol: Collider2D)
{
	if (wallCol.gameObject.tag == "Floor")
		charCtrl.canJet = true;
}