package initializer

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/nofinitehq/stack/packages/nuicss-cli/pkg/embedded"
)

// InitOptions contains options for the init command
type InitOptions struct {
	TargetDir string
}

// Init initializes a new NUICSS project configuration and native IDE custom data
func Init(opts InitOptions) error {
	dir := opts.TargetDir
	if dir == "" {
		dir = "."
	}

	fmt.Println("\n🚀 Initializing NUICSS project...")

	// 1. Create input.css if it doesn't exist
	inputPath := filepath.Join(dir, "input.css")
	if _, err := os.Stat(inputPath); os.IsNotExist(err) {
		defaultInput := `@nuicss;

/* Add your project-specific overrides or custom components below */
`
		if err := os.WriteFile(inputPath, []byte(defaultInput), 0644); err != nil {
			return fmt.Errorf("failed to create input.css: %w", err)
		}
		fmt.Println("  ✓ Created input.css with @nuicss; directive")
	} else {
		fmt.Println("  ℹ input.css already exists")
	}

	// 2. Setup .vscode directory and custom data files
	vscodeDir := filepath.Join(dir, ".vscode")
	if err := os.MkdirAll(vscodeDir, 0755); err != nil {
		return fmt.Errorf("failed to create .vscode directory: %w", err)
	}

	htmlDataPath := filepath.Join(vscodeDir, "nuicss.html-data.json")
	if err := os.WriteFile(htmlDataPath, []byte(embedded.HTMLDataJSON), 0644); err != nil {
		return fmt.Errorf("failed to write nuicss.html-data.json: %w", err)
	}

	cssDataPath := filepath.Join(vscodeDir, "nuicss.css-data.json")
	if err := os.WriteFile(cssDataPath, []byte(embedded.CSSDataJSON), 0644); err != nil {
		return fmt.Errorf("failed to write nuicss.css-data.json: %w", err)
	}

	// 3. Update or create .vscode/settings.json
	settingsPath := filepath.Join(vscodeDir, "settings.json")
	settings := make(map[string]interface{})

	if data, err := os.ReadFile(settingsPath); err == nil {
		_ = json.Unmarshal(data, &settings)
	}

	// Helper to ensure an entry is in a string array
	addToArray := func(key, entry string) {
		var list []interface{}
		if existing, ok := settings[key]; ok {
			if arr, ok := existing.([]interface{}); ok {
				list = arr
			}
		}
		exists := false
		for _, v := range list {
			if s, ok := v.(string); ok && s == entry {
				exists = true
				break
			}
		}
		if !exists {
			list = append(list, entry)
		}
		settings[key] = list
	}

	addToArray("html.customData", "./.vscode/nuicss.html-data.json")
	addToArray("css.customData", "./.vscode/nuicss.css-data.json")

	formatted, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to format settings.json: %w", err)
	}

	if err := os.WriteFile(settingsPath, formatted, 0644); err != nil {
		return fmt.Errorf("failed to write settings.json: %w", err)
	}

	fmt.Println("  ✓ Configured .vscode/settings.json (Native VS Code & Cursor IntelliSense enabled)")
	fmt.Println("  ✓ Generated .vscode/nuicss.html-data.json (50+ superclasses autocomplete)")
	fmt.Println("  ✓ Generated .vscode/nuicss.css-data.json (OKLCH design tokens autocomplete)")
	fmt.Println("\n🎉 NUICSS is ready! Compile your stylesheet with:")
	fmt.Println("   nuicss -i input.css -o dist/output.css --watch")
	fmt.Println()

	return nil
}
