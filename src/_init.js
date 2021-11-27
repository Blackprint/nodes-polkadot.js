// This script will run first, and then the other files
// depends on blackprint.config.js configuration

// Prepare stuff when the page is loading
// maybe like loading our dependencies for the nodes


/* Parallely load dependencies from CDN here (optional) */
//>> imports(...) =>  sf.loader.mjs(...) or [import(..), ..];
var [ SFMediaStream ] = await imports([
	// This is just an example, remove if not needed
	"https://cdn.jsdelivr.net/npm/sfmediastream@latest"
]);


/* or wait until the browser was loaded all script and the DOM was ready
 * without load another dependency
 *
 * Warning: When using this, you must modify wrapped:'mjs' to wrapped:'async-mjs'
 * on blackprint.config.js, to avoid circular waiting (because this module also waiting)
 *
 * Info: imports.task() == sf.loader.task;
 */
// await imports.task();



//> Optional, just for Blackprint Editor
// Let the Blackprint Editor know the source URL where
// the registerNode and registerInterface belongs to
let Blackprint = window.Blackprint.loadScope({
	// You can find the URL on Blackprint menu -> Modules
	// This will also be exported to JSON if this module's nodes is being used
	url: import.meta.url,

	// This will autoload (*.sf.mjs) and (*.sf.css) file for Browser
	hasInterface: true,
});

// Global shared context
let Context = Blackprint.getContext('Your/Module/Name');

// This is needed to avoid duplicated event listener when using hot reload
// Event listener that registered with same slot will be replaced
Context.EventSlot = {slot: 'my-private-event-slot'};