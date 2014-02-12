#pragma strict

public var maxHealth : int = 5;
public var charHealth : int = 5;
var dead: boolean = false;
var myGUICtrl : GUICtrl;
var hurtTexts : String[] = ["Ouch!", "", "Ai", "That hurt", "", "Son of a...", "..."];

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
	{
		SendMessage("ShowCharText", hurtTexts[Random.Range(0, hurtTexts.Length-1)]);
		UpdateGUI();
		
		if(charHealth == 1)
			FunText();
	}
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

function FunText()
{
	yield WaitForSeconds(1f);
	
	SendMessage("ShowCharText", "If you want to recharge the health bar \n you can wait for 30 minutes...");
	yield;
	SendMessage("ShowCharText", "...or you can buy it for only 1.99");
	yield;
	SendMessage("ShowCharText", "hahaha Just kidding. \n There is no way to recover it.");
}