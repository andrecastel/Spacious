#pragma strict
var anim : Animator;
var mySound : AudioSource;
var bipSound : AudioClip;
var explosionSound : AudioClip;
var exploded : boolean = false;
var myRenderer : SpriteRenderer;
private var rock : GameObject;
private var waitTime : float = 1f;
var rockLayer : LayerMask;

function Awake () {
	anim = GetComponent(Animator);
	mySound = GetComponent(AudioSource);
	myRenderer = GetComponent(SpriteRenderer);
}

function Start() {

	var rockCol = Physics2D.OverlapCircle(transform.position, 0.5, rockLayer);
	if(rockCol != null)
	{
		rock = rockCol.gameObject;
		rock.SendMessage("GonnaExplode");
	}

	anim.speed = 0;

	mySound.clip = bipSound;

	while(!exploded)
	{
		//make bip
		mySound.Play();

		yield WaitForSeconds(waitTime);
		waitTime -=0.12;

	}
}

function Update () {
	if(anim.speed < 1.2)
		anim.speed += 0.005;
	else
	{
		if(!exploded)
			Explode();
	}

}

function Explode()
{
	exploded = true;

	myRenderer.enabled = false;

	mySound.clip = explosionSound;

	mySound.Play();

	if(rock != null)
		rock.SendMessage("Explode");

	yield WaitForSeconds(0.6f);

	Destroy(gameObject);
}