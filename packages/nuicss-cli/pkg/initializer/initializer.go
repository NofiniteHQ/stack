package initializer

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/nofinitehq/stack/packages/nuicss-cli/pkg/embedded"
)

// InitOptions contains options for the init command
type InitOptions struct {
	TargetDir string
}

// stripJSONComments removes single-line (//) and multi-line (/* */) comments from JSON text.
func stripJSONComments(content string) string {
	singleLine := regexp.MustCompile(`(?m)//.*$`)
	multiLine := regexp.MustCompile(`/\*[\s\S]*?\*/`)
	res := multiLine.ReplaceAllString(content, "")
	return singleLine.ReplaceAllString(res, "")
}

// UpdateSettingsJSON safely merges customData into settings.json without destroying existing comments or formatting.
func UpdateSettingsJSON(originalContent string, htmlEntry, cssEntry string) (string, error) {
	trimmed := strings.TrimSpace(originalContent)
	if trimmed == "" || trimmed == "{}" {
		settings := map[string][]string{
			"html.customData": {htmlEntry},
			"css.customData":  {cssEntry},
		}
		data, err := json.MarshalIndent(settings, "", "  ")
		return string(data) + "\n", err
	}

	content := originalContent

	// Helper to ensure an entry is in an array within JSON text
	ensureEntry := func(text, key, entry string) string {
		keyRegex := regexp.MustCompile(`"` + regexp.QuoteMeta(key) + `"\s*:\s*\[([^\]]*)\]`)
		match := keyRegex.FindStringSubmatchIndex(text)

		if match != nil {
			// Key exists: check if entry is already in the array
			arrayBody := text[match[2]:match[3]]
			if strings.Contains(arrayBody, entry) {
				return text // already present
			}

			// Add entry into array body
			trimmedBody := strings.TrimSpace(arrayBody)
			var replacement string
			if trimmedBody == "" {
				replacement = fmt.Sprintf(`"%s"`, entry)
			} else {
				replacement = fmt.Sprintf(`%s, "%s"`, trimmedBody, entry)
			}
			return text[:match[2]] + " " + replacement + " " + text[match[3]:]
		}

		// Key does not exist: insert before final closing brace
		lastBrace := strings.LastIndex(text, "}")
		if lastBrace == -1 {
			return text
		}

		before := strings.TrimRight(text[:lastBrace], " \t\r\n")
		needsComma := !strings.HasSuffix(before, "{") && !strings.HasSuffix(before, ",")
		comma := ""
		if needsComma {
			comma = ","
		}

		insertion := fmt.Sprintf("%s\n  \"%s\": [\n    \"%s\"\n  ]\n", comma, key, entry)
		return before + insertion + text[lastBrace:]
	}

	content = ensureEntry(content, "html.customData", htmlEntry)
	content = ensureEntry(content, "css.customData", cssEntry)

	return content, nil
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

	// 2. Create nuicss.config.ts if no config exists
	configTsPath := filepath.Join(dir, "nuicss.config.ts")
	configJsPath := filepath.Join(dir, "nuicss.config.js")
	configMjsPath := filepath.Join(dir, "nuicss.config.mjs")
	if _, err := os.Stat(configTsPath); os.IsNotExist(err) {
		if _, errJs := os.Stat(configJsPath); os.IsNotExist(errJs) {
			if _, errMjs := os.Stat(configMjsPath); os.IsNotExist(errMjs) {
				defaultConfig := `import { defineConfig, nuicssPreset } from '@nofinite/nuicss';

export default defineConfig({
  presets: [
    nuicssPreset(),
  ],
});
`
				if err := os.WriteFile(configTsPath, []byte(defaultConfig), 0644); err == nil {
					fmt.Println("  ✓ Created nuicss.config.ts")
				}
			}
		}
	}

	// 3. Setup .vscode directory and custom data files
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

	// 4. Update .vscode/settings.json safely
	settingsPath := filepath.Join(vscodeDir, "settings.json")
	var existingContent string

	if data, err := os.ReadFile(settingsPath); err == nil {
		existingContent = string(data)
		// Create a backup
		bakPath := settingsPath + ".bak"
		_ = os.WriteFile(bakPath, data, 0644)
	}

	updated, err := UpdateSettingsJSON(
		existingContent,
		"./.vscode/nuicss.html-data.json",
		"./.vscode/nuicss.css-data.json",
	)
	if err != nil {
		return fmt.Errorf("failed to process settings.json: %w", err)
	}

	if err := os.WriteFile(settingsPath, []byte(updated), 0644); err != nil {
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
