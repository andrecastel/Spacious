#pragma strict

var myText : TextMesh;
var showNew : boolean = false;

function Awake () {
	HideText();
	myText.renderer.sortingLayerID = 7;
}

function Update () {

}

function HideText()
{
	myText.text = "";
	myText.color.a = 0;
}

function ShowCharText(speech : String)
{
	
	showNew = true;
	
	myText.text = speech;
	myText.color.a = 1;
	
	var textWords :String[] = speech.Split(" "[0]);
	
	yield WaitForSeconds(speech.Length * 0.1);
	
	showNew = false;
	
	if (!showNew)
		HideText();
}