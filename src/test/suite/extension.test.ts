import * as assert from "assert";
// import * as vscode from "vscode";
import { Parser } from "../../parser";
import * as vscode from "vscode";

suite("Parser Tests", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Remove TypeScript JSX Comments", async () => {
    const parser = new Parser();
    const document = await vscode.workspace.openTextDocument({
      content: `
        // This is a single line comment
        {/* This is a JSX comment */}
        const a = 1; // TODO: This should not be removed
        /* This is a multiline comment */
        const b = 2; /* NOTE: This should not be removed */
      `,
      language: "typescriptreact",
    });
    const editor = await vscode.window.showTextDocument(document);

    parser.SetRegex(editor, "typescriptreact");
    parser.FindSingleLineComments(editor);
    parser.FindMultilineComments(editor);
    parser.FindJSXComments(editor); // Add this line

    await vscode.workspace.applyEdit(parser.edit);

    const updatedText = document.getText();
    console.log(updatedText);
    assert.strictEqual(
      updatedText.includes("// This is a single line comment"),
      false,
      "Single line comment should be removed"
    );
    assert.strictEqual(
      updatedText.includes("{/* This is a JSX comment */}"),
      false,
      "JSX comment should be removed"
    );
    assert.strictEqual(
      updatedText.includes("const a = 1; // TODO: This should not be removed"),
      true,
      "TODO comment should not be removed"
    );
    assert.strictEqual(
      updatedText.includes("/* This is a multiline comment */"),
      false,
      "Multiline comment should be removed"
    );
    assert.strictEqual(
      updatedText.includes(
        "const b = 2; /* NOTE: This should not be removed */"
      ),
      true,
      "NOTE comment should not be removed"
    );
  });
});
