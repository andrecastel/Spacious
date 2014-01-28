#pragma strict
var picked : boolean = false;
var myCol : BoxCollider2D;

function Awake () {
	myCol = GetComponent(BoxCollider2D);
}

function Start ()
{

	transform.localScale = new Vector3(Random.Range(0.8, 1.2), Random.Range(0.7, 1.2), 1);

	picked = true;

	yield WaitForSeconds(1f);

	picked = false;

}

function OnCollisionEnter2D (charCol : Collision2D)
{

	if(charCol.gameObject.tag == "Player")
	{
		if(picked)
			return;

		var myChar = charCol.gameObject;
		
		//send message to char
		myChar.SendMessage("PickedCrystal");

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
