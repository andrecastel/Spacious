#pragma strict

var tilePrefab : GameObject;
var map : int[,];
var rooms : Rect[];
var mapSize : int = 20;
private var sizeX : int = 0;
private var sizeY : int = 0;
var mapRatio : Vector2 = Vector2(1,1);
var roomsLinked : int[];
var tileSprites : Sprite[];

function Awake () {
	
	//if(PlayerPrefsX.GetBool("saved"))
	//	LoadLevel();
	//else
		StartGen();
}

function Update () {

}

function StartGen()
{
	sizeX = Mathf.Floor(mapSize*mapRatio.x);
	sizeY = Mathf.Floor(mapSize*mapRatio.y);

	//set every tile in the map as 0
	map = new int[sizeX, sizeY];

	for(var x:int = 0; x < sizeX; x++)
	{
		for(var y: int = 0; y < sizeY; y++)
		{
			map[x,y] = 1;
		}
	}
	
	
	CreateRooms();
	//SquashRooms();
	
	FillRooms();
	
	MakeCorridors();
	//MakeCorridors();

	MakeWalls();
	
	CheckWalls();
	
	SaveLevel();
	
	MakeSprites();
	
}

function CreateRooms()
{
	//room creation
	var minSize : int = 3;
	var maxSize : int = 7;
	var roomCount : int = Random.Range(8,12);
	rooms = new Rect[roomCount];
	
	//make rooms
	var i : int = 0;
	var newRoom : Rect;
	while(i < roomCount)
	{
		
		newRoom.width = Mathf.Floor(Random.Range(minSize, maxSize));
		newRoom.height = Mathf.Floor(Random.Range(2,4));
		
		if(i == 0)
		{
			newRoom.x = Mathf.Floor( (sizeX/2) - (newRoom.width/2) );
			newRoom.y = sizeY - newRoom.height - 3;
		}else
		{
			newRoom.x = Mathf.Floor(Random.Range(3, sizeX - newRoom.width -3));
			newRoom.y = Mathf.Floor(Random.Range(3, sizeY - newRoom.height -3));
		}
		
		if(!DoesCollide(newRoom, -1))
		{
			rooms[i] = newRoom;
			i++;
		}	
	}
}

function FillRooms()
{
	Debug.Log("filling rooms");
	for(var i: int = 0; i < rooms.length; i++)
	{
		var room : Rect = rooms[i];
		for(var x: int = room.x; x <= room.width + room.x; x++)
		{
			for(var y: int = room.y; y <= room.height + room.y; y++)
			{
				map[x,y] = 0;
			}
		}
	}

	
}

function MakeCorridors()
{
	roomsLinked = new int[rooms.length];
	
	for(var i: int = 0; i < rooms.length; i++)
	{
		var roomA : Rect = rooms[i];
		var roomB : Rect = rooms[FindRoom(i)];
		
		var pointA : Vector2 = new Vector2(Mathf.Floor(Random.Range(roomA.x, roomA.x+roomA.width)), Mathf.Floor(Random.Range(roomA.y, roomA.y+roomA.height)));
		var pointB : Vector2 = new Vector2(Mathf.Floor(Random.Range(roomB.x, roomB.x+roomB.width)), Mathf.Floor(Random.Range(roomB.y, roomB.y+roomB.height)));
		
		//var pointA : Vector2 = roomA.center;
		//var pointB : Vector2 = roomB.center;

		while(pointA.x != pointB.x || pointA.y != pointB.y)
		{
			if(pointA.x != pointB.x)
			{
				if(pointB.x < pointA.x)
					pointB.x ++;
				else
					pointB.x --;
			}else
			{
				if(pointA.y != pointB.y)
				{
					if(pointB.y < pointA.y)
						pointB.y ++;
					else
						pointB.y --;
				}
			}
			
			map[pointB.x,pointB.y] = 0;
			//map[pointB.x,pointB.y+1] = 0;
		}
		
	}
}

function FindRoom(myId : int):int
{
	var newRoom : int = 0;
	var canLink : boolean = false;
	
	while(!canLink)
	{
		newRoom = Mathf.Floor(Random.Range(0, rooms.length-1));
		for(var linkedRoom: int in roomsLinked)
		{
			canLink = true;
			if(linkedRoom == newRoom)
				canLink = false;
				
		}
		
		if(newRoom == myId)
			canLink = false;
	}
	
	roomsLinked[myId] = newRoom;
	
	return newRoom;
}

function DoesCollide(room: Rect, ignore: int) : boolean
{
	for (var i = 0; i < rooms.length; i++) 
	{
		var check = rooms[i];
		
		if(i== ignore)
			continue;
		
		if (!((room.x + room.width < check.x) || (room.x > check.x + check.width+2) || (room.y + room.height < check.y) || (room.y > check.y + check.height+2))) 
			return true;
	}

    return false;
}

function SquashRooms()
{
	for (var i = 0; i < 5; i++) 
	{
		for (var j = 0; j < rooms.length; j++) 
		{             
			var room: Rect = rooms[j];    
			
			while (true) 
			{                 
				var old_position : Vector2 = new Vector2(room.x, room.y);
        
				if (room.x > 1)
					room.x--;
				if (room.y + room.height < sizeY-1)
					room.y++;
				if ((room.x == 1) && (room.y + room.height == sizeX-1))
					break;
				
				if (this.DoesCollide(room, j))
				{
					room.x = old_position.x;
					room.y = old_position.y;
					break;
				}
			}
		}
	}
}

