/**
 * @since 1.0.0
 */

import { RequestMessage } from "../../server";
import { Range } from "../../types";

namespace DiagnosticSeverity {
	export const Error = 1 as const;
	export const Warning = 2 as const;
	export const Information = 3 as const;
	export const Hint = 4 as const;
}

type DiagnosticSeverity = 1 | 2 | 3 | 4;

interface Diagnostic {
	range: Range;
	severity: DiagnosticSeverity;
	source: string;
	message: string;
	data?: unknown;
}

interface FullDocumentDiagnosticReport {
	kind: "full";
	items: Diagnostic[];
}

export const diagnostic = (
	message: RequestMessage
): FullDocumentDiagnosticReport => {
	return {
		kind: "full",
		items: [
			{
				severity: DiagnosticSeverity.Error,
				message: "Oops, incorrect..",
				source: "LSP From Scratch",
				range: {
					start: { line: 0, character: 4 },
					end: { line: 0, character: 8 }
				}
			},
			{
				severity: DiagnosticSeverity.Warning,
				message: "Hmm. Not great..",
				source: "LSP From Scratch",
				range: {
					start: { line: 1, character: 6 },
					end: { line: 1, character: 8 }
				}
			}
		]
	};
};
