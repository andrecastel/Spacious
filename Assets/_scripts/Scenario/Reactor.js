#pragma strict

var myLight : Light;
var origIntensity : float;
var charCloseBy : boolean = false;
var picked : boolean = false;

function Awake () {
	origIntensity = myLight.intensity;
	myLight.intensity = 0;
}

function LightOn()
{

	while(myLight.intensity < origIntensity)
	{
		myLight.intensity += 0.05;
		yield;
	}

	myLight.intensity = origIntensity;
}

function LightOff()
{

	while(myLight.intensity > 0)
	{
		myLight.intensity -= 0.05;
		yield;
	}

	myLight.intensity = 0;
}

function CharClose(state : boolean)
{
	if(charCloseBy == state)
		return;

	charCloseBy = state;

	if(state)
		LightOn();
	else
		LightOff();

}

function OnTriggerEnter2D (charCol : Collider2D)
{

	if(charCol.gameObject.tag == "Player")
	{
		if(picked)
			return;

		picked = true;
		
		var myChar : CharCtrl = charCol.gameObject.GetComponent(CharCtrl);

		if(myChar.charDead)
			return;

		//send message to char
		myChar.PickedReactor();

		//wait
		yield WaitForSeconds(0.2);

		//destroy
		Destroy(gameObject);
	}
}