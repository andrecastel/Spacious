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
	
	scTime.text = guiCTRL.textTimer;
	scClones.text = (mainCTRL.maxLives - mainCTRL.livesCount).ToString();
	scFuel.localScale = Vector3(1-guiCTRL.fuelMeter, 1, 1);
	scCrystals.text = mainCTRL.crystalCount.ToString();
	scPoints.text = SetPoints().ToString();
	ShowScoreGUI(true);
}

function Update ()
{

}

function SetPoints() : int
{
	var ptCrystals : int = mainCTRL.crystalCount * 15;
	var ptClones : int = mainCTRL.livesCount * 10;
	var ptFuel : int = guiCTRL.fuelMeter * 15;
	var ptTime : int = guiCTRL.minutes * 0.7;

	var totalPoints : int = Mathf.Floor(ptCrystals + ptClones + ptFuel - ptTime);

	if(mainCTRL.crystalCount == 0)
		totalPoints = 0;

	if(mainCTRL.reactorCollected)
		totalPoints += 50;

	//temp
	Debug.Log("time - " + guiCTRL.theTime);

	if(mainCTRL.shipFixed)
	{
		totalPoints += 100;
		Application.ExternalCall("kongregate.stats.submit","Time",Mathf.Floor(guiCTRL.theTime));
		Application.ExternalCall("kongregate.stats.submit","Fuel",Mathf.Floor(scFuel.localScale[0] *100));
		Application.ExternalCall("kongregate.stats.submit","ShipFixed",1);
	}

	Application.ExternalCall("kongregate.stats.submit","Crystals",mainCTRL.crystalCount);

	Application.ExternalCall("kongregate.stats.submit","Score",totalPoints);
	return totalPoints;
}

function ShowScoreGUI(state : boolean)
{
	for (var child : Transform in scoreLayout.transform)
		child.gameObject.SetActive(state);

	scoreLayout.gameObject.SetActive(state);
}