package compiler

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestCompileVariants(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		contains string
	}{
		{
			name:     "standard semicolon",
			input:    "@nuicss;\n.custom-hero { color: red; }",
			contains: ".btn",
		},
		{
			name:     "trailing space without semicolon (Bug 2 fix)",
			input:    "@nuicss \n.custom-hero { color: red; }",
			contains: ".btn",
		},
		{
			name:     "newline without semicolon",
			input:    "@nuicss\n.custom-hero { color: red; }",
			contains: ".btn",
		},
		{
			name:     "import syntax",
			input:    "@import \"nuicss\";\n.custom-hero { color: red; }",
			contains: ".btn",
		},
		{
			name:     "empty input file",
			input:    "",
			contains: ".btn",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tempDir := t.TempDir()
			inputPath := filepath.Join(tempDir, "input.css")
			outputPath := filepath.Join(tempDir, "output.css")

			if err := os.WriteFile(inputPath, []byte(tt.input), 0644); err != nil {
				t.Fatal(err)
			}

			res, err := Compile(CompileOptions{
				InputPath:  inputPath,
				OutputPath: outputPath,
				Minify:     false,
			})
			if err != nil {
				t.Fatalf("Compile failed: %v", err)
			}

			data, err := os.ReadFile(outputPath)
			if err != nil {
				t.Fatal(err)
			}
			out := string(data)

			if strings.Contains(out, "@nuicss") {
				t.Errorf("Output should not contain raw @nuicss directive literal")
			}
			if !strings.Contains(out, tt.contains) {
				t.Errorf("Output missing expected content %q, total length: %d", tt.contains, len(out))
			}
			if res.OutputBytes != len(data) {
				t.Errorf("Mismatch in reported bytes: %d vs %d", res.OutputBytes, len(data))
			}
		})
	}
}

func TestCompileMinify(t *testing.T) {
	tempDir := t.TempDir()
	inputPath := filepath.Join(tempDir, "input.css")
	outputPath := filepath.Join(tempDir, "output.min.css")

	inputCSS := `@nuicss;`
	if err := os.WriteFile(inputPath, []byte(inputCSS), 0644); err != nil {
		t.Fatalf("Failed to write test input: %v", err)
	}

	res, err := Compile(CompileOptions{
		InputPath:  inputPath,
		OutputPath: outputPath,
		Minify:     true,
	})

	if err != nil {
		t.Fatalf("Compile with minify failed: %v", err)
	}

	data, err := os.ReadFile(outputPath)
	if err != nil {
		t.Fatalf("Failed to read output: %v", err)
	}

	outputStr := string(data)
	if strings.Contains(outputStr, "/*") {
		t.Errorf("Expected no comments in minified output")
	}
	if len(outputStr) != res.OutputBytes {
		t.Errorf("Length mismatch: %d vs %d", len(outputStr), res.OutputBytes)
	}
}
