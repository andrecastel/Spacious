#pragma strict
#pragma implicit
#pragma downcast
 
import System.Collections.Generic;
//    NotificationCenter is used for handling messages between GameObjects.
//    GameObjects can register to receive specific notifications.  When another objects sends a notification of that type, all GameObjects that registered for it and implement the appropriate message will receive that notification.
//    Observing GameObjects must register to receive notifications with the AddObserver function, and pass their selves, and the name of the notification.  Observing GameObjects can also unregister themselves with the RemoveObserver function.  GameObjects must request to receive and remove notification types on a type by type basis.
//    Posting notifications is done by creating a Notification object and passing it to PostNotification.  All receiving GameObjects will accept that Notification object.  The Notification object contains the sender, the notification type name, and an option hashtable containing data.
//    To use NotificationCenter, either create and manage a unique instance of it somewhere, or use the static NotificationCenter.
 
// We need a static method for objects to be able to obtain the default notification center.
// This default center is what all objects will use for most notifications.  We can of course create our own separate instances of NotificationCenter, but this is the static one used by all.
public class NotificationCenter extends MonoBehaviour
{
	private static var defaultCenter : NotificationCenter;
	static function DefaultCenter () {
	    // If the defaultCenter doesn't already exist, we need to create it
	    if (!defaultCenter) {
	        // Because the NotificationCenter is a component, we have to create a GameObject to attach it to.
	        var notificationObject: GameObject = new GameObject("Default Notification Center");
	        // Add the NotificationCenter component, and set it as the defaultCenter
	        defaultCenter = notificationObject.AddComponent(NotificationCenter);
	    }
 
	    return defaultCenter;
	}
 
	// Our hashtable containing all the notifications.  Each notification in the hash table is an ArrayList that contains all the observers for that notification.
	var notifications: Hashtable = new Hashtable();
 
	// AddObserver includes a version where the observer can request to only receive notifications from a specific object.  We haven't implemented that yet, so the sender value is ignored for now.
	function AddObserver (observer, name: String) { AddObserver(observer, name, null); }
	function AddObserver (observer, name: String, sender) {
	    // If the name isn't good, then throw an error and return.
	    if (name == null || name == "") { Debug.Log("Null name specified for notification in AddObserver."); return; }
	    // If this specific notification doens't exist yet, then create it.
	    if (!notifications[name]) {
	        notifications[name] = new List.<Component>();
	    }
 
	    var notifyList: List.<Component> = notifications[name];
 
	    // If the list of observers doesn't already contain the one that's registering, then add it.
	    if (!notifyList.Contains(observer)) { notifyList.Add(observer); }
	}
 
	// RemoveObserver removes the observer from the notification list for the specified notification type
	function RemoveObserver (observer, name: String) {
	    var notifyList: List.<Component> = notifications[name]; //change from original
 
	    // Assuming that this is a valid notification type, remove the observer from the list.
	    // If the list of observers is now empty, then remove that notification type from the notifications hash.  This is for housekeeping purposes.
	    if (notifyList) {
	        if (notifyList.Contains(observer)) { notifyList.Remove(observer); }
	        if (notifyList.Count == 0) { notifications.Remove(name); }
	    }
	}
 
	// PostNotification sends a notification object to all objects that have requested to receive this type of notification.
	// A notification can either be posted with a notification object or by just sending the individual components.
	function PostNotification (aSender, aName: String) { PostNotification(aSender, aName, null); }
	function PostNotification (aSender, aName: String, aData) { PostNotification(new Notification(aSender, aName, aData)); }
	function PostNotification (aNotification: Notification) {
	    // First make sure that the name of the notification is valid.
	    if (aNotification.name == null || aNotification.name == "") { Debug.Log("Null name sent to PostNotification."); return; }
	    // Obtain the notification list, and make sure that it is valid as well
	    var notifyList: List.<Component> = notifications[aNotification.name]; //change from original
	    if (!notifyList) { Debug.Log("Notify list not found in PostNotification."); return; }
 
	    // Create an array to keep track of invalid observers that we need to remove
	    var observersToRemove = new List.<Component>(); //change from original
 
	    // Itterate through all the objects that have signed up to be notified by this type of notification.
	    for (var observer in notifyList) {
	        // If the observer isn't valid, then keep track of it so we can remove it later.
	        // We can't remove it right now, or it will mess the for loop up.
	        if (!observer) { observersToRemove.Add(observer);
	        } else {
	            // If the observer is valid, then send it the notification.  The message that's sent is the name of the notification.
	            observer.SendMessage(aNotification.name, aNotification, SendMessageOptions.DontRequireReceiver);
	        }
	    }
 
	    // Remove all the invalid observers
	    for (observer in observersToRemove) {
	        notifyList.Remove(observer);
	    }
	}
}
 
// The Notification class is the object that is sent to receiving objects of a notification type.
// This class contains the sending GameObject, the name of the notification, and optionally a hashtable containing data.
class Notification {
    var sender;
    var name : String;
    var data;
    function Notification (aSender,  aName: String) { sender = aSender; name = aName; data = null; }
    function Notification (aSender, aName: String, aData) { sender = aSender; name = aName; data = aData; }
}