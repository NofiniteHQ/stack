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
