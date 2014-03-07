#pragma strict
var baseName : String;
var startCount : int = 0;

function Awake()
{
	Rename();
}

function Rename()
{
	for(var i: int = 0; i<transform.childCount; i++)
	{
		var objRename : GameObject = transform.GetChild(i).gameObject;
		objRename.name = baseName + (i+startCount).ToString();
	}
}