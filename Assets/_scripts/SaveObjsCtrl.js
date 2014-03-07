#pragma strict

var objsArr : Array;
var objsSaved : int = 0;
var mainName : String;

function Awake()
{
	NotificationCenter.DefaultCenter().AddObserver(this, "SaveGame");
}

function Start()
{
	objsArr = new Array();
	
	if(PlayerPrefsX.GetBool("saved"))
		LoadObjs();
}
 
function ObjGone(rock : String)
{
	objsArr.Push(rock);
}

function SaveGame()
{
	if(objsSaved == objsArr.length)
		return;
	
	var objsList : String[] = objsArr.ToBuiltin(String) as String[];
	PlayerPrefsX.SetStringArray(mainName, objsList);
	objsSaved = objsArr.length;
}

function LoadObjs()
{
	var objsList : String[] = PlayerPrefsX.GetStringArray(mainName);
	objsArr = new Array(objsList);
	
	for (var i: int =0; i < objsArr.length; i++)
	{
		var newObj : GameObject = GameObject.Find(objsArr[i]);
		newObj.SendMessage("DestroyMe");
	}
}