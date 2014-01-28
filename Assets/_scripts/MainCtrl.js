﻿#pragma strict
 
var myChar : GameObject;
var myGUI : GameObject;
var myGUICtrl : GUICtrl;
var audioCtrl : MainAudioCtrl;

var bgMusic : GameObject;
var soundTrack : AudioSource;

public var crystalCount : int = 0 ;
public var maxLives : int = 3;
public var livesCount : int = 0;
public var myPoints : int = 0;
var killerEnemy : GameObject;
var charDead : boolean = false;
var gameOver : boolean = false;



function Awake () 
{
 	if (myGUI == null)
    	myGUI = GameObject.Find("GUI"); 

	myGUICtrl = myGUI.gameObject.GetComponent(GUICtrl);
  
	if (myChar == null)
		myChar = GameObject.FindWithTag("Player"); 

	audioCtrl = GetComponent(MainAudioCtrl);
	soundTrack = bgMusic.GetComponent(AudioSource);
		
}

function Start()
{
	TitleScreen();
	NewGame();
}

function TitleScreen()
{

}

function NewGame()
{
	//myGUI.SendMessage("NewGame");
	livesCount = maxLives;
	crystalCount = 0;
	UpdateGUI();
	soundTrack.Play();

	//temp
	LowerSoundTrack(0.7);
}

function Update()
{
  
}

function CharIsDead()
{
	livesCount --;
	
	crystalCount = 0;
	
	UpdateGUI();
	
	if(livesCount > 0)
		myChar.SendMessage("CanRespawn");
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