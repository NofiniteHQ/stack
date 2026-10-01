package minifier

import (
	"regexp"
	"strings"
)

var (
	commentRegex = regexp.MustCompile(`/\*[\s\S]*?\*/`)
	spaceRegex   = regexp.MustCompile(`\s+`)
)

// Minify strips comments and redundant whitespace from CSS content.
func Minify(css string) string {
	// 1. Remove comments
	cleaned := commentRegex.ReplaceAllString(css, "")

	// 2. Collapse whitespace
	cleaned = spaceRegex.ReplaceAllString(cleaned, " ")

	// 3. Remove whitespace around structural characters
	replacements := []struct {
		target string
		sub    string
	}{
		{" {", "{"},
		{"{ ", "{"},
		{" }", "}"},
		{"} ", "}"},
		{": ", ":"},
		{" :", ":"},
		{"; ", ";"},
		{" ;", ";"},
		{", ", ","},
		{" ,", ","},
		{" > ", ">"},
		{"> ", ">"},
		{" >", ">"},
		{" + ", "+"},
		{" ~ ", "~"},
		{";}", "}"}, // Remove trailing semicolon before close brace
	}

	for _, r := range replacements {
		cleaned = strings.ReplaceAll(cleaned, r.target, r.sub)
	}

	return strings.TrimSpace(cleaned)
}
