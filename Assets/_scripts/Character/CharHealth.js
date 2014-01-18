#pragma strict

public var charHealth : float = 100f;
var healtBar : Transform;
var dead: boolean = false;

function Start () {

}

function Update () {
	
}

function TakeDamage(damage : float)
{
	charHealth -= damage;
	SendMessage("Hurt");
	
	if(charHealth<= 0 && !dead)
		Death();
}

function Death()
{
	dead = true;
	//remover todos controles do jogador
	
	//rodar animacao de morte se for preciso
	
	
}