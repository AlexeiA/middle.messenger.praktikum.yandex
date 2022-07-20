export default class MySocket extends WebSocket {
	constructor(url: string) {
		super(url);
	}

	on = super.addEventListener;

	send(data: {} | string) {
		if (typeof data === 'string') {
			super.send(data);
		}
		else {
			super.send(JSON.stringify(data));
		}
	}
}
