#pragma strict
//private var hitDirection : float;
private var myChar : GameObject;
private var charCtrl : CharCtrl;
private var hitX : float;
private var hitY : float;
private var topHit : boolean = false;
var hitForce : float = 200f;

function Awake () {
	myChar = transform.parent.gameObject;
	charCtrl = myChar.GetComponent(CharCtrl);
}

function Update () {

}

function HitTop()
{
	hitY = -1;
	topHit = true;
}

function OnTriggerEnter2D(wallCol: Collider2D)
{
	if (wallCol.gameObject.tag == "Floor")
	{
		if(charCtrl.grounded)
			return;

		Debug.Log("touched side");
		if(!topHit)
		{
			if(charCtrl.facingRight)
				hitX = -1;
			else
				hitX = 1;
		}
		
		SendMessageUpwards("TouchFloor");
		charCtrl.canJet = false;
		//hitDirection = wallCol.transform.position.x - transform.position.x;
		//hitDirection = hitDirection / Mathf.Abs(hitDirection);
		myChar.rigidbody2D.AddForce(new Vector2(hitX * hitForce, hitY * hitForce *0.4));
	}
}

function OnTriggerExit2D(wallCol: Collider2D)
{
	if (wallCol.gameObject.tag == "Floor")
	{
		charCtrl.canJet = true;
		hitX = 0;
		hitY = 0;
		topHit = false;
	}
}