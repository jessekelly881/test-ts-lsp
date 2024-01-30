import log from "./log";
import { initialize } from "./methods/initialize";
import { completion } from "./methods/textDocument/completion";
import { didChange } from "./methods/textDocument/didChange";

interface Message {
	jsonrpc: string;
}

export interface NotificationMessage extends Message {
	method: string;
	params: unknown[] | object;
}

export interface RequestMessage extends NotificationMessage {
	id: number | string;
}

const methodLookup: Record<
	string,
	typeof initialize | typeof completion | typeof didChange
> = {
	initialize,
	"textDocument/completion": completion,
	"textDocument/didChange": didChange
};

const respond = (id: RequestMessage["id"], result: object | null) => {
	const message = JSON.stringify({ id, result });
	const messageLength = Buffer.byteLength(message, "utf8");
	const header = `Content-Length: ${messageLength}\r\n\r\n`;
	const body = header + message;

	log.write(body);
	process.stdout.write(body);
};

let buffer = "";

process.stdin.on("data", (chunk) => {
	buffer += chunk;

	while (true) {
		// check for Content-Length header
		const lenMatch = buffer.match(/Content-Length: (\d+)\r\n/);
		if (!lenMatch) break;

		const contentLen = parseInt(lenMatch[1], 10);
		const msgStart = buffer.indexOf("\r\n\r\n") + 4;

		if (buffer.length < msgStart + contentLen) break;
		const rawMessage = buffer.slice(msgStart, msgStart + contentLen);
		const msg = JSON.parse(rawMessage) as RequestMessage;

		log.write({ id: msg.id, message: msg.method });

		// respond
		const method = methodLookup[msg.method];
		if (method) {
			const result = method(msg);
			if (result) {
				respond(msg.id, result);
			}
		}

		// remove processed msg
		buffer = buffer.slice(msgStart + contentLen);
	}
});
