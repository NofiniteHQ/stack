package scanner

import (
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

var classRegex = regexp.MustCompile(`(?:class|className)\s*=\s*["']([^"']+)["']`)

// ScanResult contains extracted candidate classes
type ScanResult struct {
	TotalFilesScanned int
	ClassesFound      map[string]bool
}

// ScanDirectories walks through directories and collects class names used in template files
func ScanDirectories(roots []string) (*ScanResult, error) {
	result := &ScanResult{
		ClassesFound: make(map[string]bool),
	}

	validExts := map[string]bool{
		".html":  true,
		".htm":   true,
		".tsx":   true,
		".jsx":   true,
		".vue":   true,
		".svelte": true,
		".templ": true,
		".php":   true,
	}

	for _, root := range roots {
		_ = filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
			if err != nil {
				return nil
			}

			if d.IsDir() {
				name := d.Name()
				if name == "node_modules" || name == ".git" || name == ".next" || name == "dist" || name == "temp" {
					return filepath.SkipDir
				}
				return nil
			}

			ext := strings.ToLower(filepath.Ext(path))
			if !validExts[ext] {
				return nil
			}

			data, err := os.ReadFile(path)
			if err != nil {
				return nil
			}

			result.TotalFilesScanned++
			matches := classRegex.FindAllStringSubmatch(string(data), -1)
			for _, match := range matches {
				if len(match) > 1 {
					tokens := strings.Fields(match[1])
					for _, token := range tokens {
						result.ClassesFound[token] = true
					}
				}
			}

			return nil
		})
	}

	return result, nil
}
