package embedded

import (
	_ "embed"
)

// StylesCSS contains the compiled NUICSS stylesheet (tokens, resets, superclasses)
//
//go:embed styles.css
var StylesCSS string

// StylesMinCSS contains the minified compiled NUICSS stylesheet
//
//go:embed styles.min.css
var StylesMinCSS string

// HTMLDataJSON contains the W3C HTML custom data for autocomplete
//
//go:embed nuicss.html-data.json
var HTMLDataJSON string

// CSSDataJSON contains the W3C CSS custom data for properties/tokens
//
//go:embed nuicss.css-data.json
var CSSDataJSON string
