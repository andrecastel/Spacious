#pragma strict

var myRenderer : SpriteRenderer;
var spriteDestroied : Sprite;
var aCrystal : GameObject;
var crystalsNum : int = 6;
public var myChar : GameObject;
private var exploding : boolean = false;

function Awake ()
{
	myRenderer = GetComponent(SpriteRenderer);
}

function Update () {

}

function GonnaExplode(){
	exploding = true;
	TouchingChar(false);
}

function Explode()
{
	//Debug.Log("XPLODE");
	MakeCrystals();
	myRenderer.sprite = spriteDestroied;
	gameObject.layer = 0;
	Destroy(this);
}

function OnTriggerEnter2D(myCol: Collider2D)
{
	if (myCol.gameObject.tag == "Player" && !exploding)
	{
		if(myChar == null)
			myChar = myCol.gameObject;

		SendMessage("TouchingChar", true);
	}
}

function OnTriggerExit2D(myCol: Collider2D)
{
	if (myCol.gameObject.tag == "Player")
		SendMessage("TouchingChar", false);
}

function TouchingChar(state : boolean)
{
	if(myChar == null)
		return;

	if(state)
		myChar.SendMessage("Touching", "Rock");
	else
		myChar.SendMessage("Touching", "");
}

function MakeCrystals()
{
	//throw some crystals around
	var numCrystals = Random.Range(crystalsNum-2, crystalsNum);
	
	//pra metade dos cristais que o char tem
	for(var i: int = 0; i < numCrystals; i++)
	{
		//instantiate it
		var dropCrystal : GameObject = Instantiate(aCrystal, transform.position, Quaternion.identity);
		//random force
		var randX: float = Random.Range(-200, 200);
		var randY: float = Random.Range(100, 150);
		//add force
		dropCrystal.rigidbody2D.AddForce(new Vector2(randX, randY));
	}
	
}