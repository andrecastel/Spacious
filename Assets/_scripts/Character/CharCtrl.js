#pragma strict

//main ctrls
var mainCTRL : MainCtrl;
 
 //walking / moving
var maxWalkSpeed : float = 2.0;
var maxRunSpeed : float = 4.0;
var speedMultip : float = 1.0;
var myMaxSpeed : float;
var anim : Animator;
var jumpForce : float = 500f;
var deadSprite : Sprite;
var tilePrefab : GameObject;

private var move : float;
public var moveSpeed : float = 0;

//grounding
public var grounded : boolean = false;
var groundCheck : Transform;
var groundRadius : float = 0.2f;
var whatIsGround : LayerMask;

//effects
var jetParticle : ParticleSystem;
var landParticle : ParticleSystem;

//jet
var jetSFX : AudioClip;
var jetForce : float = 30f;
var jetFuel : float = 100f;
var jetFuelWaste : float = 0.3;
var jetBar : GameObject;
var jetColors : Color[];
private var jetBarRender : SpriteRenderer;
var hurtColor : Color;

private var jetUsed : float;

//LIGHT
var myLight : Light;
var lightIntensity : float;
private var myRenderer : SpriteRenderer;

//Crystal
var aCrystal : GameObject;
var aSpawner : GameObject;
var aBomb : GameObject;

//booleans
public var facingRight : boolean = true;
private var running : boolean = false;
private var hasJumped : boolean = false;
public var switchLight : boolean = true;
public var canJet : boolean = false;
public var jetOn : boolean = false;
public var charDead : boolean = false;
private var canRespawn : boolean = true;
public var canPlaceSpawn : boolean = true;
private var toCreateDead : boolean = false;

private var spawner : GameObject;
private var touchingAction : String = "";

//-------------------------------//
//-----------START
//-------------------------------//

function Awake ()
{

	mainCTRL = GameObject.Find("MainCtrl").GetComponent(MainCtrl);

	anim = GetComponent(Animator);
	myRenderer = GetComponent(SpriteRenderer);
	myMaxSpeed = maxWalkSpeed;
	jetOn = false;
	jetUsed = jetFuel;
	jetBarRender = jetBar.GetComponent(SpriteRenderer);
	lightIntensity = myLight.intensity;

	HideChildren();
	HideChar();

	charDead = true;
	anim.SetBool("Dead", true);
	jetBar.renderer.enabled = false;
}

function Start()
{
	//look for the spawner
	if(spawner == null)
		spawner = GameObject.FindWithTag ("Respawn");

	transform.position = spawner.transform.position;
}

//-------------------------------//
//-----------SPAWN
//-------------------------------//

function Spawn()
{
	//if char isn't dead, return
	if(!charDead || !canRespawn)
		return;
	
	yield;

	//look for the spawner
	if(spawner == null)
		spawner = GameObject.FindWithTag ("Respawn");
	
	//move the character to its position
	gameObject.transform.position = spawner.transform.position;

	yield;

	spawner.SendMessage("Spawning");
	anim.SetTrigger("Spawn");
	anim.SetBool("Dead", false);

	SendMessage("RenewHealth");

	//make every child active again
	for (var child : Transform in transform)
		child.gameObject.SetActive(true);

	jetBar.gameObject.SetActive(true);

	jetUsed = jetFuel;

	switchLight = true;
	
	//trigger spawning animation
	myRenderer.enabled = true;
	
	yield WaitForSeconds(0.3f);

	//char isn't dead anymore
	charDead = false;
	
}

function CanRespawn()
{
	canRespawn = true;
}

//-------------------------------//
//-----------MOVEMENT
//-------------------------------//

