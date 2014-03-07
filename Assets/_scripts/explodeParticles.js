#pragma strict

var theParticle : GameObject;
var particleNum : int = 30;
var expSize : float = 0.3;
var baseForce : float = 30;
var myLayer : int;

function Start () {
	myLayer = gameObject.layer;
}

function ExplodeParticle()
{
	
	for(var i: int = 0; i < particleNum; i++)
	{
		var newParticle : GameObject = Instantiate(theParticle);
		newParticle.transform.position = Vector2(Random.Range(transform.position.x-expSize,transform.position.x+expSize), Random.Range(transform.position.y-expSize,transform.position.y+expSize));
		var newForce : Vector2 = new Vector2(Random.Range(-baseForce,baseForce), Random.Range(baseForce/2,baseForce));
		newParticle.rigidbody2D.AddForceAtPosition(newForce, transform.position);
	}

	Physics2D.IgnoreLayerCollision(myLayer,myLayer,true);
}