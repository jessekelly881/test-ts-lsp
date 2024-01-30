/**
 * @since 1.0.0
 */

import * as fs from "fs";
import { TextDocumentIdentifier, documents } from "../../documents";
import log from "../../log";
import { RequestMessage } from "../../server";

const words = fs
	.readFileSync("/usr/share/dict/words", "utf8")
	.toString()
	.split("\n");

interface CompletionItem {
	label: string;
}

interface Position {
	line: number;
	character: number;
}

interface CompletionList {
	isIncomplete: boolean;
	items: CompletionItem[];
}

interface TextDocumentPositionParams {
	textDocument: TextDocumentIdentifier;
	position: Position;
}

interface CompletionParams extends TextDocumentPositionParams {}

export const completion = (msg: RequestMessage): CompletionList | null => {
	const params = msg.params as CompletionParams;
	const content = documents.get(params.textDocument.uri);

	if (!content) {
		return null;
	}

	const currentLine = content?.split("\n")[params.position.line];
	const textBeforeCursor = currentLine?.slice(0, params.position.character);
	const currentPrefix = textBeforeCursor?.split(/\s+/).pop() || "";

	log.write({ currentLine, textBeforeCursor, currentWord: currentPrefix });

	const items: CompletionItem[] = words
		.filter((word) => word.startsWith(currentPrefix))
		.slice(0, 100)
		.map((word) => ({
			label: word
		}));

	return {
		isIncomplete: true,
		items
	};
};
