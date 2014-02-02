
#pragma strict

var target : Transform;
var smoothTime = 0.3;
private var thisTransform : Transform;
private var velocity : Vector2;
private var followPlayer : boolean = false;

function Start()
{
	thisTransform = transform;
}

function Update() 
{
	if(!followPlayer)
		return;

	thisTransform.position.x = Mathf.SmoothDamp( thisTransform.position.x, 
		target.position.x, velocity.x, smoothTime);
	thisTransform.position.y = Mathf.SmoothDamp( thisTransform.position.y, 
		target.position.y, velocity.y, smoothTime);
}

function FollowPlayer(state : boolean)
{
	followPlayer = state;
}
