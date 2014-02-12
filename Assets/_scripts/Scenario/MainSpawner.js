#pragma strict

var spriteCol : BoxCollider2D;
var mySprite : GameObject;
var mySound : AudioSource;
var doorPos: Transform; 
var guiInfo : SpriteRenderer;
var guiMission : TextMesh;
var guiReactor : SpriteRenderer;
var guiShown : boolean = true;

function Awake () {
	spriteCol = mySprite.GetComponent(BoxCollider2D);
	mySprite.animation["spawner"].wrapMode = WrapMode.Loop;
	mySound = GetComponent(AudioSource);

	transform.position = doorPos.position;

	iTween.Init(gameObject);

	mySprite.renderer.enabled = false;

	guiMission.renderer.sortingLayerID = 7;

	guiReactor.animation["reactor_pulse"].wrapMode = WrapMode.Loop;

	GuiShow(0);
}

function Update () {

}

function Spawning()
{
	mySound.Play();
}

function Collect()
{

	gameObject.tag = "Untagged";
}

function GoDown()
{
	mySprite.renderer.enabled = true;
	yield WaitForSeconds(1f);
	iTween.MoveTo(gameObject,{"y": 0.7, "time": 5.0,  "ignoretimescale" : true});
	GuiShow(1);
}

function GoUp()
{
	iTween.MoveTo(gameObject,{"y": doorPos.position.y, "time": 5.0, "ignoretimescale" : true});
	GuiShow(0);
}

function OnTriggerEnter2D (charCol : Collider2D)
{
	if(charCol.gameObject.tag == "Player")
	{
		charCol.SendMessage("Touching", "MainSpawner");
		if(!guiShown)
		{
			guiShown = true;
			GuiShow(1);
		}
	}
}

function OnTriggerExit2D(charCol: Collider2D)
{
	if (charCol.gameObject.tag == "Player")
	{
		charCol.SendMessage("Touching", "");
		if(guiShown)
		{
			guiShown = false;
			GuiShow(0);
		}
	}
}

function GuiShow(show : float)
{
	guiInfo.color.a = show;
	guiMission.color.a = show;
	guiReactor.color.a = show;
}