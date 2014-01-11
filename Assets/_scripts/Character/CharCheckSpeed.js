#pragma strict
private var hitVelo : float;
var hurtVelocity : float = -8f;
var landParticle : ParticleSystem;

private var touch: boolean = false;

function Start () {

}

function Update () {

}

function OnTriggerEnter2D(floorCol: Collider2D)
{
	if (floorCol.gameObject.tag == "Floor" && !touch)
	{
		SendMessageUpwards("TouchFloor");
		
		hitVelo = transform.parent.gameObject.rigidbody2D.velocity.y;
		
		//landParticle.emissionRate = 0.5 + (hitVelo * -20);
		landParticle.Emit(hitVelo * -5);
		
		//landParticle.Play();
		
		touch = true;
		
		if(hitVelo < hurtVelocity)
			Debug.Log("Ouch!");
	}
}

function OnTriggerExit2D(floorCol: Collider2D)
{
	touch = false;
}