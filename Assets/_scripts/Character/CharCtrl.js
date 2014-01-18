#pragma strict

//walking / moving
var maxWalkSpeed : float = 2.0;
var maxRunSpeed : float = 4.0;
var speedMultip : float = 1.0;
var myMaxSpeed : float;
var anim : Animator;
var jumpForce : float = 500f;

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

private var jetUsed : float;

//LIGHT
var myLight : Light;
var lightIntensity : float;
private var myRenderer : SpriteRenderer;

//booleans
public var facingRight : boolean = true;
private var running : boolean = false;
private var hasJumped : boolean = false;
public var switchLight : boolean = true;
public var canJet : boolean = false;
public var jetOn : boolean = false;

function Awake ()
{
	anim = gameObject.GetComponent(Animator);
	myRenderer = gameObject.GetComponent(SpriteRenderer);
	myMaxSpeed = maxWalkSpeed;
	jetOn = false;
	jetUsed = jetFuel;
	jetBarRender = jetBar.GetComponent(SpriteRenderer);
	lightIntensity = myLight.intensity;
}

function FixedUpdate ()
{
	grounded = Physics2D.OverlapCircle(groundCheck.position, groundRadius, whatIsGround);
	anim.SetBool("Ground", grounded);
	anim.SetFloat("vSpeed", rigidbody2D.velocity.y);
	
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
		if(jetUsed > 0)
			jetUsed -= jetFuelWaste;
		else
		{
			jetUsed = 0;
			canJet = false;
			jetOn = false;
		}

	}else{
	
		if(jetUsed < jetFuel)
			jetUsed += jetFuelWaste*0.1;
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
		jetOn = false;
		
	//LIGHT SWITCH
	if(Input.GetKeyDown("e"))
	{
		if(switchLight)
		{
			switchLight = false;
			myLight.intensity = 0;
			myRenderer.color = Color.black;
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
}

function Flip()
{
	facingRight = !facingRight;
	var theScale : Vector3 = transform.localScale;
	theScale.x *= -1;
	transform.localScale = theScale;
	landParticle.gameObject.transform.localScale = theScale;
}

/*
function OnCollisionEnter2D(coli: Collision2D)
{
	//landing particles
	if(coli.gameObject.tag == "Floor" && hasJumped && grounded)
	{
		hasJumped = false;
		jetOn = false;
	}
}
*/