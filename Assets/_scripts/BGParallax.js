#pragma strict

var backgrounds : Transform[] ;				// Array of all the backgrounds to be parallaxed.
var parallaxScale : float;					// The proportion of the camera's movement to move the backgrounds by.
var parallaxReductionFactor : float;		// How much less each successive layer should parallax.
var smoothing : float;						// How smooth the parallax effect should be.


var cam : Transform;						// Shorter reference to the main camera's transform.
var previousCamPos : Vector3;				// The postion of the camera in the previous frame.

function Awake () {
	// Setting up the reference shortcut.
	cam = Camera.main.transform;
}

function Start () {
	// The 'previous frame' had the current frame's camera position.
	previousCamPos = cam.position;
}

function Update () {
	
	// The parallax is the opposite of the camera movement since the previous frame multiplied by the scale.
		var parallax : float = (cam.position.x - previousCamPos.x ) * parallaxScale;

		// For each successive background...
		for(var i : int = 0; i < backgrounds.length; i++)
		{
			// ... set a target x position which is their current position plus the parallax multiplied by the reduction.
			var backgroundTargetPosX : float = backgrounds[i].position.x + parallax * (i * parallaxReductionFactor + 1);

			// Create a target position which is the background's current position but with it's target x position.
			var backgroundTargetPos : Vector3 = new Vector3(backgroundTargetPosX, backgrounds[i].position.y, backgrounds[i].position.z);

			// Lerp the background's position between itself and it's target position.
			backgrounds[i].position = Vector3.Lerp(backgrounds[i].position, backgroundTargetPos, smoothing * Time.deltaTime);
		}

		// Set the previousCamPos to the camera's position at the end of this frame.
		previousCamPos = cam.position;
}