function FixedUpdate ()
{

	grounded = Physics2D.OverlapCircle(groundCheck.position, groundRadius, whatIsGround);
	anim.SetBool("Ground", grounded);
	anim.SetFloat("vSpeed", rigidbody2D.velocity.y);

	if(charDead)
	{
		move = 0;
		return;
	}
	
	move = Input.GetAxis ("Horizontal");
	
	jetBar.gameObject.transform.localScale = Vector3(1, jetUsed/100, 1);
	jetBarRender.color = Color.Lerp(jetColors[1], jetColors[0], jetUsed/100);
	if(jetUsed >= 100 && grounded)
		jetBar.renderer.enabled = false;
	else
		jetBar.renderer.enabled = switchLight;
	
	if(move != 0)
	{
		if(moveSpeed < myMaxSpeed)
			moveSpeed += Mathf.Abs(move) * 0.05;
		else
			moveSpeed = myMaxSpeed;
			
		anim.speed = 1 + moveSpeed/4;
	}else{
		moveSpeed = 0;
		anim.speed = 1;
	}
	
	anim.SetFloat("Speed", moveSpeed);
			
	rigidbody2D.velocity = new Vector2(moveSpeed * move * speedMultip, rigidbody2D.velocity.y);
	
	//FLIP
	if (move>0 && !facingRight)
		Flip();
	else if (move< 0 && facingRight)
		Flip();
		
	//TURN LIGHT
	if(switchLight && myLight.intensity != lightIntensity)
	{
		if(myLight.intensity < lightIntensity)
		{
			myLight.intensity +=0.02;
			myRenderer.color = Color.Lerp(Color.black, Color.white, myLight.intensity/lightIntensity);
		}
		else
		{
			myLight.intensity = lightIntensity;
			myRenderer.color = Color.white;
		}
	}
		
	//JET
	if(jetOn)
	{		
		jetParticle.emissionRate = 30;
		if(jetUsed > 0 && transform.position.y <= 4)
			jetUsed -= jetFuelWaste;
		else
		{
			//jetUsed = 0;
			canJet = false;
			jetOn = false;
		}

	}else{
	
		if(jetUsed < jetFuel)
			jetUsed += jetFuelWaste*0.4;
		else
			jetUsed = jetFuel;
		
		anim.SetBool("Jet", false);
		if (jetParticle.emissionRate > 0)
			jetParticle.emissionRate -= 0.5;
		else
			jetParticle.emissionRate = 0;
	}
	
}

function Update()
{
	if(charDead)
		return;
	
	//JUMP
	if(grounded && Input.GetKeyDown(KeyCode.Space))
	{
		anim.SetBool("Ground", false);
		SendMessage("Jump");
		rigidbody2D.AddForce(new Vector2(0, jumpForce));
		canJet = false;
		hasJumped = true;
		//canJet = true;
	} 
	
	if(!grounded && Input.GetKeyUp(KeyCode.Space))
	{
		jetOn = false;
		if(switchLight)		
			canJet = true;
	}
	
	if(!grounded && canJet && Input.GetKey(KeyCode.Space) && switchLight)
	{
		if(!jetOn)
		{
			jetOn = true;
			anim.SetBool("Jet", true);
		}
			
		//make go up
		if(rigidbody2D.velocity.y <=2 )
			rigidbody2D.AddForce(new Vector2(0, jetForce));
	}
	
	if(grounded && jetOn)
	{
		canJet = false;
		jetOn = false;
	}
		
	//LIGHT SWITCH
	if(Input.GetKeyDown("e"))
	{
		if(switchLight)
		{
			LightOff();
		}else{
			switchLight = true;
		}
	}
		
	//RUN
	if(grounded && Input.GetKey(KeyCode.LeftShift))
	{
		myMaxSpeed = maxRunSpeed;
		running = true;
	}
	else
		running = false;
	
	//ACCELERATION AFTER RUNNING
	if(!running && move!=0)
	{
		if(myMaxSpeed > maxWalkSpeed)
			myMaxSpeed -= 0.02;
		else
			myMaxSpeed = maxWalkSpeed;
	}

	if(Input.GetKeyDown(KeyCode.UpArrow) || Input.GetKeyDown("w"))
		NewSpawner();

	if(Input.GetKeyDown(KeyCode.DownArrow) || Input.GetKeyDown("s"))
		Action();
}

function Flip()
{
	facingRight = !facingRight;
	var theScale : Vector3 = transform.localScale;
	theScale.x *= -1;
	transform.localScale = theScale;
	landParticle.gameObject.transform.localScale = theScale;
}

//-------------------------------//
//-----------DEATH
//-------------------------------//

function KillChar()
{	

	mainCTRL.LowerSoundTrack(0.2f);

	StopChar();
	
	//LoseCrystals();
	
	while(myLight.intensity > 0)
	{
		myLight.intensity -= 0.03;
		myRenderer.color = Color.Lerp(Color.black, Color.white, myLight.intensity/lightIntensity);
		yield;
	}

	mainCTRL.gameObject.SendMessage("DeathSound");
	
	yield WaitForSeconds(1f);

	HideChildren();
	
	if(toCreateDead)
		CreateDeadCopy();
	
	anim.SetBool("Dead", true);
	
	//send message to main ctrl that the char is dead
	mainCTRL.CharIsDead();
}

