#pragma strict

var myText : TextMesh;
var textArr : Array = new Array();
var counter : int = 0;

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

function ShowCharText(newText : String) //adiciona um novo texto a lista
{
	
	if(textArr.length > 0)
	{
		if(newText == textArr[textArr.length-1])
			return;
	}

	textArr.Push(newText);
	
	if(textArr.length == 1)
		PrintText();
	
}

function PrintText() //mostra o texto
{
	var speech : String = textArr[counter];
	
	myText.text = speech;
	myText.color.a = 1;
	
	var textWords :String[] = speech.Split(" "[0]);
	
	yield WaitForSeconds(speech.Length * 0.15);
	
	counter ++;
	
	CheckList();
}

function CheckList() //verifica se tem mais na lista
{
	if(textArr.length > counter)
		PrintText();
	else
	{
		HideText();
		counter = 0;
		textArr = new Array();
	}
	
}