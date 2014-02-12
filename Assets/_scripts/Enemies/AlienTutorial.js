#pragma strict

var charClose : boolean = false;
var mainAlien : AlienACtrl;
var text1Show : boolean = false;
var text2Show : boolean = false;

function Awake () {
	mainAlien = GetComponent(AlienACtrl);
}

function FixedUpdate ()
{
	
	if(text2Show)
		return;
	
	if(charClose)
	{
		if (mainAlien.attacking)
		{
			if(!text2Show)
			{
				ShowTutorial();
				text2Show = true;
			}
		}
	}
}

function CharCloseBy(state : boolean)
{
	
	if(charClose == state)
		return;
	
	charClose = state;

	if(charClose)
	{
		if(!text1Show)
		{
			text1Show = true;

			mainAlien.myChar.SendMessage("LightOff");

			mainAlien.myChar.SendMessage("ShowCharText", "System failing on me again?");

			yield WaitForSeconds(3f);

			mainAlien.myChar.SendMessage("ShowCharText", "Fixed it");

			mainAlien.myChar.SendMessage("LightOn");
		}
		
	}else{
		mainAlien.myChar.SendMessage("HideText");
	}
}

function ShowTutorial()
{
	mainAlien.myChar.SendMessage("ShowCharText", "I don't wanna get too \n close to this... THING");
}