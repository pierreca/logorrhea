// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const colorPalette: {[keys: string]: string} = {
  AliceBlue: '#F0F8FF',
  AntiqueWhite: '#FAEBD7',
  Aqua: '#00FFFF',
  Aquamarine: '#7FFFD4',
  Azure: '#F0FFFF',
  Beige: '#F5F5DC',
  Bisque: '#FFE4C4',
  Black: '#000000',
  BlanchedAlmond: '#FFEBCD',
  Blue: '#0000FF',
  BlueViolet: '#8A2BE2',
  Brown: '#A52A2A',
  BurlyWood: '#DEB887',
  CadetBlue: '#5F9EA0',
  Chartreuse: '#7FFF00',
  Chocolate: '#D2691E',
  Coral: '#FF7F50',
  CornflowerBlue: '#6495ED',
  Cornsilk: '#FFF8DC',
  Crimson: '#DC143C',
  Cyan: '#00FFFF',
  DarkBlue: '#00008B',
  DarkCyan: '#008B8B',
  DarkGoldenRod: '#B8860B',
  DarkGray: '#A9A9A9',
  DarkGrey: '#A9A9A9',
  DarkGreen: '#006400',
  DarkKhaki: '#BDB76B',
  DarkMagenta: '#8B008B',
  DarkOliveGreen: '#556B2F',
  DarkOrange: '#FF8C00',
  DarkOrchid: '#9932CC',
  DarkRed: '#8B0000',
  DarkSalmon: '#E9967A',
  DarkSeaGreen: '#8FBC8F',
  DarkSlateBlue: '#483D8B',
  DarkSlateGray: '#2F4F4F',
  DarkSlateGrey: '#2F4F4F',
  DarkTurquoise: '#00CED1',
  DarkViolet: '#9400D3',
  DeepPink: '#FF1493',
  DeepSkyBlue: '#00BFFF',
  DimGray: '#696969',
  DimGrey: '#696969',
  DodgerBlue: '#1E90FF',
  FireBrick: '#B22222',
  FloralWhite: '#FFFAF0',
  ForestGreen: '#228B22',
  Fuchsia: '#FF00FF',
  Gainsboro: '#DCDCDC',
  GhostWhite: '#F8F8FF',
  Gold: '#FFD700',
  GoldenRod: '#DAA520',
  Gray: '#808080',
  Grey: '#808080',
  Green: '#008000',
  GreenYellow: '#ADFF2F',
  HoneyDew: '#F0FFF0',
  HotPink: '#FF69B4',
  IndianRed: '	#CD5C5C	 	Shades',
  Indigo: '	#4B0082	 	Shades',
  Ivory: '#FFFFF0',
  Khaki: '#F0E68C',
  Lavender: '#E6E6FA',
  LavenderBlush: '#FFF0F5',
  LawnGreen: '#7CFC00',
  LemonChiffon: '#FFFACD',
  LightBlue: '#ADD8E6',
  LightCoral: '#F08080',
  LightCyan: '#E0FFFF',
  LightGoldenRodYellow: '#FAFAD2',
  LightGray: '#D3D3D3',
  LightGrey: '#D3D3D3',
  LightGreen: '#90EE90',
  LightPink: '#FFB6C1',
  LightSalmon: '#FFA07A',
  LightSeaGreen: '#20B2AA',
  LightSkyBlue: '#87CEFA',
  LightSlateGray: '#778899',
  LightSlateGrey: '#778899',
  LightSteelBlue: '#B0C4DE',
  LightYellow: '#FFFFE0',
  Lime: '#00FF00',
  LimeGreen: '#32CD32',
  Linen: '#FAF0E6',
  Magenta: '#FF00FF',
  Maroon: '#800000',
  MediumAquaMarine: '#66CDAA',
  MediumBlue: '#0000CD',
  MediumOrchid: '#BA55D3',
  MediumPurple: '#9370DB',
  MediumSeaGreen: '#3CB371',
  MediumSlateBlue: '#7B68EE',
  MediumSpringGreen: '#00FA9A',
  MediumTurquoise: '#48D1CC',
  MediumVioletRed: '#C71585',
  MidnightBlue: '#191970',
  MintCream: '#F5FFFA',
  MistyRose: '#FFE4E1',
  Moccasin: '#FFE4B5',
  NavajoWhite: '#FFDEAD',
  Navy: '#000080',
  OldLace: '#FDF5E6',
  Olive: '#808000',
  OliveDrab: '#6B8E23',
  Orange: '#FFA500',
  OrangeRed: '#FF4500',
  Orchid: '#DA70D6',
  PaleGoldenRod: '#EEE8AA',
  PaleGreen: '#98FB98',
  PaleTurquoise: '#AFEEEE',
  PaleVioletRed: '#DB7093',
  PapayaWhip: '#FFEFD5',
  PeachPuff: '#FFDAB9',
  Peru: '#CD853F',
  Pink: '#FFC0CB',
  Plum: '#DDA0DD',
  PowderBlue: '#B0E0E6',
  Purple: '#800080',
  RebeccaPurple: '#663399',
  Red: '#FF0000',
  RosyBrown: '#BC8F8F',
  RoyalBlue: '#4169E1',
  SaddleBrown: '#8B4513',
  Salmon: '#FA8072',
  SandyBrown: '#F4A460',
  SeaGreen: '#2E8B57',
  SeaShell: '#FFF5EE',
  Sienna: '#A0522D',
  Silver: '#C0C0C0',
  SkyBlue: '#87CEEB',
  SlateBlue: '#6A5ACD',
  SlateGray: '#708090',
  SlateGrey: '#708090',
  Snow: '#FFFAFA',
  SpringGreen: '#00FF7F',
  SteelBlue: '#4682B4',
  Tan: '#D2B48C',
  Teal: '#008080',
  Thistle: '#D8BFD8',
  Tomato: '#FF6347',
  Turquoise: '#40E0D0',
  Violet: '#EE82EE',
  Wheat: '#F5DEB3',
  White: '#FFFFFF',
  WhiteSmoke: '#F5F5F5',
  Yellow: '#FFFF00',
	YellowGreen: '#9ACD32'
};

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
}

// this method is called when your extension is deactivated
export function deactivate() {}