function StopChar()
{
	charDead = true;

	rigidbody2D.velocity = new Vector2(0,0);

	move = 0;

	jetParticle.gameObject.SetActive(false);

	jetBar.gameObject.SetActive(false);
}

function HideChildren()
{
	for (var child : Transform in transform)
		child.gameObject.SetActive(false);
	jetBar.gameObject.SetActive(false);
}

function HideChar()
{
	landParticle.gameObject.SetActive(false);
	myRenderer.enabled = false;
}

function Hurt()
{
	var origColor : Color = myRenderer.color;
	var hurtTime: float = 1f;
	while(hurtTime > 0)
	{
		myRenderer.color = Color.Lerp(origColor, hurtColor, hurtTime);
		hurtTime -= 0.01;
		yield;
	}
	
}

function DieAnim()
{
	anim.SetTrigger("Die");
	toCreateDead = true;
}

function LightOff()
{
	switchLight = false;
	myLight.intensity = 0;
	myRenderer.color = Color.black;
}

function CreateDeadCopy()
{
	var deadCopy = Instantiate (tilePrefab);
	deadCopy.transform.parent = null;
	deadCopy.transform.position = gameObject.transform.position;
	deadCopy.transform.localScale = gameObject.transform.localScale;
	var sprRender : SpriteRenderer = deadCopy.GetComponent(SpriteRenderer);
	sprRender.sprite = deadSprite;
	deadCopy.gameObject.SetActive(true);

	toCreateDead = false;
}

function LoseCrystals()
{
	//throw some crystals around
	//var numCrystals : int = Mathf.Floor(mainCTRL.crystalCount / 2);
	var numCrystals : int = mainCTRL.crystalCount;
	
	if(numCrystals == 0)
		return;
	
	//pra metade dos cristais que o char tem
	for(var i: int = 0; i < numCrystals; i++)
	{
		//instantiate it
		var dropCrystal : GameObject = Instantiate(aCrystal, myLight.transform.position, Quaternion.identity);
		//not collectable for the total crystal
		dropCrystal.SendMessage("Collectable", false);

		//random force
		var randX: float = Random.Range(-200, 200);
		var randY: float = Random.Range(100, 300);
		//add force
		dropCrystal.rigidbody2D.AddForce(new Vector2(randX, randY));
	}
	
}

//-------------------------------//
//-----------ACTION
//-------------------------------//

function PickedCrystal(state: boolean)
{
	if(!charDead)
	{
		SendMessage("CrystalSound");
		
		mainCTRL.AddCrystal(1, state);

	}
}

function Touching(what : String)
{
	touchingAction = what;
}

function Action()
{
	if(touchingAction == "Rock")
	{
		anim.SetTrigger("Action");
		DropBomb();
	}

	if(touchingAction == "MainSpawner")
	{
		//acha o main spawner
		var mainSpawner : Transform = GameObject.Find("MainSpawner").transform;
		// mover char pro x do spawner
		transform.position.x = mainSpawner.position.x;
		//game over pro mainctrl
		mainCTRL.AskGameOver();
	}
}

function NewSpawner()
{

	if (!canPlaceSpawn)
		return;

	if(mainCTRL.crystalCount <= 0)
		return;

	//anim.SetTrigger("Action");

	SendMessage("NewSpawnerSound");

	canPlaceSpawn = false;

	spawner.SendMessage("Collect");

	var newSpawn : GameObject = Instantiate(aSpawner, transform.position, Quaternion.identity);

	newSpawn.transform.position.y = transform.position.y + 0.3;

	if(facingRight)
		newSpawn.transform.position.x = transform.position.x + 0.7;
	else
		newSpawn.transform.position.x = transform.position.x - 0.7;

	spawner = newSpawn;

	mainCTRL.AddCrystal(-1, false);

	yield WaitForSeconds(5f);

	canPlaceSpawn = true;

}

function DropBomb()
{
	var newBomb : GameObject = Instantiate(aBomb, transform.position, Quaternion.identity);
	newBomb.transform.position.y += 0.3;
	touchingAction = "";
	yield;
}