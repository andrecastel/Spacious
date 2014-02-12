#pragma strict
private var hitHeight : float;
var hurtHeight : float = 4.5;
var landParticle : ParticleSystem;
private var charCtrl : CharCtrl;
private var myColor : Color;
private var touch: boolean = false;
private var fallHeight : float = 0;

function Start () {
	charCtrl = transform.parent.gameObject.GetComponent(CharCtrl);
	myColor = landParticle.startColor;
}

function Update () {
	
	if(charCtrl.grounded)
		return;
	
	if(Mathf.Floor(transform.parent.gameObject.rigidbody2D.velocity.y) == 0)
	{
		fallHeight = transform.parent.transform.position.y;
	}
}

function OnTriggerEnter2D(floorCol: Collider2D)
{
	if(charCtrl.charDead)
		return;

	if (floorCol.gameObject.tag == "Floor" && !touch)
	{
		touch = true;
		
		SendMessageUpwards("TouchFloor");
		
		hitHeight = fallHeight - transform.parent.transform.position.y;
		
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
	}
}

function OnTriggerExit2D(floorCol: Collider2D)
{
	touch = false;
}