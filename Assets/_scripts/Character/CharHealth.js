#pragma strict

public var charHealth : int = 5;
var healtBar : Transform;
var dead: boolean = false;

function Start () {

}

function Update () {
	
}

function TakeDamage(damage : int)
{
	charHealth -= damage;
	SendMessage("Hurt");
	
	if(charHealth<= 0 && !dead)
		FallingDie();
}

function FallingDie()
{
	SendMessage("DieAnim");
	yield;
	Death();
}

function Death()
{
	Debug.Log("DIED");
	dead = true;
	charHealth = 0;

	//send message to gui health bar

	//matar jogador
	SendMessage("KillChar");

}