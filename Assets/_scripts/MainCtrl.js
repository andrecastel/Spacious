#pragma strict
 
var myChar : GameObject;
var myGUICtrl : GUICtrl;
var audioCtrl : MainAudioCtrl;

var mainSpawner : MainSpawner;
var shipDoor : Animator;

var mainCamera : Camera;
var camTarget : Transform;

var bgMusic : GameObject;
var soundTrack : AudioSource;

public var crystalCount : int = 0 ;
public var crystalTotal : int = 0;
public var maxLives : int = 3;
public var livesCount : int = 0;
public var myPoints : int = 0;
var killerEnemy : GameObject;
var charDead : boolean = false;
var gameOver : boolean = false;
private var titleScreen : boolean = false;

//-------------------------------//
//-----------START
//-------------------------------//

function Awake () 
{
	myGUICtrl = GameObject.Find("GUI").GetComponent(GUICtrl);
  
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
	myGUICtrl.TitleScreen();

	yield WaitForSeconds(2f);

	titleScreen = true;
}

function StartCamera()
{
	myGUICtrl.HideText();

	myGUICtrl.ShowCredits(false);

	soundTrack.Play();

	LowerSoundTrack(0.7);

	iTween.MoveTo(mainCamera.gameObject, {"x" : camTarget.position.x, "y" : camTarget.position.y, "time" : 5.0, "oncomplete": "NewGame", "oncompletetarget": gameObject, "easetype": "easeOutQuad"});
}

function NewGame()
{
	mainCamera.SendMessage("FollowPlayer");

	shipDoor.SetTrigger("Open");

	yield WaitForSeconds(1f);

	mainSpawner.GoDown();

	myGUICtrl.NewGame();
	livesCount = maxLives;
	crystalCount = 0;
	crystalTotal = 0;
	UpdateGUI();

	CharRespawn();
	//charDead = true;
}

//-------------------------------//
//-----------UPDATE
//-------------------------------//

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

	if(gameOver)
	{
		if(Input.GetKeyDown (KeyCode.Space))
		{
			Application.LoadLevel(0);
		}
	}
}

//-------------------------------//
//-----------DEATH
//-------------------------------//

function CharIsDead()
{
	charDead = true;

	livesCount --;
	
	crystalCount = 0;
	
	UpdateGUI();
	
	if(livesCount > 0)
	{
		myChar.SendMessage("CanRespawn");
		myGUICtrl.DeadRespawn();
	}
	else
		GameOver();
}

function CharRespawn()
{
	if(livesCount <= 0)
		return;
	
	charDead = false;

	myChar.SendMessage("Spawn");

	myGUICtrl.HideText();

	LowerSoundTrack(0.7);

	yield;

	if(killerEnemy != null)
	{
		killerEnemy.SendMessage("BackToNormal");
		killerEnemy = null;
	}
	
}

function KilledChar (enemy : GameObject)
{
	killerEnemy = enemy; 
}

function GameOver()
{
	
	yield WaitForSeconds(3f);
	
	myGUICtrl.GameOver();

	yield WaitForSeconds(3f);
	
	gameOver = true;
}

//-------------------------------//
//-----------MUSIC
//-------------------------------//

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

//-------------------------------//
//-----------GUI
//-------------------------------//

function AddCrystal(n : int, state: boolean)
{
	crystalCount += n;

	if(state)
		crystalTotal += n;

	UpdateGUI();
}

function UpdateGUI()
{
	myGUICtrl.ChangeLives(livesCount);
	myGUICtrl.ChangeCrystals(crystalCount);
}