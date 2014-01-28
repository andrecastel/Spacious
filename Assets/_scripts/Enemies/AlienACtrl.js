#pragma strict

//main ctrls
var mainCTRL : GameObject; 

var body : GameObject;
private var bodyAnim : Animator;
var eyes : GameObject;
private var eyesAnim : Animator;

var closeCollider : CircleCollider2D;
private var colliderRad : float;

var myChar : GameObject;
var charCtrl : CharCtrl;
var attackDistance : float = 2f;

private var eyesUp : boolean = false;
private var charClose : boolean = false;
var charDead : boolean = false;
var attacking : boolean = false;

var audioCtrl : AudioSource;

var myColor : Color;

function Awake ()
{
	bodyAnim = body.gameObject.GetComponent(Animator);
	eyesAnim = eyes.gameObject.GetComponent(Animator);
	
	if (mainCTRL == null)
		mainCTRL = GameObject.Find("MainCtrl");

	if (myChar == null)
		myChar = GameObject.FindWithTag("Player");
	
	charCtrl = myChar.gameObject.GetComponent(CharCtrl);

	audioCtrl = GetComponent(AudioSource);
}

function FixedUpdate ()
{
	
	if(charClose)
	{
		if(charDead)
		{
			Attack(false);
			CharCloseBy(false);
			return;
		}
		
		//calcular distancia do char
		var charDistance : float = Vector2.Distance(gameObject.transform.position, myChar.gameObject.transform.position);

		if(charCtrl.switchLight)
		{
			if(eyesUp)
			{
				eyesAnim.SetTrigger("EyesDown");
				eyesUp = false;
			}
			
		}else{
			if(!eyesUp)
			{
				eyesAnim.SetTrigger("EyesUp");
				eyesUp = true;
			}
		}
	
		
		//se estiver perto o suficiente entao rodar a animacao
		if (charDistance < attackDistance)
		{

			PlaySound();
			if(!attacking)
				Attack(true);
		}
		else
		{
			if(attacking)
				Attack(false);
		}
	}else
	{
		if(eyesUp)
			{
				eyesAnim.SetTrigger("EyesDown");
				eyesUp = false;
			}
	}
	
}

function CharCloseBy(state : boolean)
{
	
	if(charClose == state)
		return;
	
	charClose = state;
}

function Attack(state: boolean)
{
	if(state)
		bodyAnim.SetTrigger("Attack");
	else
		bodyAnim.SetTrigger("AttackBack");
		
	attacking = state;
}

function OnTriggerEnter2D(myCol: Collider2D)
{
	if (myCol.gameObject.tag == "Player")
	{
		//KillChar();
		iTween.MoveTo(myCol.gameObject, {"position": gameObject.transform.position, "time": 0.5, "oncomplete": "KillChar", "oncompletetarget": gameObject});
	}
}

function KillChar()
{
	charDead = true;
	//Kill the char
	//myChar.gameObject.transform.position = gameObject.transform.position;
	myChar.SendMessage("Death");
	myChar.SendMessage("HideChar");
	
	bodyAnim.SetTrigger("Eat");
	
	//send message to main ctrl that I killed the char
	mainCTRL.SendMessage("KilledChar", gameObject);
}


//function to receive message that char has respawned and can act normal again
function BackToNormal()
{
	charDead = false;
}

function PlaySound()
{
	audioCtrl.pitch = Random.Range(0.9f, 1.2f);
	audioCtrl.Play();
}