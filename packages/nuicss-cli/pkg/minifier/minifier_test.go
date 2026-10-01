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
		t.Errorf("Minify() mismatch.\nGot:      %s\nExpected: %s", got, expected)
	}

	if strings.Contains(got, "/*") {
		t.Errorf("Minify() failed to strip comments: %s", got)
	}
}
