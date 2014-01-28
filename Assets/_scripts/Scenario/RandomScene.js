#pragma strict
var tilePrefab : GameObject;
var floorSprites : Sprite[];
var tileNumber : int = 5;

function Start () {
	CreateFloor();
}

function Update () {

}

function CreateFloor(){
	for (var i : int = 0;i < tileNumber; i++)
	{
		var newTile = Instantiate (tilePrefab);
		newTile.tag = "Floor";
		newTile.transform.localPosition = Vector2(i,0);
		newTile.transform.parent = gameObject.transform;
		var sprRender : SpriteRenderer = newTile.GetComponent(SpriteRenderer);
		var spNumb : int = Random.Range(0,floorSprites.length);
		sprRender.sprite = floorSprites[spNumb];
	}
	
	gameObject.AddComponent ("BoxCollider2D");
	var col : BoxCollider2D = gameObject.GetComponent(BoxCollider2D);
	col.size = Vector2(tileNumber,1);
	col.center = Vector2(gameObject.transform.position.x + tileNumber/2, 0);
}