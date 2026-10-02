package minifier

import (
	"strings"
	"testing"
)

func TestMinify(t *testing.T) {
	input := `
	/* This is a comment */
	.btn {
		padding: 0.5rem 1rem;
		background-color: var(--color-primary);
		color: #ffffff;
	}

	.btn:hover {
		opacity: 0.9;
	}
	`

	expected := `.btn{padding:0.5rem 1rem;background-color:var(--color-primary);color:#ffffff}.btn:hover{opacity:0.9}`
	got := Minify(input)

	if got != expected {
		t.Errorf("Minify() mismatch.\nGot:      %q\nExpected: %q", got, expected)
	}

	if strings.Contains(got, "/*") {
		t.Errorf("Minify() failed to strip comments: %s", got)
	}
}

func TestMinifyCalcWhitespace(t *testing.T) {
	// W3C CSS Values and Units Level 3/4 requires whitespace around + and - in calc()
	input := `
	.box {
		width: calc(100% + 20px);
		height: calc(100vh - 4rem);
	}
	`

	got := Minify(input)
	if !strings.Contains(got, "calc(100% + 20px)") {
		t.Errorf("calc() whitespace around '+' corrupted, got: %q", got)
	}
	if !strings.Contains(got, "calc(100vh - 4rem)") {
		t.Errorf("calc() whitespace around '-' corrupted, got: %q", got)
	}
}

func TestMinifyQuotedStringsAndURLs(t *testing.T) {
	input := `
	.badge::after {
		content: "status: ok; total: 5;";
		background-image: url("data:image/svg+xml;utf8,<svg width='10' height='10'></svg>");
	}
	`

	got := Minify(input)
	if !strings.Contains(got, `content:"status: ok; total: 5;"`) {
		t.Errorf("String content within quotes corrupted, got: %q", got)
	}
	if !strings.Contains(got, `url("data:image/svg+xml;utf8,<svg width='10' height='10'></svg>")`) {
		t.Errorf("URL content corrupted, got: %q", got)
	}
}
