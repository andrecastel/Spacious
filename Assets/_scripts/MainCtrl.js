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
//public var crystalTotal : int = 0;
public var maxLives : int = 3;
public var livesCount : int = 0;
public var bombCount : int =0;
public var enemiesKilled : int =0;
//public var myPoints : int = 0;
var killerEnemy : GameObject;
var charDead : boolean = false;
var gameOver : boolean = false;
var canRestart : boolean = false;
public var reactorCollected : boolean = false;
var shipFixed : boolean = false;
private var titleScreen : boolean = false;
private var askGOver : boolean = false;
public var gamePaused : boolean = false;

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
	
	livesCount = maxLives;
	crystalCount = 0;
	//crystalTotal = 0;
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

	iTween.MoveTo(mainCamera.gameObject, {"x" : camTarget.position.x, "y" : camTarget.position.y, "time" : 8.0, "oncomplete": "NewGame", "oncompletetarget": gameObject, "easetype": "easeOutQuad"});
}

function NewGame()
{
	mainCamera.SendMessage("FollowPlayer", true);

	shipDoor.SetTrigger("Open");
	
	yield WaitForSeconds(1f);

	mainSpawner.GoDown();

	myGUICtrl.NewGame();

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

	if(charDead && !gameOver)
	{
		if(Input.anyKeyDown)
			CharRespawn();
	}

	if(askGOver)
	{
		if(Input.GetKeyDown("y"))
		{
			myGUICtrl.guiOver.text = "MISSION COMPLETED";
			GameOver();
			shipFixed = true;
			//achievement FIXED SHIP
		}

		if(Input.GetKeyDown("n"))
			CancelGameOver();
	}

	if(gameOver && canRestart)
	{
		if(Input.GetKeyDown (KeyCode.Space))
		{
			Application.LoadLevel(0);
		}
	}
	
	if(Input.GetKeyDown("p"))
	{
		if(!gamePaused)
		{
			myGUICtrl.SaveGame();
			PauseGame();
		}
		else
			UnpauseGame();
	}


}

//-------------------------------//
//-----------DEATH
//-------------------------------//

function CharIsDead()
{
	charDead = true;

	livesCount --;
	
	//crystalCount = 0;
	
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
	if(askGOver)
	{
		myGUICtrl.HideText();
		mainSpawner.GoUp();
		askGOver = false;
	}

	myChar.SendMessage("StopChar");
	myChar.SendMessage("LightOff");

	charDead = true;
	gameOver = true;

	UnpauseGame();

	myGUICtrl.timing = false;

	Debug.Log("Game Over");

	yield WaitForSeconds(2f);

	mainCamera.SendMessage("FollowPlayer", false);
	
	myGUICtrl.GameOver();

	yield WaitForSeconds(3f);
	
	canRestart = true;
}

function CancelGameOver()
{
	askGOver = false;
	myGUICtrl.HideText();
	UnpauseGame();
}

function KilledEnemy()
{
	enemiesKilled ++;
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
		//crystalTotal += n;

	UpdateGUI();
}

function UpdateGUI()
{
	myGUICtrl.ChangeLives(livesCount);
	myGUICtrl.ChangeCrystals(crystalCount);
}

function AskGameOver()
{
	if(!reactorCollected)
	{
		myGUICtrl.NewText("WE CAN'T LEAVE WITHOUT THE REACTOR");

		yield WaitForSeconds(2f);

		myGUICtrl.HideText();

	}
	else
	{
		myGUICtrl.NewText("ARE YOU READY TO LEAVE AND END THE MISSION? ( Y / N )");
		askGOver = true;
		PauseGame();
	}
}

function PauseGame()
{
	gamePaused = true;
	Time.timeScale = 0;
}

function UnpauseGame()
{
	gamePaused = false;
	Time.timeScale = 1;
}