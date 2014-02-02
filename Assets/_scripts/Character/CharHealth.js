#pragma strict

public var maxHealth : int = 5;
public var charHealth : int = 5;
var dead: boolean = false;
var myGUICtrl : GUICtrl;

function Awake () {

	myGUICtrl = GameObject.Find("GUI").GetComponent(GUICtrl);
	myGUICtrl.maxHealth = maxHealth;
}

function Update () {
	
}

function TakeDamage(damage : int)
{
	charHealth -= damage;

	SendMessage("Hurt");
	
	if(charHealth <= 0 && !dead)
		FallingDie();
	else
		UpdateGUI();
}

function FallingDie()
{
	SendMessage("DieAnim");
	yield;
	Death();
}

function Death()
{
	//Debug.Log("DIED");
	dead = true;
	charHealth = 0;

	UpdateGUI();

	//matar jogador
	SendMessage("KillChar");
}

function UpdateGUI()
{
	myGUICtrl.ChangeHealth(charHealth);
	//Debug.Log(charHealth);
}

function RenewHealth()
{
	charHealth = maxHealth;
	UpdateGUI();
	dead = false;
}