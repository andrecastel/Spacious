#pragma strict
private var hitVelo : float;
var hurtVelocity : float = -8f;
var landParticle : ParticleSystem;
private var charCtrl : CharCtrl;
private var myColor : Color;

private var touch: boolean = false;

function Start () {
	charCtrl = transform.parent.gameObject.GetComponent(CharCtrl);
	myColor = landParticle.startColor;
}

function Update () {

}

function OnTriggerEnter2D(floorCol: Collider2D)
{
	if(charCtrl.charDead)
		return;

	if (floorCol.gameObject.tag == "Floor" && !touch)
	{
		SendMessageUpwards("TouchFloor");
		
		hitVelo = transform.parent.gameObject.rigidbody2D.velocity.y;
		
		if(charCtrl.switchLight)
			landParticle.startColor = myColor;
		else
			landParticle.startColor = Color.black;
		
		if(hitVelo < -1)
		{
			//landParticle.emissionRate = 0.5 + (hitVelo * -20);
			landParticle.Emit(hitVelo * -5);
			//landParticle.Play();
			touch = true;
		}

		if(hitVelo < hurtVelocity)
		{
			var hitDamage : int = Mathf.Floor(hitVelo / hurtVelocity);
			if(hitVelo < hurtVelocity * 4)
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