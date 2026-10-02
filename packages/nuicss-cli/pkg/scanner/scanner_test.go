package scanner

import (
	"os"
	"path/filepath"
	"testing"
)

func TestScanDirectories(t *testing.T) {
	tempDir := t.TempDir()
	testFile := filepath.Join(tempDir, "Button.tsx")

	content := `
export function Button() {
	return <button className={"btn btn-primary"}>Click</button>;
}
`
	if err := os.WriteFile(testFile, []byte(content), 0644); err != nil {
		t.Fatal(err)
	}

	res, err := ScanDirectories([]string{tempDir})
	if err != nil {
		t.Fatalf("ScanDirectories failed: %v", err)
	}

	if res.TotalFilesScanned != 1 {
		t.Errorf("Expected 1 file scanned, got %d", res.TotalFilesScanned)
	}
	if !res.ClassesFound["btn"] || !res.ClassesFound["btn-primary"] {
		t.Errorf("Expected 'btn' and 'btn-primary' in classes found, got: %v", res.ClassesFound)
	}
}

func TestCheckDirectoriesLinter(t *testing.T) {
	tempDir := t.TempDir()
	testFile := filepath.Join(tempDir, "Card.tsx")

	// Contains hardcoded hex color (#3b82f6) and unmigrated button cluster
	content := `
export function Card() {
	return (
		<div style={{ backgroundColor: '#3b82f6' }}>
			<button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Submit</button>
		</div>
	);
}
`
	if err := os.WriteFile(testFile, []byte(content), 0644); err != nil {
		t.Fatal(err)
	}

	report, err := CheckDirectories([]string{tempDir})
	if err != nil {
		t.Fatalf("CheckDirectories failed: %v", err)
	}

	if report.TotalFilesScanned != 1 {
		t.Errorf("Expected 1 file scanned, got %d", report.TotalFilesScanned)
	}
	if len(report.Issues) != 2 {
		t.Fatalf("Expected 2 diagnostic issues, got %d", len(report.Issues))
	}

	hasHexViolation := false
	hasUtilityViolation := false
	for _, issue := range report.Issues {
		if issue.Rule == "no-hardcoded-hex" {
			hasHexViolation = true
		}
		if issue.Rule == "prefer-nuicss-superclass" {
			hasUtilityViolation = true
		}
	}

	if !hasHexViolation {
		t.Errorf("Expected 'no-hardcoded-hex' violation")
	}
	if !hasUtilityViolation {
		t.Errorf("Expected 'prefer-nuicss-superclass' violation")
	}
}
