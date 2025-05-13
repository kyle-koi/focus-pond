// mindful-coder/src/extension.ts

import * as vscode from 'vscode';

let timer: ReturnType<typeof setInterval> | null = null;
let statusBar: vscode.StatusBarItem | null = null;
let minutesLeft: number = 0;

export function activate(context: vscode.ExtensionContext) {
	const intervalKey = 'mindfulCoder.interval';
	const defaultInterval = 30;

	const startMindfulTimer = () => {
		vscode.window.showInformationMessage('Mindful Coder has started.');
		const config = vscode.workspace.getConfiguration('mindfulCoder');
		const interval: number = config.get<number>('interval') ?? defaultInterval;
		minutesLeft = interval;

		if (!statusBar) {
			statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
			statusBar.command = 'zen.stop';
			statusBar.tooltip = 'Mindful Coder - Click to stop';
			statusBar.show();
		}

		else {
			statusBar.command = 'zen.stop';
			statusBar.tooltip = 'Mindful Coder - Click to stop';
		}

		statusBar.text = `🍣 Mindful Tip in ${minutesLeft} min`;

		timer = setInterval(() => {
			minutesLeft--;
			if (minutesLeft <= 0) {
				vscode.window.showInformationMessage(getRandomTip());
				minutesLeft = interval;
			}
			if (statusBar) {
				statusBar.text = `🍣 Mindful Tip in ${minutesLeft} min`;
			}
		}, 60000);
	};

	const stopMindfulTimer = () => {
		vscode.window.showInformationMessage('Mindful Coder has been stopped.');
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
		if (statusBar) {
			statusBar.text = '😴 Mindful Coder stopped';
			statusBar.command = 'zen.start';
		}
	};

	const startCommand = vscode.commands.registerCommand('zen.start', startMindfulTimer);
	const stopCommand = vscode.commands.registerCommand('zen.stop', stopMindfulTimer);

	context.subscriptions.push(startCommand, stopCommand);
}

function getRandomTip(): string {
	const tips: string[] = [
		'Take a deep breath 🌬️',
		'Relax your shoulders 🧎',
		'Blink slowly and stretch 👀',
		'Grab a glass of water 💧',
		'Look away from the screen for 20 seconds 👀',
		'Check your posture 🪑'
	];
	return tips[Math.floor(Math.random() * tips.length)];
}

export function deactivate() {
	if (timer) {
		clearInterval(timer);
	}
}