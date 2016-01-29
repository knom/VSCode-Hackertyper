// Based on https://github.com/timmyreilly/TypewriterNoises-VSCode/blob/master/src/editor.ts

import {window, workspace, commands, Disposable, ExtensionContext, TextDocument} from 'vscode';
import * as vscode from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

export class HackerTyperObserver {
    private _disposable: Disposable;

    private _lastPosition: vscode.Position;

    private _sourceChar: number = 0;
    private _sourceFile: string;

    private _lastText: string = "";

    constructor() {
        // subscribe to selection change and editor activation events...
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        // window.onDidChangeActiveTextEditor(this._onEvent); //, this, subscriptions);

        this._sourceFile = fs.readFileSync(path.join(__dirname, "../hackercode.txt")).toString();

        this._disposable = Disposable.from(...subscriptions);
    }

    private _onEvent(e: vscode.TextEditorSelectionChangeEvent) {
        let selection: vscode.Selection = e.textEditor.selections[0];
        if (selection.isEmpty) {
            var position = selection.start;
            if (this._lastPosition) {
                if (position.isAfter(this._lastPosition)) {
                    var r = new vscode.Range(this._lastPosition, position);

                    var charsTyped = e.textEditor.document.getText(r).length;

                    var chars = this._sourceFile.substr(this._sourceChar, charsTyped);
                    this._sourceChar += charsTyped;

                    var newText = e.textEditor.document.getText();

                    if (this._lastText.length < newText.length) {
                        e.textEditor.edit((eb) => {
                            eb.replace(r, chars);
                            // eb.insert(r.end, "\r\n");
                        });
                    }
                }
            }
        }
        this._lastPosition = position;

        var newText = e.textEditor.document.getText();
        this._lastText = newText;
    }
} 