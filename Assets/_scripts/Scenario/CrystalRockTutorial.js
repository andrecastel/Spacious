#pragma strict
var rockMain : CrystalRock;
var msgShown : boolean = false;

function Awake () {
	rockMain = GetComponent(CrystalRock);
}

function Update () {

}

function TouchingChar(state : boolean)
{
	if(rockMain.myChar == null)
		return;

	if(state)
	{
		if(msgShown)
			return;

		msgShown = true;

		rockMain.myChar.SendMessage("ShowCharText", "I could try using a BOMB\n on this crystal rock");
	}
	else
	{
		yield WaitForSeconds(3f);
		msgShown = false;
	}
}