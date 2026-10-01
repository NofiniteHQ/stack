package watcher

import (
	"fmt"
	"io/fs"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/fsnotify/fsnotify"
	"github.com/nofinitehq/stack/packages/nuicss-cli/pkg/compiler"
)

// WatchOptions configures file watching behavior
type WatchOptions struct {
	CompileOpts compiler.CompileOptions
	WatchDirs   []string
}

// Watch starts an fsnotify watcher loop and recompiles upon file changes
func Watch(opts WatchOptions) error {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return fmt.Errorf("failed to create watcher: %w", err)
	}
	defer watcher.Close()

	// Initial compilation
	res, err := compiler.Compile(opts.CompileOpts)
	if err != nil {
		fmt.Printf("⚠️ Initial compilation error: %v\n", err)
	} else {
		fmt.Printf("✓ Compiled %s (%d bytes) in %v\n", res.OutputPath, res.OutputBytes, res.Duration)
	}

	// Add input file directory to watcher
	if opts.CompileOpts.InputPath != "" {
		inputDir := filepath.Dir(opts.CompileOpts.InputPath)
		_ = watcher.Add(inputDir)
	}

	// Add watch directories
	watchDirs := opts.WatchDirs
	if len(watchDirs) == 0 {
		watchDirs = []string{"."}
	}

	for _, root := range watchDirs {
		_ = filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
			if err != nil {
				return nil
			}
			if d.IsDir() {
				name := d.Name()
				if name == "node_modules" || name == ".git" || name == ".next" || name == "dist" || name == "temp" {
					return filepath.SkipDir
				}
				_ = watcher.Add(path)
			}
			return nil
		})
	}

	fmt.Printf("\n👀 Watching for changes in %s and templates... (Press Ctrl+C to stop)\n", opts.CompileOpts.InputPath)

	var (
		mu         sync.Mutex
		debounceMu sync.Mutex
		timer      *time.Timer
	)

	for {
		select {
		case event, ok := <-watcher.Events:
			if !ok {
				return nil
			}

			// Ignore non-write/non-create events
			if event.Op&(fsnotify.Write|fsnotify.Create) == 0 {
				continue
			}

			// Filter by relevant extensions
			ext := strings.ToLower(filepath.Ext(event.Name))
			isCSS := ext == ".css"
			isTemplate := ext == ".html" || ext == ".tsx" || ext == ".jsx" || ext == ".vue" || ext == ".svelte" || ext == ".templ" || ext == ".php"

			if !isCSS && !isTemplate {
				continue
			}

			// Don't recompile on output file changes
			if filepath.Clean(event.Name) == filepath.Clean(opts.CompileOpts.OutputPath) {
				continue
			}

			debounceMu.Lock()
			if timer != nil {
				timer.Stop()
			}
			timer = time.AfterFunc(50*time.Millisecond, func() {
				mu.Lock()
				defer mu.Unlock()

				compileStart := time.Now()
				res, err := compiler.Compile(opts.CompileOpts)
				duration := time.Since(compileStart)

				if err != nil {
					fmt.Printf("[%s] ❌ Compilation error: %v\n", time.Now().Format("15:04:05"), err)
				} else {
					fmt.Printf("[%s] ⚡ Rebuilt %s (%d bytes) in %v\n", time.Now().Format("15:04:05"), res.OutputPath, res.OutputBytes, duration)
				}
			})
			debounceMu.Unlock()

		case err, ok := <-watcher.Errors:
			if !ok {
				return nil
			}
			fmt.Printf("⚠️ Watcher error: %v\n", err)
		}
	}
}
