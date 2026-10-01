package tokens

import (
	"fmt"
)

// PrintTokens displays the available OKLCH design tokens and semantics
func PrintTokens() {
	fmt.Println("\n🎨 NUICSS Design System Tokens (OKLCH + Dual sRGB Fallback)")
	fmt.Println("===========================================================")

	tokens := []struct {
		Role     string
		Variable string
		Sample   string
		Desc     string
	}{
		{"Primary", "--color-primary", "\033[38;2;59;130;246m●\033[0m", "Brand core / active actions"},
		{"Secondary", "--color-secondary", "\033[38;2;100;116;139m●\033[0m", "Subtle / secondary elements"},
		{"Success", "--color-success", "\033[38;2;34;197;94m●\033[0m", "Positive states, confirmations"},
		{"Warning", "--color-warning", "\033[38;2;234;179;8m●\033[0m", "Alerts, non-blocking notices"},
		{"Danger", "--color-danger", "\033[38;2;239;68;68m●\033[0m", "Destructive, errors, critical"},
		{"Surface", "--bg-surface", "\033[38;2;255;255;255m○\033[0m", "Default card and container background"},
		{"Overlay", "--bg-overlay", "\033[38;2;15;23;42m●\033[0m", "Modal backdrop with backdrop-blur-sm"},
		{"Border", "--border-default", "\033[38;2;226;232;240m─\033[0m", "Semantic container and input boundary"},
	}

	for _, t := range tokens {
		fmt.Printf("  %s %-12s %-20s %s\n", t.Sample, t.Role, t.Variable, t.Desc)
	}

	fmt.Println("\nSuperclasses (Anti-Utility Soup):")
	fmt.Println("  .btn, .btn-primary, .btn-secondary, .btn-ghost, .btn-outline")
	fmt.Println("  .card, .card-responsive, .metric-card")
	fmt.Println("  .badge, .badge-primary, .badge-success, .badge-danger")
	fmt.Println("\n💡 Learn more at https://docs.nofinite.dev/nuicss")
	fmt.Println()
}
