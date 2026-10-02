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

// DefaultRules contains the standard 15 migration rules synchronized with @nofinite/nuicss
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
		Name:        "metric-card",
		Pattern:     regexp.MustCompile(`\b(?:flex\s+flex-col\s+)?p-5\s+rounded-xl\s+border\s+border-(?:gray|slate|zinc)-200\s+bg-white\s+shadow-sm\b`),
		Replacement: "metric-card",
		Description: "Converts metric card container clusters to metric-card",
	},
	{
		Name:        "card",
		Pattern:     regexp.MustCompile(`\brounded-xl\s+border\s+border-(?:gray|slate|zinc)-200\s+bg-white\s+shadow-sm\s+overflow-hidden\b`),
		Replacement: "card",
		Description: "Converts card wrapper utility clusters to card",
	},
	{
		Name:        "card-responsive",
		Pattern:     regexp.MustCompile(`(?:\b|^)@container\s+flex\s+flex-col\s+(?:@sm:|sm:)flex-row\s+(?:@sm:|sm:)items-center\b`),
		Replacement: "card-responsive",
		Description: "Converts responsive container flex layout clusters to card-responsive",
	},
	{
		Name:        "press-scale",
		Pattern:     regexp.MustCompile(`\bactive:scale-(?:\[0\.97\]|\[0\.98\]|95)\s+(?:transition-transform\s+)?(?:duration-150\s+)?(?:ease-spring|ease-out)\b`),
		Replacement: "press-scale",
		Description: "Converts interactive press scale clusters to press-scale",
	},
	{
		Name:        "hover-lift",
		Pattern:     regexp.MustCompile(`\bhover:-translate-y-(?:0\.5|1)\s+hover:shadow-(?:md|lg)(?:\s+transition-all)?\b`),
		Replacement: "hover-lift",
		Description: "Converts interactive hover lift clusters to hover-lift",
	},
	{
		Name:        "skeleton-shimmer",
		Pattern:     regexp.MustCompile(`\banimate-pulse\s+bg-(?:gray|slate|zinc)-200\s+rounded\b`),
		Replacement: "skeleton-shimmer rounded",
		Description: "Converts pulse skeleton placeholders to skeleton-shimmer rounded",
	},
	{
		Name:        "table-container",
		Pattern:     regexp.MustCompile(`\bw-full\s+overflow-x-auto\s+rounded-xl\s+border\s+border-(?:gray|slate|zinc)-200\s+bg-white\s+shadow-sm\b`),
		Replacement: "table-container",
		Description: "Converts overflow table wrapper clusters to table-container",
	},
}

// Regex to capture class and className attributes in JSX/HTML
var classAttrRegex = regexp.MustCompile(`(class|className)\s*=\s*(["'])([^"']+)(["'])`)

