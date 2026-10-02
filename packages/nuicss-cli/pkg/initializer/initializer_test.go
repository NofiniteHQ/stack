package initializer

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestInit(t *testing.T) {
	tempDir := t.TempDir()

	err := Init(InitOptions{TargetDir: tempDir})
	if err != nil {
		t.Fatalf("Init failed: %v", err)
	}

	// Verify input.css
	inputPath := filepath.Join(tempDir, "input.css")
	if _, err := os.Stat(inputPath); os.IsNotExist(err) {
		t.Errorf("input.css was not created")
	}

	// Verify nuicss.config.ts
	configPath := filepath.Join(tempDir, "nuicss.config.ts")
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		t.Errorf("nuicss.config.ts was not created")
	}

	// Verify .vscode/settings.json
	settingsPath := filepath.Join(tempDir, ".vscode", "settings.json")
	data, err := os.ReadFile(settingsPath)
	if err != nil {
		t.Fatalf("Failed to read settings.json: %v", err)
	}

	if !strings.Contains(string(data), "nuicss.html-data.json") {
		t.Errorf("settings.json missing html.customData")
	}

	// Verify custom data files
	htmlDataPath := filepath.Join(tempDir, ".vscode", "nuicss.html-data.json")
	if _, err := os.Stat(htmlDataPath); os.IsNotExist(err) {
		t.Errorf("nuicss.html-data.json was not created")
	}
}

func TestInitJSONCPreservation(t *testing.T) {
	tempDir := t.TempDir()
	vscodeDir := filepath.Join(tempDir, ".vscode")
	if err := os.MkdirAll(vscodeDir, 0755); err != nil {
		t.Fatal(err)
	}

	initialSettings := `// Developer workspace settings
{
  /* Critical comment */
  "editor.tabSize": 2,
  "files.autoSave": "afterDelay"
}`
	settingsPath := filepath.Join(vscodeDir, "settings.json")
	if err := os.WriteFile(settingsPath, []byte(initialSettings), 0644); err != nil {
		t.Fatal(err)
	}

	err := Init(InitOptions{TargetDir: tempDir})
	if err != nil {
		t.Fatalf("Init failed: %v", err)
	}

	// 1. Verify backup was created
	bakPath := settingsPath + ".bak"
	if _, err := os.Stat(bakPath); os.IsNotExist(err) {
		t.Errorf("settings.json.bak was not created")
	}

	// 2. Verify comments and existing keys were NOT destroyed
	updatedData, err := os.ReadFile(settingsPath)
	if err != nil {
		t.Fatal(err)
	}
	updatedStr := string(updatedData)

	if !strings.Contains(updatedStr, "Critical comment") {
		t.Errorf("Expected 'Critical comment' to be preserved, got: %s", updatedStr)
	}
	if !strings.Contains(updatedStr, "editor.tabSize") {
		t.Errorf("Expected 'editor.tabSize' to be preserved, got: %s", updatedStr)
	}
	if !strings.Contains(updatedStr, "nuicss.html-data.json") {
		t.Errorf("Expected customData to be added, got: %s", updatedStr)
	}
}