function MakeWalls()
{
	for(var x: int = 0; x < sizeX; x++)
	{
		for(var y: int = 0; y < sizeY; y++)
		{
			if(map[x,y] == 0)
			{
				for(var xx: int = x-1; xx <= x+1; xx++)
				{
					for(var yy: int = y-1; yy <= y+1; yy++)
					{
						if(map[xx,yy] == 1)
							map[xx,yy] = 2;
					}
				}
			}
		}
	}
}

function CheckWalls()
{
	for(var x: int = 0; x < sizeX; x++)
	{
		for(var y: int = 0; y < sizeY; y++)
		{
			if(map[x,y] == 2)
			{
				var around : int[] = new int[8];
				var count : int = 0;
				for(var yy: int = y+1; yy >= y-1; yy--)
				{
					for(var xx: int = x-1; xx <= x+1; xx++)
					{
						if(xx == x && yy == y)
							continue;
						
						//Debug.Log(xx + " , " + yy);
						around[count] = map[xx,yy];
						count ++;
					}
				}
				
				map[x,y] = DefineSprites(around);
				
			}
		}
	}
}

function DefineSprites(around : int[]) :int
{
	var newTile : int = 0;
	
	for (var i: int = 0; i< around.length; i++)
	{
		if (around[i] > 0)
			around[i] = 1;
	}
	
	switch (true)
	{
		case around == [0,0,0,0,1,0,1,1] || around == [0,0,0,0,1,1,1,1]:
			newTile = 2;
			break;
		
		case around == [0,0,0,1,1,1,1,1] || around == [1,0,0,1,1,1,1,1] || around == [0,0,1,1,1,1,1,1] || around == [1,0,1,1,1,1,1,1]:
			newTile = 3;
			break;
			
		case around == [0,0,0,1,0,1,1,0] || around == [0,0,0,1,0,1,1,1]:
			newTile = 4;
			break;
			
		case around == [0,1,1,0,1,0,1,1] || around == [1,1,1,0,1,0,1,1] || around == [0,1,1,0,1,1,1,1] || around == [1,1,1,0,1,1,1,1]:
			newTile = 5;
			break;
		
		case around == [1,1,0,1,0,1,1,0]:
			newTile = 6;
			break;
			
		case around == [0,1,1,0,1,0,0,0]:
			newTile = 7;
			break;
			
		case around == [1,1,1,1,1,0,0,0] || around == [1,1,1,1,1,1,0,0] || around == [1,1,1,1,1,0,0,1] || around == [1,1,1,1,1,1,0,1]:
			
			newTile = 8;
			break;
			
		case around == [1,1,0,1,0,0,0,0]:
			newTile = 9;
			break;

		case around == [0,0,0,0,1,0,0,0]:
			newTile = 10;
			break;

		case around == [0,0,0,1,1,0,0,0]:
			newTile = 11;
			break;

		case around == [0,0,0,1,0,0,0,0]:
			newTile = 12;
			break;

		case around == [1,1,1,1,1,0,1,1]:
			newTile = 16;
			break;

		case around == [1,1,1,1,1,1,1,0]:
			newTile = 17;
			break;

		case around == [0,1,1,1,1,1,1,1]:
			newTile = 18;
			break;

		case around == [1,1,0,1,1,1,1,1]:
			newTile = 19;
			break;

		default:
			newTile = 1;
			break;
	}

	//10--15
	if(around[1] == 0 && around[6] == 0)
	{
		if(around[0] == 0 && around[3] == 0 && around[5] == 0)
			newTile = 10;
		else if(around[2] == 0 && around[4] == 0 && around[7] == 0)
			newTile = 12;
		else if(around[3] == 1 && around[4] == 1)
			newTile = 11;
	} else if(around[3] == 0 && around[4] == 0)
	{
		if(around[0] == 0 && around[1] == 0 && around[2] == 0)
			newTile = 13;
		else if(around[5] == 0 && around[6] == 0 && around[7] == 0)
			newTile = 15;
		else if(around[1] == 1 && around[6] == 1)
			newTile = 14;
	}
	
	return newTile;
}

function SaveLevel()
{
	//PlayerPrefsX.SetIntArray("mapX", map[0]);
	//PlayerPrefsX.SetIntArray("mapY", map[1]);
}

function LoadLevel()
{
	//var newMapX : int[] = PlayerPrefsX.GetIntArray("mapX");
	//var newMapY : int[] = PlayerPrefsX.GetIntArray("mapY");
	
	//map = [newMapX, newMapY];
	
	MakeSprites();
}

function MakeSprites()
{
	Debug.Log("making sprites");
	
	var newTile : GameObject;
	
	for(var x: int = 0; x < sizeX; x++)
	{
		for(var y: int = 0; y < sizeY; y++)
		{
			if(map[x,y] > 0)
			{				
				newTile =Instantiate(tilePrefab, Vector3(x,y,0), Quaternion.identity);
				newTile.GetComponent(SpriteRenderer).sprite = tileSprites[map[x,y]-1];
				
				if(map[x,y] == 17 || map[x,y] == 19)
					newTile.transform.localScale = Vector3(-1,1,1);
			}
		}
	}
}

