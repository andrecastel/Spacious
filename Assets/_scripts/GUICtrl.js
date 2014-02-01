#pragma strict

private var mainCTRL : MainCtrl;
private var charCTRL : CharCtrl;

var guiLayout : Transform;
var guiHealth : GameObject;
var guiFuel : Transform;
var guiLive : TextMesh;
var guiCrystals : TextMesh;
var guiTimer : TextMesh;
var guiTexter : TextMesh;
var blackScreen : GUITexture;

var credits : TextMesh[];
var healthBars : GameObject[];
public var maxHealth : int;

var startTime : float;
var theTime : float = 0;
var textTimer : String;
var timing : boolean = false;

var hours : int;
private var minutes : int;
private var seconds : int;

private var fuelMeter : float = 1.0;
private var fuelWaste : float = -0.0001;

function Awake ()
{
	if (mainCTRL == null)
		mainCTRL = GameObject.Find("MainCtrl").GetComponent(MainCtrl);

	if (charCTRL == null)
		charCTRL = GameObject.Find("Character").GetComponent(CharCtrl);

	//make the gui text show in front of everythig
	guiLive.renderer.sortingLayerID = 7;
	guiCrystals.renderer.sortingLayerID = 7;
	guiTimer.renderer.sortingLayerID = 7;
	guiTexter.renderer.sortingLayerID = 7;

	for(var i : int = 0; i < credits.length; i++)
	{
		var cre : TextMesh = credits[i];
		cre.renderer.sortingLayerID = 7;
	}

	CreateHealth();

	iTween.Init(gameObject);

	blackScreen.color.a = 1.0;

	guiTexter.color.a = 0;
}

function Start()
{
	ShowGUI(false);	
}

function FixedUpdate ()
{
	if(charCTRL.jetOn)
	{
		if(fuelMeter > 0)
		{
			fuelMeter += fuelWaste;
			guiFuel.localScale = Vector3(fuelMeter, 1, 1);
		}
	}
}

function Update()
{
	if(timing)
	{
		theTime = Time.time - startTime;
		hours = theTime / 360;
		minutes = theTime / 60;
		seconds = theTime % 60;

		textTimer = String.Format("{0:0}:{1:00}:{2:00}", hours, minutes, seconds);
		guiTimer.text = textTimer;
	}

}

function TitleScreen()
{
	FadeIn();

	//show title
	//ShowCredits(true);

	//show message "press space to start"
	NewText("PRESS 'SPACE' TO START");

	//show Credits

}

function NewGame()
{
	//show normal HUD
	ShowGUI(true);

	//start timer
	startTime = Time.time;
	timing = true;
}

function GameOver()
{
	//show game over message
	

	yield WaitForSeconds(1f);
	//show score
	ShowScore();
}

function ShowScore()
{
	NewText("PRESS 'SPACE' TO RESTART");
}

function DeadRespawn()
{
	//press any button to spawn a new clone
	NewText("PRESS ANY KEY TO SPAWN A NEW CLONE");
}


function ChangeLives(newLive: int)
{
	guiLive.text = newLive.ToString();
}

function ChangeCrystals(newCrystal : int)
{
	guiCrystals.text = newCrystal.ToString();
}

function ChangeHealth(newHealth : int)
{
	for (var i : int = 0; i < healthBars.length; i++)
	{
		var hBar = healthBars[i];
		if(i < newHealth)
			hBar.renderer.enabled = true;
		else
			hBar.renderer.enabled = false;
	}
}

function NewText(newT : String)
{
	guiTexter.text = newT;
	guiTexter.color.a = 255;
}

function HideText()
{

	guiTexter.color.a = 0;
	guiTexter.text = "";
}

function ShowGUI(state : boolean)
{
	for (var child : Transform in guiLayout.transform)
		child.gameObject.SetActive(state);

	guiLayout.gameObject.SetActive(state);
}

function CreateHealth()
{
	if(maxHealth ==0)
		Debug.Log("Falha HEALTH");

	healthBars = new GameObject[maxHealth];

	for (var i: int = 0; i<maxHealth; i++)
	{
		var newBar : GameObject = Instantiate(guiHealth, guiHealth.transform.position, Quaternion.identity);
		newBar.transform.position.x += i *0.15;
		newBar.transform.parent = guiLayout;
		healthBars[i] = newBar;
		yield;
	}

	Destroy(guiHealth.gameObject);
}

function ShowCredits(state : boolean)
{
	for(var i : int = 0; i < credits.length; i++)
	{
		var cre : TextMesh = credits[i];
		cre.renderer.enabled = state;
	}
}

function FadeIn()
{
	blackScreen.color.a = 1;
	while (blackScreen.color.a > 0)
	{
		blackScreen.color.a -= 0.005;
		yield;
	}
	blackScreen.color.a = 0;

}

function FadeOut()
{
	
}