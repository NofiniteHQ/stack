package migrator

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// MigrationRule represents a pattern replacement rule from utility soup to superclass
type MigrationRule struct {
	Name        string
	Pattern     *regexp.Regexp
	Replacement string
	Description string
}

// DefaultRules contains the standard migration rules
var DefaultRules = []MigrationRule{
	{
		Name:        "btn-primary",
		Pattern:     regexp.MustCompile(`\b(?:inline-flex\s+)?items-center(?:\s+justify-center)?\s+(?:px-[34]\s+py-[12]|h-9\s+px-4)\s+bg-(?:blue|indigo|violet|brand|primary)-[56]00\s+text-white\s+rounded-(?:md|lg)\s+hover:bg-(?:blue|indigo|violet|brand|primary)-[67]00(?:\s+font-medium)?(?:\s+transition-all)?\b`),
		Replacement: "btn btn-primary",
		Description: "Converts verbose primary button utility clusters to btn btn-primary",
	},
	{
		Name:        "btn-secondary",
		Pattern:     regexp.MustCompile(`\b(?:inline-flex\s+)?items-center(?:\s+justify-center)?\s+(?:px-[34]\s+py-[12]|h-9\s+px-4)\s+bg-(?:gray|slate|zinc)-100\s+text-(?:gray|slate|zinc)-900\s+rounded-(?:md|lg)\s+hover:bg-(?:gray|slate|zinc)-200(?:\s+font-medium)?\b`),
		Replacement: "btn btn-secondary",
		Description: "Converts secondary button utility clusters to btn btn-secondary",
	},
	{
		Name:        "btn-ghost",
		Pattern:     regexp.MustCompile(`\b(?:inline-flex\s+)?items-center(?:\s+justify-center)?\s+(?:px-[34]\s+py-[12]|h-9\s+px-4)\s+bg-transparent\s+text-(?:gray|slate|zinc)-[789]00\s+hover:bg-(?:gray|slate|zinc)-100\s+rounded-(?:md|lg)\b`),
		Replacement: "btn btn-ghost",
		Description: "Converts ghost button utility clusters to btn btn-ghost",
	},
	{
		Name:        "btn-outline",
		Pattern:     regexp.MustCompile(`\b(?:inline-flex\s+)?items-center(?:\s+justify-center)?\s+(?:px-[34]\s+py-[12]|h-9\s+px-4)\s+border\s+border-(?:gray|slate|zinc)-[34]00\s+bg-transparent\s+text-(?:gray|slate|zinc)-900\s+hover:bg-(?:gray|slate|zinc)-100\s+rounded-(?:md|lg)\b`),
		Replacement: "btn btn-outline",
		Description: "Converts outline button utility clusters to btn btn-outline",
	},
	{
		Name:        "badge-primary",
		Pattern:     regexp.MustCompile(`\b(?:inline-flex\s+)?items-center\s+px-2\.5\s+py-0\.5\s+rounded-full\s+text-xs\s+font-semibold\s+bg-(?:blue|indigo|violet|brand)-100\s+text-(?:blue|indigo|violet|brand)-[78]00\b`),
		Replacement: "badge badge-primary",
		Description: "Converts primary badge utility clusters to badge badge-primary",
	},
	{
		Name:        "badge-success",
		Pattern:     regexp.MustCompile(`\b(?:inline-flex\s+)?items-center\s+px-2\.5\s+py-0\.5\s+rounded-full\s+text-xs\s+font-semibold\s+bg-green-100\s+text-green-[78]00\b`),
		Replacement: "badge badge-success",
		Description: "Converts success badge utility clusters to badge badge-success",
	},
	{
		Name:        "badge-danger",
		Pattern:     regexp.MustCompile(`\b(?:inline-flex\s+)?items-center\s+px-2\.5\s+py-0\.5\s+rounded-full\s+text-xs\s+font-semibold\s+bg-red-100\s+text-red-[78]00\b`),
		Replacement: "badge badge-danger",
		Description: "Converts danger badge utility clusters to badge badge-danger",
	},
	{
		Name:        "input",
		Pattern:     regexp.MustCompile(`\bh-9\s+w-full\s+rounded-md\s+border\s+border-(?:gray|slate|zinc)-300\s+bg-white\s+px-3\s+py-1\s+text-sm(?:\s+shadow-sm)?(?:\s+outline-none)?\b`),
		Replacement: "input",
		Description: "Converts text input utility clusters to input",
	},
	{
		Name:        "card",
		Pattern:     regexp.MustCompile(`\brounded-xl\s+border\s+border-(?:gray|slate|zinc)-200\s+bg-white\s+shadow-sm\s+overflow-hidden\b`),
		Replacement: "card",
		Description: "Converts card wrapper utility clusters to card",
	},
	{
		Name:        "table-container",
		Pattern:     regexp.MustCompile(`\bw-full\s+overflow-x-auto\s+rounded-xl\s+border\s+border-(?:gray|slate|zinc)-200\s+bg-white\s+shadow-sm\b`),
		Replacement: "table-container",
		Description: "Converts overflow table wrapper clusters to table-container",
	},
}

// MigrateContent transforms string content and returns the updated string and replacement count
func MigrateContent(content string) (string, int) {
	transformed := content
	total := 0

	for _, rule := range DefaultRules {
		matches := rule.Pattern.FindAllStringIndex(transformed, -1)
		if len(matches) > 0 {
			total += len(matches)
			transformed = rule.Pattern.ReplaceAllString(transformed, rule.Replacement)
		}
	}

	return transformed, total
}

// MigrateOptions holds execution flags for codemod migration
type MigrateOptions struct {
	TargetPattern string
	DryRun        bool
}

// RunMigration executes the codemod on all matching files
func RunMigration(opts MigrateOptions) error {
	fmt.Println("\n🚀 Starting NUICSS Codemod Migration...")
	if opts.DryRun {
		fmt.Println("ℹ️  Running in dry-run mode (no files will be modified).")
	}

	totalFiles := 0
	totalReplacements := 0

	// Extensions to scan
	validExts := map[string]bool{
		".html":  true,
		".htm":   true,
		".tsx":   true,
		".jsx":   true,
		".vue":   true,
		".svelte": true,
		".astro": true,
		".php":   true,
		".templ": true,
	}

	root := "."
	if opts.TargetPattern != "" && !strings.Contains(opts.TargetPattern, "*") {
		root = opts.TargetPattern
	}

	err := filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
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

		transformed, count := MigrateContent(string(data))
		if count > 0 {
			totalFiles++
			totalReplacements += count
			fmt.Printf("  ✓ %s (%d superclasses applied)\n", path, count)

			if !opts.DryRun {
				_ = os.WriteFile(path, []byte(transformed), 0644)
			}
		}

		return nil
	})

	if err != nil {
		return err
	}

	fmt.Println("\n🎉 Migration Complete!")
	fmt.Printf("Total files modified: %d\n", totalFiles)
	fmt.Printf("Total superclasses applied: %d\n\n", totalReplacements)

	return nil
}
