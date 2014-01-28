#pragma strict

var myCol : BoxCollider2D;
var mySprite : GameObject;
var mySound : AudioSource;

function Awake () {
	myCol = mySprite.GetComponent(BoxCollider2D);
	mySprite.animation["spawner"].wrapMode = WrapMode.Loop;
	mySound = GetComponent(AudioSource);
	myCol.isTrigger = true;
}

function Update () {

}

function Spawning()
{
	mySound.Play();
	myCol.isTrigger = false;

	yield WaitForSeconds(2f);

	myCol.isTrigger = true;
}

function Collect()
{
	yield WaitForSeconds(0.5f);

	Destroy(gameObject);
}