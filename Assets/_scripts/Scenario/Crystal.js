#pragma strict
var picked : boolean = false;
function Awake () {

}

function Start () {
	
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
		
		//destroy crystal
		Destroy(gameObject);
	}
}