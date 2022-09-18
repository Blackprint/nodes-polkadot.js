/**
 * import { Context } from "./_init.js";
 */

// Bootstrap for add toast on node decoration
let NodeToast = Context.NodeToast = class NodeToast { // eslint-disable-line
	constructor(iface){
		this.iface = iface;
	}

	clear(){
		if(this.haveInfo)
			this.haveInfo.destroy();
		if(this.haveWarn)
			this.haveWarn.destroy();
		if(this.haveError)
			this.haveError.destroy();

		this.haveInfo = false;
		this.haveWarn = false;
		this.haveError = false;
	}

	_reduceText(text){
		return text.replace(/\w{15,}/g, full => full.slice(0, 5)+'...');
	}

	info(text){
		if(!this.iface.$decoration) return;
		let temp = text;
		text = this._reduceText(text);

		if(this.haveInfo)
			this.haveInfo.text = text;
		else
			this.haveInfo = this.iface.$decoration.info(text);

		this.haveInfo._raw = temp;
	}

	warn(text){
		if(!this.iface.$decoration) return;
		let temp = text;
		text = this._reduceText(text);

		if(this.haveWarn)
			this.haveWarn.text = text;
		else
			this.haveWarn = this.iface.$decoration.warn(text);

		this.haveWarn._raw = temp;
	}

	error(text){
		if(!this.iface.$decoration) return;
		let temp = text;
		text = this._reduceText(text);

		if(this.haveError)
			this.haveError.text = text;
		else
			this.haveError = this.iface.$decoration.error(text);

		this.haveError._raw = temp;
	}

	success(text){
		if(!this.iface.$decoration) return;
		let ref = this.iface.$decoration.success(this._reduceText(text));
		ref._raw = text;
	}
}