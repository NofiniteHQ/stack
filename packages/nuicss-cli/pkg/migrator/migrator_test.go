package migrator

import (
	"strings"
	"testing"
)

func TestMigrateContent(t *testing.T) {
	input := `<button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Click Me</button>`
	expected := `<button className="btn btn-primary">Click Me</button>`

	res, count := MigrateContent(input)
	if count != 1 {
		t.Errorf("Expected 1 replacement, got %d", count)
	}

	if !strings.Contains(res, "btn btn-primary") {
		t.Errorf("Expected output to contain 'btn btn-primary', got: %s", res)
	}

	if res != expected {
		t.Errorf("Mismatch.\nGot:      %s\nExpected: %s", res, expected)
	}
}
