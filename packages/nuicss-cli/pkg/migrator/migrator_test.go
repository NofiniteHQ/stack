package migrator

import (
	"strings"
	"testing"
)

func TestMigrateContent(t *testing.T) {
	input := `<button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Click Me</button>`
	expected := `<button className="btn btn-primary">Click Me</button>`

	res, count := MigrateContent(input)
	if count < 1 {
		t.Errorf("Expected at least 1 replacement, got %d", count)
	}

	if !strings.Contains(res, "btn btn-primary") {
		t.Errorf("Expected output to contain 'btn btn-primary', got: %s", res)
	}

	if res != expected {
		t.Errorf("Mismatch.\nGot:      %s\nExpected: %s", res, expected)
	}
}

func TestMigrateOrderIndependent(t *testing.T) {
	// Standard developer order: padding first, then bg, then hover, then text, then rounded
	input := `<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg inline-flex items-center justify-center w-full shadow-sm">Save</button>`

	res, count := MigrateContent(input)
	if count < 1 {
		t.Fatalf("Expected order-independent replacement, got count %d", count)
	}

	if !strings.Contains(res, "btn btn-primary") {
		t.Errorf("Expected output to contain 'btn btn-primary', got: %s", res)
	}
	if !strings.Contains(res, "w-full") || !strings.Contains(res, "shadow-sm") {
		t.Errorf("Expected extra classes 'w-full' and 'shadow-sm' to be preserved, got: %s", res)
	}
}

func TestMigrateSynchronizedRules(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "metric-card",
			input:    `<div className="flex flex-col p-5 rounded-xl border border-gray-200 bg-white shadow-sm"></div>`,
			expected: `<div className="metric-card"></div>`,
		},
		{
			name:     "table-container",
			input:    `<div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm"></div>`,
			expected: `<div className="table-container"></div>`,
		},
		{
			name:     "hover-lift",
			input:    `<div className="hover:-translate-y-1 hover:shadow-lg transition-all"></div>`,
			expected: `<div className="hover-lift"></div>`,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			res, count := MigrateContent(tt.input)
			if count < 1 {
				t.Fatalf("Expected replacement for %s, got 0", tt.name)
			}
			if res != tt.expected {
				t.Errorf("Mismatch for %s.\nGot:      %s\nExpected: %s", tt.name, res, tt.expected)
			}
		})
	}
}
