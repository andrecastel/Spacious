#pragma strict
var picked : boolean = false;
var myCol : BoxCollider2D;
var canCollect : boolean = true;

function Awake () {
	myCol = GetComponent(BoxCollider2D);
}

function Start ()
{

	transform.localScale = new Vector3(Random.Range(0.8, 1.2), Random.Range(0.7, 1.2), 1);
}

function OnCollisionEnter2D (charCol : Collision2D)
{

	if(charCol.gameObject.tag == "Player")
	{
		if(picked)
			return;

		var myChar : CharCtrl = charCol.gameObject.GetComponent(CharCtrl);

		if(myChar.charDead)
			return;

		//send message to char
		myChar.PickedCrystal(canCollect);

		picked = true;

		//colliders to trigger
		myCol.isTrigger = true;

		//add force up
		rigidbody2D.AddForce(new Vector2(0, 200));

		//wait
		yield WaitForSeconds(0.4);

		//destroy
		Destroy(gameObject);
	}
}

function Collectable(state : boolean)
{
	canCollect = state;
}