#pragma strict

function Start () {

}

function Update () {
	transform.Translate(Vector2(0.05 * Time.deltaTime,0));
}