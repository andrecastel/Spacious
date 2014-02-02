#pragma strict

private var guiCTRL : GUICtrl;
private var mainCTRL : MainCtrl;

var scoreLayout : Transform;
var scFuel : Transform;
var scClones : TextMesh;
var scCrystals : TextMesh;
var scPoints : TextMesh;
var scTime : TextMesh;

function Awake ()
{
	if (mainCTRL == null)
		mainCTRL = GameObject.Find("MainCtrl").GetComponent(MainCtrl);

	guiCTRL = GetComponent(GUICtrl);

	//make the gui text show in front of everythig
	scClones.renderer.sortingLayerID = 7;
	scCrystals.renderer.sortingLayerID = 7;
	scPoints.renderer.sortingLayerID = 7;
	scTime.renderer.sortingLayerID = 7;
}

function Start ()
{
	ShowScoreGUI(false);
}

function SetScore()
{
	scPoints.text = SetPoints().ToString();
	scTime.text = guiCTRL.textTimer;
	scClones.text = (mainCTRL.livesCount - mainCTRL.maxLives).ToString();
	scFuel.localScale = Vector3(1-guiCTRL.fuelMeter, 1, 1);
	scCrystals.text = mainCTRL.crystalCount.ToString();

	ShowScoreGUI(true);
}

function Update ()
{

}

function SetPoints() : int
{
	var ptCrystals : int = mainCTRL.crystalCount * 5;
	var ptClones : int = mainCTRL.livesCount * 30;
	var ptFuel : int = guiCTRL.fuelMeter * 100;
	var ptTime : int = guiCTRL.minutes * 4;

	var totalPoints : int = ptCrystals + ptClones + ptFuel - ptTime;

	if(mainCTRL.crystalCount == 0)
		totalPoints = 0;

	return totalPoints;
}

function ShowScoreGUI(state : boolean)
{
	for (var child : Transform in scoreLayout.transform)
		child.gameObject.SetActive(state);

	scoreLayout.gameObject.SetActive(state);
}