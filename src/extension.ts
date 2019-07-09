// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { colorPalette } from './colorPalette';

interface DecoratedString {
	type: 'word' | 'line';
	colorOption: vscode.DecorationRenderOptions;
}

class DecorationState {
	[keys: string]: vscode.TextEditorDecorationType;
}

class ColorScheme {
	[keyword: string]: DecoratedString;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	const escapeRegExp = (string: string) => {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	};
	const myScheme = 'logorrhea';
	const myProvider = new class implements vscode.TextDocumentContentProvider {
		onDidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
		onDidChange = this.onDidChangeEmitter.event;

		provideTextDocumentContent(uri: vscode.Uri): string {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				// Get the word within the selection
				const regEx = new RegExp(escapeRegExp(uri.path), "g");
				const text = editor.document.getText();
				const matchingLines: string[] = [];
				let match;
				while (match = regEx.exec(text)) {
					var line = editor.document.positionAt(match.index).line;
					matchingLines.push(editor.document.lineAt(line).text);
				}

				return matchingLines.join('\n');
			}
			return "";
		}
	};
	context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(myScheme, myProvider));
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let setColor = vscode.commands.registerCommand('extension.setColor', async () => {
		// The code you place here will be executed every time your command is executed
		let colorPicked = await vscode.window.showQuickPick(Object.keys(colorPalette), { canPickMany: false });
		if (colorPicked) {
			// Display a message box to the user
			const colorOption = { color: colorPalette[colorPicked] };
			const lineDecorationType = vscode.window.createTextEditorDecorationType(colorOption);
			// Get the active text editor
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				let selection = editor.selection;

				// Get the word within the selection
				let word = document.getText(selection);

				const regEx = new RegExp(escapeRegExp(word), "g");
				const text = editor.document.getText();
				const matchingWords: vscode.DecorationOptions[] = [];
				let match;
				while (match = regEx.exec(text)) {
					const startPos = editor.document.positionAt(match.index);
					const endPos = editor.document.positionAt(match.index + match[0].length);
					const decoration = { range: new vscode.Range(startPos, endPos) };
					matchingWords.push(decoration);
				}
				editor.setDecorations(lineDecorationType, matchingWords);

				// save decoration to global state so that we can clear them with the reset command
				let currentDecorations: DecorationState = context.globalState.get('currentDecorations', {});
				currentDecorations[word] = lineDecorationType,
				context.globalState.update('currentDecorations', currentDecorations);

				let currentColorScheme: ColorScheme = context.globalState.get('currentColorScheme', {});
				currentColorScheme[word] = {
					type: 'word',
					colorOption: colorOption
				};
				context.globalState.update('currentColorScheme', currentColorScheme);
			}
		}
	});

	let dimLines = vscode.commands.registerCommand('extension.dimLines', () => {
		const colorOption = {
			light: {
				color: '#EEEEEE'
			},
			dark: {
				color: '#111111'
			}
		};
		const lineDecorationType = vscode.window.createTextEditorDecorationType(colorOption);
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			let document = editor.document;
			let selection = editor.selection;

			// Get the word within the selection
			let word = document.getText(selection);

			const regEx = new RegExp(escapeRegExp(word), "g");
			const text = editor.document.getText();
			const matchingLines: vscode.DecorationOptions[] = [];
			let match;
			while (match = regEx.exec(text)) {
				var line = editor.document.positionAt(match.index).line;
				const decoration = { range: editor.document.lineAt(line).range };
				matchingLines.push(decoration);
			}
			editor.setDecorations(lineDecorationType, matchingLines);

			// save decoration to global state
			let currentDecorations: DecorationState = context.globalState.get('currentDecorations', {});
			currentDecorations[word] = lineDecorationType;
			context.globalState.update('currentDecorations', currentDecorations);

			let currentColorScheme: ColorScheme = context.globalState.get('currentColorScheme', {});
			currentColorScheme[word] = {
				type: 'line',
				colorOption: colorOption
			};
			context.globalState.update('currentColorScheme', currentColorScheme);
		}
	});

	let resetColor = vscode.commands.registerCommand('extension.resetColor', async () => {
		let editor = vscode.window.activeTextEditor;

		if (editor) {
			let document = editor.document;
			let selection = editor.selection;

			// Get the word within the selection
			let word = document.getText(selection);
			let decorationType = (context.globalState.get(word) as any).decorationType;


			let currentDecorations: DecorationState = context.globalState.get('currentDecorations', {});
			if (currentDecorations[word]) {
				editor.setDecorations(currentDecorations[word], []);
				delete currentDecorations[word];
			}
			context.globalState.update('currentDecorations', currentDecorations);

			let currentColorScheme: ColorScheme = context.globalState.get('currentColorScheme', {});
			delete currentColorScheme[word];
			context.globalState.update('currentColorScheme', currentColorScheme);
		}
	});

	let extractLines = vscode.commands.registerCommand('extension.extractLines', async () => {
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			let document = editor.document;
			let selection = editor.selection;

			// Get the word within the selection
			let word = document.getText(selection);
			let uri = vscode.Uri.parse('logorrhea:' + word);
			let doc = await vscode.workspace.openTextDocument(uri);
			await vscode.window.showTextDocument(doc, { preview: false });
		}
	});

	let deleteLinesBelowCursor = vscode.commands.registerCommand('extension.deleteLinesBelowCursor', async () => {
		let editor = vscode.window.activeTextEditor;
		if (editor) {
			const currentCursorLine = new vscode.Position(editor.selection.active.line + 1, 0);
			const endPosition = editor.document.lineAt(editor.document.lineCount - 1).range.end;
			editor.edit(editBuilder => {
				editBuilder.delete(new vscode.Range(currentCursorLine, endPosition))
			});
		}
	});

	let loadColorsFromConfigFile = vscode.commands.registerCommand('extension.loadColorsFromConfigFile', () => {
		if (!fs.existsSync(context.globalStoragePath)) {
			return;
		}

		const configFilePath = path.join(context.globalStoragePath, 'colorConfig.json');
		if (!fs.existsSync(configFilePath)) {
			return;
		}

		let editor = vscode.window.activeTextEditor;
		if (editor) {
			const currentColorScheme = JSON.parse(fs.readFileSync(configFilePath).toString());
			let currentDecorations: DecorationState = {};
			for (let keyword in currentColorScheme) {
				const lineDecorationType = vscode.window.createTextEditorDecorationType(currentColorScheme[keyword].colorOption);
				const regEx = new RegExp(escapeRegExp(keyword), "g");
				const text = editor.document.getText();
				const matches: vscode.DecorationOptions[] = [];
				let match;
				while (match = regEx.exec(text)) {
					let decoration;
					switch(currentColorScheme[keyword].type) {
						case 'line':
							const line = editor.document.positionAt(match.index).line;
							decoration = { range: editor.document.lineAt(line).range };
							break;
						default: // 'word'
							const startPos = editor.document.positionAt(match.index);
							const endPos = editor.document.positionAt(match.index + match[0].length);
							decoration = { range: new vscode.Range(startPos, endPos) };
							break;
					}
					if (decoration) {
						matches.push(decoration);
					}
				}
				editor.setDecorations(lineDecorationType, matches);

				currentDecorations[keyword] = lineDecorationType;
			}
			// save decorations to global state
			context.globalState.update('currentDecorations', currentDecorations);
			context.globalState.update('currentColorScheme', currentColorScheme);
		}
	});

	let saveColorsToConfigFile = vscode.commands.registerCommand('extension.saveColorsToConfigFile', async () => {
		if (!fs.existsSync(context.globalStoragePath)) {
			fs.mkdirSync(context.globalStoragePath);
		}

		const configFilePath = path.join(context.globalStoragePath, 'colorConfig.json');
		if (!fs.existsSync(configFilePath)) {
			fs.writeFileSync(configFilePath, '{}');
		}

		let colorConfig = JSON.parse(fs.readFileSync(configFilePath).toString());

			let currentColorScheme: ColorScheme = context.globalState.get('currentColorScheme', {});
		for (var keyword in currentColorScheme) {
			colorConfig[keyword] = currentColorScheme[keyword];
		}

		fs.writeFileSync(configFilePath, JSON.stringify(colorConfig, null, 2));

		var doc = await vscode.workspace.openTextDocument(configFilePath);
		await vscode.window.showTextDocument(doc);
	});

	let editColorsConfigFile = vscode.commands.registerCommand('extension.editColorsConfigFile', async () => {
		if (!fs.existsSync(context.globalStoragePath)) {
			fs.mkdirSync(context.globalStoragePath);
		}

		const configFilePath = path.join(context.globalStoragePath, 'colorConfig.json');
		if (!fs.existsSync(configFilePath)) {
			fs.writeFileSync(configFilePath, '{}');
		}

		var doc = await vscode.workspace.openTextDocument(configFilePath);
		await vscode.window.showTextDocument(doc);
	});

	context.subscriptions.push(setColor);
	context.subscriptions.push(dimLines);
	context.subscriptions.push(resetColor);
	context.subscriptions.push(extractLines);
	context.subscriptions.push(loadColorsFromConfigFile);
	context.subscriptions.push(saveColorsToConfigFile);
	context.subscriptions.push(editColorsConfigFile);
	context.subscriptions.push(deleteLinesBelowCursor);
}

// this method is called when your extension is deactivated
export function deactivate() {}
