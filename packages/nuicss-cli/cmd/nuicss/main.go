package main

import (
	"flag"
	"fmt"
	"os"
	"strings"

	"github.com/nofinitehq/stack/packages/nuicss-cli/pkg/compiler"
	"github.com/nofinitehq/stack/packages/nuicss-cli/pkg/initializer"
	"github.com/nofinitehq/stack/packages/nuicss-cli/pkg/migrator"
	"github.com/nofinitehq/stack/packages/nuicss-cli/pkg/scaffolder"
	"github.com/nofinitehq/stack/packages/nuicss-cli/pkg/tokens"
	"github.com/nofinitehq/stack/packages/nuicss-cli/pkg/watcher"
)

const Version = "0.1.0"

func printHelp() {
	fmt.Println(`NUICSS Standalone Compiler CLI (Go Native)

Usage:
  nuicss [command] [options]
  nuicss -i <input.css> -o <output.css> [options]

Commands:
  (default)          Compile CSS: nuicss -i input.css -o output.css [-w] [-m]
  init               Initialize starter CSS and native IDE IntelliSense
  migrate [path]     Convert Tailwind utility soup to NUICSS superclasses
  tokens             Inspect OKLCH color palettes and design tokens
  add <component>    Scaffold ecosystem UI component (e.g. nuicss add modal)
  list               List available components across NUI, Charts, Kanban, Markon
  version, -v        Display CLI version
  help, -h           Show this help message

Options:
  -i, --input        Path to input CSS file containing @nuicss; (default: "input.css")
  -o, --output       Path to output compiled CSS file (default: "dist/output.css")
  -w, --watch        Watch input CSS and template files for live rebuilds
  -m, --minify       Minify generated CSS for production
  --dry-run          Preview changes without modifying files (used with migrate)`)
}

func main() {
	args := os.Args[1:]

	if len(args) == 0 {
		printHelp()
		os.Exit(0)
	}

	command := args[0]

	// Handle subcommands
	switch command {
	case "version", "-v", "--version":
		fmt.Printf("nuicss v%s (standalone Go engine)\n", Version)
		os.Exit(0)

	case "help", "-h", "--help":
		printHelp()
		os.Exit(0)

	case "init":
		targetDir := "."
		if len(args) > 1 && !strings.HasPrefix(args[1], "-") {
			targetDir = args[1]
		}
		if err := initializer.Init(initializer.InitOptions{TargetDir: targetDir}); err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}
		os.Exit(0)

	case "tokens":
		tokens.PrintTokens()
		os.Exit(0)

	case "list":
		scaffolder.ListComponents()
		os.Exit(0)

	case "add":
		if len(args) < 2 {
			fmt.Fprintln(os.Stderr, "Error: missing component name. Usage: nuicss add <component>")
			fmt.Fprintln(os.Stderr, "Run 'nuicss list' to view available components.")
			os.Exit(1)
		}
		for _, comp := range args[1:] {
			if strings.HasPrefix(comp, "-") {
				continue
			}
			if err := scaffolder.AddComponent(comp); err != nil {
				fmt.Fprintf(os.Stderr, "Error: %v\n", err)
				os.Exit(1)
			}
		}
		os.Exit(0)

	case "migrate":
		dryRun := false
		targetPattern := "."
		for _, a := range args[1:] {
			if a == "--dry-run" {
				dryRun = true
			} else if !strings.HasPrefix(a, "-") {
				targetPattern = a
			}
		}
		if err := migrator.RunMigration(migrator.MigrateOptions{
			TargetPattern: targetPattern,
			DryRun:        dryRun,
		}); err != nil {
			fmt.Fprintf(os.Stderr, "Migration error: %v\n", err)
			os.Exit(1)
		}
		os.Exit(0)
	}

	// Default mode: Compile CSS with flags
	fs := flag.NewFlagSet("compile", flag.ExitOnError)
	var (
		inputPath  string
		outputPath string
		watchMode  bool
		minify     bool
	)

	fs.StringVar(&inputPath, "i", "input.css", "Input CSS file")
	fs.StringVar(&inputPath, "input", "input.css", "Input CSS file")
	fs.StringVar(&outputPath, "o", "dist/output.css", "Output CSS file")
	fs.StringVar(&outputPath, "output", "dist/output.css", "Output CSS file")
	fs.BoolVar(&watchMode, "w", false, "Watch mode")
	fs.BoolVar(&watchMode, "watch", false, "Watch mode")
	fs.BoolVar(&minify, "m", false, "Minify output")
	fs.BoolVar(&minify, "minify", false, "Minify output")

	if err := fs.Parse(args); err != nil {
		fmt.Fprintf(os.Stderr, "Flag error: %v\n", err)
		os.Exit(1)
	}

	compileOpts := compiler.CompileOptions{
		InputPath:  inputPath,
		OutputPath: outputPath,
		Minify:     minify,
	}

	if watchMode {
		if err := watcher.Watch(watcher.WatchOptions{
			CompileOpts: compileOpts,
		}); err != nil {
			fmt.Fprintf(os.Stderr, "Watch error: %v\n", err)
			os.Exit(1)
		}
		return
	}

	res, err := compiler.Compile(compileOpts)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Compilation error: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("\n⚡ NUICSS compiled successfully!\n")
	fmt.Printf("   Output:   %s (%d bytes)\n", res.OutputPath, res.OutputBytes)
	fmt.Printf("   Duration: %v\n\n", res.Duration)
}
