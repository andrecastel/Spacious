#pragma strict

//walking / moving
var maxWalkSpeed : float = 2.0;
var maxRunSpeed : float = 4.0;
var speedMultip : float = 1.0;
var myMaxSpeed : float;
var anim : Animator;
var jumpForce : float = 500f;

private var move : float;
private var moveSpeed : float = 0;

//grounding
var grounded : boolean = false;
var groundCheck : Transform;
var groundRadius : float = 0.2f;
var whatIsGround : LayerMask;

//effects
var jetParticle : ParticleSystem;
var landParticle : ParticleSystem;
var shakeDummy : GameObject;

//jet
var jetFuel : float = 100f;
var jetFuelWaste : float = 0.3;

private var jetUsed : float;

//booleans
private var facingRight : boolean = true;
private var running : boolean = false;
private var hasJumped : boolean = false;
private var canJet : boolean = false;
private var jetOn : boolean = false;

function Start ()
{
	anim = gameObject.GetComponent(Animator);
	myMaxSpeed = maxWalkSpeed;
	jetOn = false;
	iTween.Init(shakeDummy);
	jetUsed = jetFuel;
}

function FixedUpdate ()
{
	grounded = Physics2D.OverlapCircle(groundCheck.position, groundRadius, whatIsGround);
	anim.SetBool("Ground", grounded);
	anim.SetFloat("vSpeed", rigidbody2D.velocity.y);
	
	move = Input.GetAxis ("Horizontal");
	
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
		
	//JET
	if(jetOn)
	{
		iTween.ShakePosition(shakeDummy,{"x": 10, "time": 5});
		rigidbody2D.AddForce(new Vector2(shakeDummy.transform.localPosition.x*10,0));
		anim.SetBool("Jet", true);	
		jetParticle.emissionRate = 20;
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
			jetUsed += jetFuelWaste*2;
		else
			jetUsed = jetFuel;
		
		shakeDummy.transform.localPosition.y = 0;
		shakeDummy.transform.localPosition.x = 0;
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
		rigidbody2D.AddForce(new Vector2(0, jumpForce));
		canJet = false;
		hasJumped = true;
	} 
	
	if(!grounded && Input.GetKeyUp(KeyCode.Space))
	{
		jetOn = false;		
		canJet = true;
	}
	
	if(!grounded && canJet && Input.GetKey(KeyCode.Space))
	{
		jetOn = true;
		//make go up
		if(rigidbody2D.velocity.y <=2 )
			rigidbody2D.AddForce(new Vector2(0, jumpForce / 20));
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

function OnCollisionEnter2D(coli: Collision2D)
{
	//landing particles
	if(coli.gameObject.tag == "Floor" && hasJumped)
	{
		landParticle.Play();
		hasJumped = false;
		jetOn = false;
	}
}