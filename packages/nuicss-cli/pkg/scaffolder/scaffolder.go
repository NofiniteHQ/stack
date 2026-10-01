package scaffolder

import (
	"fmt"
	"strings"
)

// ComponentInfo describes an available ecosystem component or primitive
type ComponentInfo struct {
	Name        string
	Package     string
	Description string
	Superclass  string
}

// Registry contains the available components across NUI, NUIX, Charts, Kanban, Markon
var Registry = map[string]ComponentInfo{
	"button": {
		Name:        "Button",
		Package:     "@nofinite/nui",
		Description: "Accessible polymorphic button with press-scale and loading states",
		Superclass:  "btn, btn-primary, btn-secondary, btn-ghost, btn-outline",
	},
	"dialog": {
		Name:        "Dialog / Modal",
		Package:     "@nofinite/nui",
		Description: "Accessible modal dialog with glassmorphic backdrop-blur-sm and focus lock",
		Superclass:  "modal-dialog, modal-backdrop, bg-overlay",
	},
	"modal": {
		Name:        "Modal (Alias for Dialog)",
		Package:     "@nofinite/nui",
		Description: "Accessible modal dialog with glassmorphic backdrop-blur-sm and focus lock",
		Superclass:  "modal-dialog, modal-backdrop, bg-overlay",
	},
	"card": {
		Name:        "Card",
		Package:     "@nofinite/nuicss",
		Description: "Semantic surface container with border-default and shadow-sm",
		Superclass:  "card, card-responsive, metric-card",
	},
	"badge": {
		Name:        "Badge",
		Package:     "@nofinite/nuicss",
		Description: "Status and indicator badge with primary, success, danger variants",
		Superclass:  "badge, badge-primary, badge-success, badge-danger",
	},
	"table": {
		Name:        "Table",
		Package:     "@nofinite/nui",
		Description: "Responsive data table with sticky headers and zebra striping",
		Superclass:  "table-container, table-row, table-cell",
	},
	"tabs": {
		Name:        "Tabs",
		Package:     "@nofinite/nui",
		Description: "Keyboard-navigable accessible tabs with animated active indicators",
		Superclass:  "tabs-list, tabs-trigger, tabs-content",
	},
	"dropdown": {
		Name:        "DropdownMenu",
		Package:     "@nofinite/nui",
		Description: "Accessible popup menu with keyboard roving-tabindex and submenu support",
		Superclass:  "menu-dropdown, menu-item",
	},
	"chart": {
		Name:        "Chart",
		Package:     "@nofinite/charts",
		Description: "Zero-JS / low-overhead SVG & CSS performance charts",
		Superclass:  "chart-container, chart-bar, chart-line",
	},
	"sparkline": {
		Name:        "Sparkline",
		Package:     "@nofinite/charts",
		Description: "Micro inline trend indicator for KPI cards and tables",
		Superclass:  "sparkline-svg, sparkline-path",
	},
	"kanban": {
		Name:        "Kanban",
		Package:     "@nofinite/kanban",
		Description: "Fluid drag-and-drop task workflow board",
		Superclass:  "kanban-board, kanban-column, kanban-card",
	},
	"editor": {
		Name:        "Markon Editor",
		Package:     "@nofinite/markon",
		Description: "Modern Markdown WYSIWYG editor engine",
		Superclass:  "markon-editor, markon-toolbar, markon-preview",
	},
}

// ListComponents prints all available components in the registry
func ListComponents() {
	fmt.Println("\n📦 Available Components & Modules in Nofinite Ecosystem:")
	fmt.Println("==========================================================")
	for key, item := range Registry {
		if key == "modal" {
			continue // skip alias in list
		}
		fmt.Printf("  • %-12s [%s]\n    %s\n    Classes: %s\n\n", key, item.Package, item.Description, item.Superclass)
	}
	fmt.Println("Usage:")
	fmt.Println("  nuicss add <component-name>")
	fmt.Println()
}

// AddComponent scaffolds or outputs installation instructions for a component
func AddComponent(name string) error {
	key := strings.ToLower(strings.TrimSpace(name))
	item, ok := Registry[key]
	if !ok {
		return fmt.Errorf("unknown component %q. Run 'nuicss list' to see available components", name)
	}

	fmt.Printf("\n✨ Scaffolding %s (%s)...\n", item.Name, item.Package)
	fmt.Printf("  Associated NUICSS superclasses: %s\n", item.Superclass)
	fmt.Println("  ✓ Ready to use in your templates and components!")
	fmt.Println()

	return nil
}
