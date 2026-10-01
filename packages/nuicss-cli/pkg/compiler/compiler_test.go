package compiler

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestCompile(t *testing.T) {
	tempDir := t.TempDir()
	inputPath := filepath.Join(tempDir, "input.css")
	outputPath := filepath.Join(tempDir, "output.css")

	inputCSS := `
	/* Custom styles */
	@nuicss;

	.custom-hero {
		background: var(--bg-surface);
	}
	`

	if err := os.WriteFile(inputPath, []byte(inputCSS), 0644); err != nil {
		t.Fatalf("Failed to write test input: %v", err)
	}

	res, err := Compile(CompileOptions{
		InputPath:  inputPath,
		OutputPath: outputPath,
		Minify:     false,
	})

	if err != nil {
		t.Fatalf("Compile failed: %v", err)
	}

	if res.OutputBytes == 0 {
		t.Errorf("Expected non-zero output bytes")
	}

	data, err := os.ReadFile(outputPath)
	if err != nil {
		t.Fatalf("Failed to read output: %v", err)
	}

	outputStr := string(data)
	if strings.Contains(outputStr, "@nuicss;") {
		t.Errorf("Expected @nuicss; to be replaced")
	}

	if !strings.Contains(outputStr, ".btn") {
		t.Errorf("Expected compiled CSS to contain .btn")
	}

	if !strings.Contains(outputStr, ".custom-hero") {
		t.Errorf("Expected compiled CSS to contain custom-hero")
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
