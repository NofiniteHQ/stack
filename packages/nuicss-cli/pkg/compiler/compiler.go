package compiler

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"regexp"
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

// DirectiveRegex matches @nuicss and @import directives in various formats
var DirectiveRegex = regexp.MustCompile(`@(?:nuicss(?:\s+([a-zA-Z0-9_-]+))?|import\s+["'](?:@nofinite\/)?nuicss(?:\/([a-zA-Z0-9_-]+))?["'])\s*;?`)

// Compile processes the input CSS file and outputs the compiled NUICSS stylesheet
func Compile(opts CompileOptions) (*CompileResult, error) {
	start := time.Now()

	var inputContent string
	var inputBytes int

	if opts.InputPath != "" && opts.InputPath != "-" {
		data, err := os.ReadFile(opts.InputPath)
		if err != nil {
			return nil, fmt.Errorf("failed to read input file %q: %w", opts.InputPath, err)
		}
		inputContent = string(data)
		inputBytes = len(data)
	} else if opts.InputPath == "-" {
		// Read from stdin
		data, err := io.ReadAll(os.Stdin)
		if err != nil {
			return nil, fmt.Errorf("failed to read from stdin: %w", err)
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

	// Directives handling via multi-variant regex
	if DirectiveRegex.MatchString(inputContent) {
		// Replace matched directive cleanly with base design system
		compiled = DirectiveRegex.ReplaceAllString(inputContent, baseCSS)
	} else if strings.TrimSpace(inputContent) == "" {
		// Empty input file or no input: output full base design system
		compiled = baseCSS
	} else {
		// User provided custom CSS without directive: prepend NUICSS base
		compiled = baseCSS + "\n\n" + inputContent
	}

	// Apply minification to any user custom CSS if requested
	if opts.Minify {
		compiled = minifier.Minify(compiled)
	}

	// Write output
	if opts.OutputPath == "-" {
		// Stream to stdout
		if _, err := os.Stdout.Write([]byte(compiled)); err != nil {
			return nil, fmt.Errorf("failed to write to stdout: %w", err)
		}
	} else if opts.OutputPath != "" {
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
