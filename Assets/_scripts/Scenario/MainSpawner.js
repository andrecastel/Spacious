#pragma strict

var spriteCol : BoxCollider2D;
var mySprite : GameObject;
var mySound : AudioSource;
var doorPos: Transform; 

function Awake () {
	spriteCol = mySprite.GetComponent(BoxCollider2D);
	mySprite.animation["spawner"].wrapMode = WrapMode.Loop;
	mySound = GetComponent(AudioSource);

	transform.position = doorPos.position;

	iTween.Init(gameObject);

	mySprite.renderer.enabled = false;
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
	iTween.MoveTo(gameObject,{"y": 0.7, "time": 5.0});
}

function GoUp()
{
	iTween.MoveTo(gameObject,{"y": doorPos.position.y, "time": 5.0});
}

function OnTriggerEnter2D (charCol : Collider2D)
{
	if(charCol.gameObject.tag == "Player")
		charCol.SendMessage("Touching", "MainSpawner");
}

function OnTriggerExit2D(charCol: Collider2D)
{
	if (charCol.gameObject.tag == "Player")
		charCol.SendMessage("Touching", "");
}