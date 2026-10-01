package compiler

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/nofinitehq/stack/packages/nuicss-cli/pkg/embedded"
	"github.com/nofinitehq/stack/packages/nuicss-cli/pkg/minifier"
)

// CompileOptions represents compilation options for NUICSS CLI
type CompileOptions struct {
	InputPath    string
	OutputPath   string
	Minify       bool
	ContentGlobs []string
}

// CompileResult holds metrics and result data after compilation
type CompileResult struct {
	InputBytes  int
	OutputBytes int
	Duration    time.Duration
	OutputPath  string
}

// Compile processes the input CSS file and outputs the compiled NUICSS stylesheet
func Compile(opts CompileOptions) (*CompileResult, error) {
	start := time.Now()

	var inputContent string
	var inputBytes int

	if opts.InputPath != "" {
		data, err := os.ReadFile(opts.InputPath)
		if err != nil {
			return nil, fmt.Errorf("failed to read input file %q: %w", opts.InputPath, err)
		}
		inputContent = string(data)
		inputBytes = len(data)
	}

	var baseCSS string
	if opts.Minify {
		baseCSS = embedded.StylesMinCSS
	} else {
		baseCSS = embedded.StylesCSS
	}

	var compiled string

	// Directives handling
	hasNuicssDirective := strings.Contains(inputContent, "@nuicss;") ||
		strings.Contains(inputContent, "@nuicss ")

	if hasNuicssDirective {
		// Replace @nuicss; with base design system
		compiled = strings.ReplaceAll(inputContent, "@nuicss;", baseCSS)
	} else if strings.TrimSpace(inputContent) == "" {
		// Empty input file: output full base design system
		compiled = baseCSS
	} else {
		// User provided custom CSS without directive: prepend NUICSS base
		compiled = baseCSS + "\n\n" + inputContent
	}

	// Apply minification if requested
	if opts.Minify {
		compiled = minifier.Minify(compiled)
	}

	// Write output
	if opts.OutputPath != "" {
		dir := filepath.Dir(opts.OutputPath)
		if dir != "." && dir != "" {
			if err := os.MkdirAll(dir, 0755); err != nil {
				return nil, fmt.Errorf("failed to create directory %q: %w", dir, err)
			}
		}

		if err := os.WriteFile(opts.OutputPath, []byte(compiled), 0644); err != nil {
			return nil, fmt.Errorf("failed to write output file %q: %w", opts.OutputPath, err)
		}
	}

	return &CompileResult{
		InputBytes:  inputBytes,
		OutputBytes: len(compiled),
		Duration:    time.Since(start),
		OutputPath:  opts.OutputPath,
	}, nil
}
