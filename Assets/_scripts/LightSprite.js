#pragma strict
var lightColors : Color[];
//private var myColl : CircleCollider2D;

function Start () {
	//myColl = gameObject.GetComponent(CircleCollider2D);
}

function Update () {

}

function OnTriggerStay2D(spriteCol: Collider2D){
	if(spriteCol.gameObject.tag == "Floor"){
		var spColor : SpriteRenderer = spriteCol.gameObject.GetComponent(SpriteRenderer);
		var spDistance : float = Vector2.Distance(gameObject.transform.position, spriteCol.gameObject.transform.position);
		spColor.color = lightColors[Mathf.Floor(spDistance)];
	}
}

function OnTriggerExit2D(spriteCol: Collider2D){
	if(spriteCol.gameObject.tag == "Floor"){
		var spColor : SpriteRenderer = spriteCol.gameObject.GetComponent(SpriteRenderer);
		spColor.color = lightColors[lightColors.length-1];
	}
}