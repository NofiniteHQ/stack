package minifier

import (
	"strings"
)

// Minify compresses CSS while strictly adhering to CSS specifications:
// 1. Preserves whitespace around '+' and '-' for valid calc(), clamp(), min(), max() expressions.
// 2. Preserves exact string content inside quotes ("..." and '...').
// 3. Preserves exact content inside url(...).
// 4. Strips CSS comments (/* ... */).
// 5. Collapses redundant whitespace and strips unnecessary spaces around delimiters.
func Minify(css string) string {
	var sb strings.Builder
	sb.Grow(len(css))

	inComment := false
	inString := false
	var stringQuote byte
	inURL := false
	urlParenCount := 0

	runes := []byte(css)
	n := len(runes)

	for i := 0; i < n; i++ {
		ch := runes[i]

		// 1. Handle Comments
		if inComment {
			if ch == '*' && i+1 < n && runes[i+1] == '/' {
				inComment = false
				i++ // skip '/'
			}
			continue
		}

		if !inString && !inURL && ch == '/' && i+1 < n && runes[i+1] == '*' {
			inComment = true
			i++ // skip '*'
			continue
		}

		// 2. Handle Strings ("..." or '...')
		if inString {
			sb.WriteByte(ch)
			if ch == '\\' && i+1 < n {
				// Escaped character in string
				i++
				sb.WriteByte(runes[i])
			} else if ch == stringQuote {
				inString = false
			}
			continue
		}

		if !inURL && (ch == '"' || ch == '\'') {
			inString = true
			stringQuote = ch
			sb.WriteByte(ch)
			continue
		}

		// 3. Handle url(...)
		if inURL {
			sb.WriteByte(ch)
			if ch == '(' {
				urlParenCount++
			} else if ch == ')' {
				urlParenCount--
				if urlParenCount <= 0 {
					inURL = false
				}
			}
			continue
		}

		if (ch == 'u' || ch == 'U') && i+3 < n &&
			strings.EqualFold(string(runes[i:i+4]), "url(") {
			sb.WriteString("url(")
			i += 3
			inURL = true
			urlParenCount = 1
			continue
		}

		// 4. Handle Whitespace outside strings & comments
		if ch == ' ' || ch == '\t' || ch == '\n' || ch == '\r' {
			// Check if previous character in sb allows omitting space
			out := sb.String()
			if len(out) == 0 {
				continue
			}
			last := out[len(out)-1]

			// Find next non-whitespace character
			nextIdx := i + 1
			for nextIdx < n && (runes[nextIdx] == ' ' || runes[nextIdx] == '\t' || runes[nextIdx] == '\n' || runes[nextIdx] == '\r') {
				nextIdx++
			}

			if nextIdx >= n {
				break
			}
			next := runes[nextIdx]

			// Do not write space around structural delimiters: { } ; : , > ~
			if isStructuralDelimiter(last) || isStructuralDelimiter(next) {
				i = nextIdx - 1
				continue
			}

			// Operators + and - require whitespace in CSS calc() expressions
			// So if last is '+' or '-', or next is '+' or '-', keep the space!
			sb.WriteByte(' ')
			i = nextIdx - 1
			continue
		}

		// 5. Normal Character
		// Eliminate trailing semicolon before closing brace
		if ch == ';' {
			nextIdx := i + 1
			for nextIdx < n && (runes[nextIdx] == ' ' || runes[nextIdx] == '\t' || runes[nextIdx] == '\n' || runes[nextIdx] == '\r') {
				nextIdx++
			}
			if nextIdx < n && runes[nextIdx] == '}' {
				i = nextIdx - 1
				continue
			}
		}

		sb.WriteByte(ch)
	}

	return strings.TrimSpace(sb.String())
}

func isStructuralDelimiter(ch byte) bool {
	return ch == '{' || ch == '}' || ch == ';' || ch == ':' || ch == ',' || ch == '>' || ch == '~'
}
