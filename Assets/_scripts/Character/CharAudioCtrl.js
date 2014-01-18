#pragma strict
private var charAudio : AudioSource;
private var charCtrl : CharCtrl;

var walkingSounds : AudioClip[];
private var walkSound : AudioClip;
var walkStepLength : float = 0.35f;
var jumpSound : AudioClip;
var jetSound : AudioClip;
var hitFloorSound : AudioClip;
var fallingSound : AudioClip;
var hurtSound : AudioClip;

function Awake()
{
	charCtrl = gameObject.GetComponent(CharCtrl);
	charAudio = gameObject.GetComponent(AudioSource);
}

function Start () {
	while(true)
	{
		if(charCtrl.grounded && charCtrl.moveSpeed > 0.8)
		{
			walkSound = walkingSounds[Random.Range(0, walkingSounds.length)];
			PlaySound(walkSound,0.8);
            yield WaitForSeconds(walkStepLength / charCtrl.moveSpeed);
		}
		else
			yield;
	}
}

function FixedUpdate()
{
	if(charCtrl.jetOn)
		PlaySound(jetSound, 0.3);
		
	if(!charCtrl.grounded && rigidbody2D.velocity.y < -3)
	{
		charAudio.volume = rigidbody2D.velocity.y * -0.02;
		charAudio.pitch = 1.5 + (rigidbody2D.velocity.y * 0.05);
		charAudio.clip = fallingSound;
		charAudio.Play();
	}
}

function TouchFloor()
{
	PlaySound(hitFloorSound,1);
}

function Jump()
{
	PlaySound(jumpSound,0.8);
}

function Hurt()
{
	PlaySound(hurtSound,1);
}

function PlaySound(sfx : AudioClip, vol: float)
{
	charAudio.volume = vol;
	charAudio.clip = sfx;
	charAudio.pitch = Random.Range(0.9f, 1.2f);
	charAudio.Play();
}




