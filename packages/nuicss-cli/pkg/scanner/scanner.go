package scanner

import (
	"bufio"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// Matches class and className attributes with quotes, JSX expressions, or template backticks
var classRegex = regexp.MustCompile(`(?:class|className)\s*=\s*(?:\{?\s*["'` + "`" + `])([^"'` + "`" + `]+)(?:["'` + "`" + `]\s*\}?)`)

// Matches hardcoded hex color literals: #fff, #ffffff, #ffffff80
var hexColorRegex = regexp.MustCompile(`#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b`)

// DiagnosticIssue describes a design token or architecture violation
type DiagnosticIssue struct {
	FilePath   string
	Line       int
	Rule       string
	Message    string
	Suggestion string
}

// CheckReport holds all detected architectural and design token violations
type CheckReport struct {
	TotalFilesScanned int
	Issues            []DiagnosticIssue
}

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
		".html":   true,
		".htm":    true,
		".tsx":    true,
		".jsx":    true,
		".vue":    true,
		".svelte": true,
		".templ":  true,
		".php":    true,
		".astro":  true,
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
				if len(match) > 1 && match[1] != "" {
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

// CheckDirectories inspects source files for design token and architectural compliance
func CheckDirectories(roots []string) (*CheckReport, error) {
	report := &CheckReport{
		Issues: make([]DiagnosticIssue, 0),
	}

	validExts := map[string]bool{
		".html":   true,
		".htm":    true,
		".tsx":    true,
		".jsx":    true,
		".vue":    true,
		".svelte": true,
		".astro":  true,
		".css":    true,
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

			file, err := os.Open(path)
			if err != nil {
				return nil
			}
			defer file.Close()

			report.TotalFilesScanned++
			scanner := bufio.NewScanner(file)
			lineNum := 0

			for scanner.Scan() {
				lineNum++
				line := scanner.Text()

				// 1. Check for hardcoded hex colors in templates or components
				if ext != ".css" && hexColorRegex.MatchString(line) {
					hex := hexColorRegex.FindString(line)
					report.Issues = append(report.Issues, DiagnosticIssue{
						FilePath:   path,
						Line:       lineNum,
						Rule:       "no-hardcoded-hex",
						Message:    fmt.Sprintf("Hardcoded hex color literal %q detected", hex),
						Suggestion: "Use a semantic NUICSS token (e.g. var(--color-primary), var(--bg-surface))",
					})
				}

				// 2. Check for unmigrated legacy primary button utility clusters
				if strings.Contains(line, "bg-blue-600") && strings.Contains(line, "text-white") &&
					(strings.Contains(line, "px-4") || strings.Contains(line, "px-3")) {
					report.Issues = append(report.Issues, DiagnosticIssue{
						FilePath:   path,
						Line:       lineNum,
						Rule:       "prefer-nuicss-superclass",
						Message:    "Legacy button utility cluster detected",
						Suggestion: "Run 'nuicss migrate' to convert to 'btn btn-primary'",
					})
				}
			}

			return nil
		})
	}

	return report, nil
}
