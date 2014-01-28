#pragma strict
private var myAudio : AudioSource;

var guiSound : AudioClip;
var deathTune : AudioClip;

function Awake()
{
	myAudio = gameObject.GetComponent(AudioSource);
}

function Start () {

}

function FixedUpdate()
{
	
}

function GUISound()
{
	PlaySound(guiSound,1);
}

function DeathSound()
{
	PlaySound(deathTune, 0.7f);
}

function PlaySound(sfx : AudioClip, vol: float)
{
	myAudio.volume = vol;
	myAudio.clip = sfx;
	myAudio.pitch = Random.Range(0.9f, 1.2f);
	myAudio.Play();
}




