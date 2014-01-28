#pragma strict
 
var pathHidden : boolean = true;

function Start () {

}

function Update () {

}

// Quando o char entrar em contato com o colider entao sumir com todos os filhos
function OnTriggerEnter2D(myCol : Collider2D)
{
	if (myCol.gameObject.tag == "Player")
	{
		if(!pathHidden)
			return;
		
		for (var child : Transform in transform)
		{
			var chRenderer : SpriteRenderer = child.gameObject.GetComponent(SpriteRenderer);
			chRenderer.enabled = false;
		}
		
		pathHidden = false;
	}
}

function OnTriggerExit2D(myCol: Collider2D)
{
	if (myCol.gameObject.tag == "Player")
	{
		// char saiu do caminho
		pathHidden = true;
		
		//Delay para esconder novamente
		yield WaitForSeconds(3f);
		
		//se o Char voltou ao caminho entao cancelar
		if(!pathHidden)
			return;
		
		for (var child : Transform in transform)
		{
			var chRenderer : SpriteRenderer = child.gameObject.GetComponent(SpriteRenderer);
			chRenderer.enabled = true;
		}
		
		pathHidden = true;
		
	}
}