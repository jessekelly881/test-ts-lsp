/**
 * @since 1.0.0
 */

type DocumentURI = string;
type DocumentBody = string;

export interface TextDocumentIdentifier {
	uri: DocumentURI;
}

export interface VersionedTextDocumentIdentifier
	extends TextDocumentIdentifier {
	version: number;
}

export interface TextDocumentContentChangeEvent {
	text: string;
}

export const documents = new Map<DocumentURI, DocumentBody>();