// migrateAttributeTokens transforms class lists regardless of token order
func migrateAttributeTokens(rawClass string) (string, int) {
	tokens := strings.Fields(rawClass)
	if len(tokens) == 0 {
		return rawClass, 0
	}

	tokenSet := make(map[string]bool, len(tokens))
	for _, t := range tokens {
		tokenSet[t] = true
	}

	totalReplaced := 0

	// Check if already migrated to avoid redundant replacements
	isBtn := tokenSet["btn"]

	// 1. Order-independent Button Primary Check
	if !isBtn {
		hasPadding := (tokenSet["px-4"] && tokenSet["py-2"]) || (tokenSet["px-3"] && tokenSet["py-1"]) || (tokenSet["h-9"] && tokenSet["px-4"])
		hasBgPrimary := false
		var matchedBg string
		for t := range tokenSet {
			if strings.HasPrefix(t, "bg-blue-") || strings.HasPrefix(t, "bg-indigo-") ||
				strings.HasPrefix(t, "bg-violet-") || strings.HasPrefix(t, "bg-brand-") ||
				strings.HasPrefix(t, "bg-primary-") {
				hasBgPrimary = true
				matchedBg = t
				break
			}
		}
		hasHover := false
		var matchedHover string
		for t := range tokenSet {
			if strings.HasPrefix(t, "hover:bg-blue-") || strings.HasPrefix(t, "hover:bg-indigo-") ||
				strings.HasPrefix(t, "hover:bg-violet-") || strings.HasPrefix(t, "hover:bg-brand-") ||
				strings.HasPrefix(t, "hover:bg-primary-") {
				hasHover = true
				matchedHover = t
				break
			}
		}
		hasTextWhite := tokenSet["text-white"]
		hasRounded := tokenSet["rounded-md"] || tokenSet["rounded-lg"]

		if hasPadding && hasBgPrimary && hasHover && hasTextWhite && hasRounded {
			// Found primary button cluster in arbitrary order
			delete(tokenSet, matchedBg)
			delete(tokenSet, matchedHover)
			delete(tokenSet, "text-white")
			delete(tokenSet, "rounded-md")
			delete(tokenSet, "rounded-lg")
			delete(tokenSet, "px-4")
			delete(tokenSet, "py-2")
			delete(tokenSet, "px-3")
			delete(tokenSet, "py-1")
			delete(tokenSet, "h-9")
			delete(tokenSet, "inline-flex")
			delete(tokenSet, "items-center")
			delete(tokenSet, "justify-center")
			delete(tokenSet, "font-medium")
			delete(tokenSet, "transition-all")

			// Reassemble remaining classes
			remaining := make([]string, 0, len(tokenSet)+1)
			remaining = append(remaining, "btn", "btn-primary")
			for _, t := range tokens {
				if tokenSet[t] {
					remaining = append(remaining, t)
					delete(tokenSet, t) // avoid duplicate if same token was repeated
				}
			}
			tokens = remaining
			totalReplaced++
			isBtn = true
		}
	}

	// 2. Order-independent Button Secondary Check
	if !isBtn {
		hasPadding := (tokenSet["px-4"] && tokenSet["py-2"]) || (tokenSet["px-3"] && tokenSet["py-1"]) || (tokenSet["h-9"] && tokenSet["px-4"])
		hasBgSecondary := tokenSet["bg-gray-100"] || tokenSet["bg-slate-100"] || tokenSet["bg-zinc-100"]
		hasHover := tokenSet["hover:bg-gray-200"] || tokenSet["hover:bg-slate-200"] || tokenSet["hover:bg-zinc-200"]
		hasText := tokenSet["text-gray-900"] || tokenSet["text-slate-900"] || tokenSet["text-zinc-900"]
		hasRounded := tokenSet["rounded-md"] || tokenSet["rounded-lg"]

		if hasPadding && hasBgSecondary && hasHover && hasText && hasRounded {
			delete(tokenSet, "bg-gray-100")
			delete(tokenSet, "bg-slate-100")
			delete(tokenSet, "bg-zinc-100")
			delete(tokenSet, "hover:bg-gray-200")
			delete(tokenSet, "hover:bg-slate-200")
			delete(tokenSet, "hover:bg-zinc-200")
			delete(tokenSet, "text-gray-900")
			delete(tokenSet, "text-slate-900")
			delete(tokenSet, "text-zinc-900")
			delete(tokenSet, "rounded-md")
			delete(tokenSet, "rounded-lg")
			delete(tokenSet, "px-4")
			delete(tokenSet, "py-2")
			delete(tokenSet, "px-3")
			delete(tokenSet, "py-1")
			delete(tokenSet, "h-9")
			delete(tokenSet, "inline-flex")
			delete(tokenSet, "items-center")
			delete(tokenSet, "justify-center")
			delete(tokenSet, "font-medium")

			remaining := make([]string, 0, len(tokenSet)+1)
			remaining = append(remaining, "btn", "btn-secondary")
			for _, t := range tokens {
				if tokenSet[t] {
					remaining = append(remaining, t)
					delete(tokenSet, t)
				}
			}
			tokens = remaining
			totalReplaced++
		}
	}

	if totalReplaced > 0 {
		return strings.Join(tokens, " "), totalReplaced
	}

	return rawClass, 0
}

// MigrateContent transforms string content and returns the updated string and replacement count
func MigrateContent(content string) (string, int) {
	transformed := content
	total := 0

	// 1. Order-independent token migration inside class / className attributes
	transformed = classAttrRegex.ReplaceAllStringFunc(transformed, func(match string) string {
		sub := classAttrRegex.FindStringSubmatch(match)
		if len(sub) == 5 {
			attrName := sub[1]
			quote := sub[2]
			classVal := sub[3]
			newVal, count := migrateAttributeTokens(classVal)
			if count > 0 {
				total += count
				return fmt.Sprintf("%s=%s%s%s", attrName, quote, newVal, quote)
			}
		}
		return match
	})

	// 2. Sequential regex rule migrations across full content
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

	validExts := map[string]bool{
		".html":   true,
		".htm":    true,
		".tsx":    true,
		".jsx":    true,
		".vue":    true,
		".svelte": true,
		".astro":  true,
		".php":    true,
		".templ":  true,
	}

	root := "."
	if opts.TargetPattern != "" && !strings.Contains(opts.TargetPattern, "*") {
		root = opts.TargetPattern
	}

	if fi, err := os.Stat(root); err != nil {
		return fmt.Errorf("target path %q does not exist: %w", root, err)
	} else if !fi.IsDir() {
		// Single file migration
		data, err := os.ReadFile(root)
		if err != nil {
			return err
		}
		transformed, count := MigrateContent(string(data))
		if count > 0 {
			fmt.Printf("  ✓ %s (%d superclasses applied)\n", root, count)
			if !opts.DryRun {
				_ = os.WriteFile(root, []byte(transformed), 0644)
			}
			totalFiles++
			totalReplacements += count
		}
		fmt.Println("\n🎉 Migration Complete!")
		fmt.Printf("Total files modified: %d\n", totalFiles)
		fmt.Printf("Total superclasses applied: %d\n\n", totalReplacements)
		return nil
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
