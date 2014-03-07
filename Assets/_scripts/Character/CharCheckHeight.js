#pragma strict
private var hitHeight : float;
var hurtHeight : float = 4.5;
var landParticle : ParticleSystem;
private var charCtrl : CharCtrl;
private var myColor : Color;
private var touch: boolean = false;
var fallHeight : float = 0;
private var myVelo : float = 0;
function Awake ()
{
	charCtrl = transform.parent.gameObject.GetComponent(CharCtrl);
	myColor = landParticle.startColor;
}

function Start () {
	yield;
	fallHeight = transform.position.y;
}

function Spawn()
{
	fallHeight = transform.position.y;
}

function Update () {
	
	if(charCtrl.grounded)
		return;
	
	myVelo = Mathf.Floor(transform.parent.gameObject.rigidbody2D.velocity.y);

	if( myVelo < 0 && myVelo > -3)
		fallHeight = transform.position.y;
}

function OnTriggerEnter2D(floorCol: Collider2D)
{
	if(charCtrl.charDead)
		return;

	if (floorCol.gameObject.tag == "Floor" && !touch)
	{
		touch = true;
		
		SendMessageUpwards("TouchFloor");
		
		hitHeight = fallHeight - transform.position.y;

		//Debug.Log(hitHeight);

		if(charCtrl.switchLight)
			landParticle.startColor = myColor;
		else
			landParticle.startColor = Color.black;
		
		if(transform.parent.gameObject.rigidbody2D.velocity.y  < -1)
		{
			//landParticle.emissionRate = 0.5 + (hitVelo * -20);
			landParticle.Emit(30);
			//landParticle.Play();
			touch = true;
		}

		if(hitHeight > hurtHeight)
		{
			var hitDamage : int = Mathf.Floor(hitHeight / hurtHeight);
			if(hitHeight > hurtHeight * 3)
				SendMessageUpwards("FallingDie");
			
			SendMessageUpwards("TakeDamage", hitDamage);

			//Debug.Log("Ouch!");
		}

		fallHeight = transform.position.y;
	}
}

function OnTriggerExit2D(floorCol: Collider2D)
{
	touch = false;
}