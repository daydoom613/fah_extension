import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    console.log('Fahhh extension is now listening for instant terminal crashes!');

    const audioFilePath = path.join(context.extensionPath, 'media', 'fahhh.mp3');
    const vbsPath = path.join(context.extensionPath, 'media', 'play.vbs');

    // 1. Create a tiny, lightning-fast VBScript file automatically if it doesn't exist
    if (!fs.existsSync(vbsPath)) {
        const vbsCode = `
Dim Sound
Set Sound = CreateObject("WMPlayer.OCX.7")
Sound.URL = WScript.Arguments.Item(0)
Sound.settings.volume = 100
Sound.Controls.play
WScript.Sleep 3000 ' Keep script alive for 3 seconds so the sound finishes playing
        `;
        fs.writeFileSync(vbsPath, vbsCode.trim());
    }

    // 2. Listen for the terminal crash
    const terminalListener = vscode.window.onDidEndTerminalShellExecution((event) => {
        
        // If the code crashes (exitCode > 0)
        if (event.exitCode && event.exitCode !== 0) {
            console.log('\nExecution failed! Playing Fahhh instantly...\n');
            
            // 3. Execute the VBScript using Windows 'cscript' (boots in milliseconds)
            exec(`cscript //nologo "${vbsPath}" "${audioFilePath}"`);
        }
    });

    context.subscriptions.push(terminalListener);
}

export function deactivate() {}