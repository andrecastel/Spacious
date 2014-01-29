#pragma strict
 
var myChar : GameObject;
var myGUI : GameObject;
var myGUICtrl : GUICtrl;
var audioCtrl : MainAudioCtrl;

var mainCamera : Camera;
var camTarget : Transform;

var bgMusic : GameObject;
var soundTrack : AudioSource;

public var crystalCount : int = 0 ;
public var maxLives : int = 3;
public var livesCount : int = 0;
public var myPoints : int = 0;
var killerEnemy : GameObject;
var charDead : boolean = false;
var gameOver : boolean = false;
private var titleScreen : boolean = false;


function Awake () 
{
 	if (myGUI == null)
    	myGUI = GameObject.Find("GUI"); 

	myGUICtrl = myGUI.gameObject.GetComponent(GUICtrl);
  
	if (myChar == null)
		myChar = GameObject.Find("Character"); 

	audioCtrl = GetComponent(MainAudioCtrl);
	soundTrack = bgMusic.GetComponent(AudioSource);

	if(mainCamera == null)
		mainCamera = Camera.main;
	
	iTween.Init(mainCamera.gameObject);
}

function Start()
{
	TitleScreen();
}

function TitleScreen()
{
	titleScreen = true;

	myGUI.SendMessage("TitleScreen");
}

function StartCamera()
{
	myGUI.SendMessage("HideText");

	soundTrack.Play();

	LowerSoundTrack(0.7);

	iTween.MoveTo(mainCamera.gameObject, {"x" : camTarget.position.x, "y" : camTarget.position.y, "time" : 5.0, "oncomplete": "NewGame", "oncompletetarget": gameObject, "easetype": "easeOutQuad"});
}

function NewGame()
{
	mainCamera.SendMessage("FollowPlayer");
	myGUI.SendMessage("NewGame");
	livesCount = maxLives;
	crystalCount = 0;
	UpdateGUI();

	CharRespawn();
	//charDead = true;
}

function Update()
{
	if(titleScreen)
		if (Input.GetKeyDown (KeyCode.Space))
		{
			StartCamera();
			titleScreen = false;
		}

	if(charDead)
	{
		if(Input.anyKeyDown)
			CharRespawn();
	}
}

function CharIsDead()
{
	charDead = true;

	livesCount --;
	
	crystalCount = 0;
	
	UpdateGUI();
	
	if(livesCount > 0)
	{
		myChar.SendMessage("CanRespawn");
		myGUI.SendMessage("DeadRespawn");
	}
	else
		GameOver();
}

function LowerSoundTrack(sdVol:float)
{
	if (sdVol < soundTrack.volume)
	{
		while(soundTrack.volume > sdVol)
		{
			soundTrack.volume -= 0.004;
			yield;
		}
	}else
	{
		while(soundTrack.volume < sdVol)
		{
			soundTrack.volume += 0.004;
			yield;
		}
	}
	
}

function GameOver()
{
	
	yield WaitForSeconds(3f);
	
	myGUI.SendMessage("GameOver");
	
	gameOver = true;
}

function CharRespawn()
{
	if(livesCount <= 0)
		return;
	
	charDead = false;

	myChar.SendMessage("Spawn");

	myGUI.SendMessage("HideText");

	LowerSoundTrack(0.7);

	yield;

	if(killerEnemy != null)
	{
		killerEnemy.SendMessage("BackToNormal");
		killerEnemy = null;
	}
	
}

function AddCrystal(n : int)
{
	crystalCount += n;
	UpdateGUI();
}

function UpdateGUI()
{
	myGUICtrl.ChangeLives(livesCount);
	myGUICtrl.ChangeCrystals(crystalCount);
}

function KilledChar (enemy : GameObject)
{
	killerEnemy = enemy; 
}