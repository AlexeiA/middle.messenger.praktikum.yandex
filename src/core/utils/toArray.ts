export default function toArray(obj: {}) {
	let arr: Array<string> = [];
	Object.entries(obj).forEach(([k, v]) => {
		if (Array.isArray(v)) {
			arr.push(k + '=' + v.join(','));
		}
		else if (v && typeof v === 'object') {
			arr.push(k + '=' + v.toString());
		}
		else {
			arr.push(`${k}=${v}`);
		}
	});
	return arr;
}
