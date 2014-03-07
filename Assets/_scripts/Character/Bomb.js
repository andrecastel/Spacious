#pragma strict
var anim : Animator;
var mySound : AudioSource;
var bipSound : AudioClip;
var explosionSound : AudioClip;
var partic : ParticleSystem;
var exploded : boolean = false;
var myRenderer : SpriteRenderer;
private var waitTime : float = 1f;
var bombLayer : LayerMask;

function Awake () {
	anim = GetComponent(Animator);
	mySound = GetComponent(AudioSource);
	myRenderer = GetComponent(SpriteRenderer);

	partic.gameObject.renderer.sortingLayerID = 5;
	partic.Stop();

}

function Start() {

	/*
	if(bombCol != null)
	{
		objToExplode = bombCol.gameObject;
		objToExplode.SendMessage("GonnaExplode");
	}
	*/

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
	partic.Play();

	var bombCol : Collider2D= Physics2D.OverlapCircle(transform.position, 0.5, bombLayer);

	//Debug.Log(bombCol);

	if(bombCol != null)
		bombCol.gameObject.SendMessage("Explode");

	myRenderer.enabled = false;

	mySound.clip = explosionSound;

	mySound.Play();

	yield WaitForSeconds(0.6f);

	Destroy(gameObject);
}