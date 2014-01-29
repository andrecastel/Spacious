#pragma strict

private var mainC : GameObject;
private var mainCTRL : MainCtrl;

var guiLayout : Transform;
var guiHealth : Transform;
var guiFuel : Transform;
var guiLive : TextMesh;
var guiCrystals : TextMesh;
var guiTimer : TextMesh;
var guiTexter : TextMesh;

function Awake ()
{
	if (mainC == null)
		mainC = GameObject.Find("MainCtrl");
	
	mainCTRL = mainC.GetComponent(MainCtrl);

	//make the gui text show in front of everythig
	guiLive.renderer.sortingLayerID = 7;
	guiCrystals.renderer.sortingLayerID = 7;
	guiTimer.renderer.sortingLayerID = 7;
	guiTexter.renderer.sortingLayerID = 7;
}

function Start()
{
	ShowGUI(false);
	guiTexter.color.a = 0;
}

function Update ()
{

}

function TitleScreen()
{
	//show title
	
	//show message "press space to start"
	NewText("PRESS 'SPACE' TO START");
	//show Credits
}

function NewGame()
{
	//show normal HUD
	ShowGUI(true);
}

function GameOver()
{
	//show game over message
	
	//show score
	ShowScore();
}

function ShowScore()
{
	
}

function DeadRespawn()
{
	//press any button to spawn a new clone
	NewText("PRESS ANY KEY TO SPAWN A NEW CLONE");
}


function ChangeLives(newLive: int)
{
	
}

function ChangeCrystals(newCrystal : int)
{

}

function NewText(newT : String)
{
	guiTexter.text = newT;

	while(guiTexter.color.a < 255)
	{
		guiTexter.color.a += 0.01;
		yield;
	}

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