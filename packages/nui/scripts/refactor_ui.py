import os
import re

COMPONENTS_DIR = r"d:\stack\packages\nui\src\components"

# Define replacements
# 1. Focus states for generic interactives
focus_ring_pattern = re.compile(r'(group-)?focus-visible:ring-(2|\[3px\])\s+(group-)?focus-visible:ring-(primary|focus|blue-\d+(/\d+)?)(/20)?')
outline_class = r"\1focus-visible:outline \1focus-visible:outline-2 \1focus-visible:outline-offset-2 \1focus-visible:outline-[var(--nui-fg-default)]"

# Focus states that are grouped with border colors
focus_border_blue_pattern = re.compile(r'(group-)?focus-visible:border-blue-\d+')
focus_border_primary_pattern = re.compile(r'(group-)?focus-visible:border-primary')

# Form input specific replacements
input_border_pattern = re.compile(r'border border-(default|subtle|slate-\d+)(?! border-solid)')

# 2. Hardcoded colors
blue_bg = re.compile(r'bg-blue-600')
red_bg = re.compile(r'bg-red-600')
blue_text = re.compile(r'text-blue-\d+')
blue_border_hover = re.compile(r'hover:border-blue-\d+(/\d+)?')
blue_bg_hover = re.compile(r'hover:bg-blue-\d+(/\d+)?')

form_components = {'Textarea', 'Checkbox', 'RadioGroup', 'Select', 'MultiSelect', 'Combobox', 'DatePicker', 'DateRangePicker', 'TimeRangePicker', 'ColorPicker'}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig_content = content
    
    # Generic focus rings -> native outlines
    content = focus_ring_pattern.sub(outline_class, content)
    content = focus_border_blue_pattern.sub(r'\1focus-visible:border-[var(--nui-fg-default)]', content)
    content = focus_border_primary_pattern.sub(r'\1focus-visible:border-[var(--nui-fg-default)]', content)
    
    # Generic blue/red replacement
    content = blue_bg.sub('bg-primary', content)
    content = red_bg.sub('bg-danger', content)
    content = blue_text.sub('text-primary', content)
    content = blue_border_hover.sub('hover:border-primary', content)
    content = blue_bg_hover.sub('hover:bg-primary/90', content)
    
    # Form specific fixes
    filename = os.path.basename(filepath)
    comp_name = filename.split('.')[0]
    
    if comp_name in form_components:
        # Add border-solid to border border-default
        content = input_border_pattern.sub(r'border border-solid border-\1', content)
        if comp_name in ['Textarea', 'Checkbox', 'RadioGroup']:
            content = content.replace(' shadow-sm', '')
    
    if content != orig_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {filepath}")

def main():
    if not os.path.exists(r"d:\stack\packages\nui\scripts"):
        os.makedirs(r"d:\stack\packages\nui\scripts")
    for root, dirs, files in os.walk(COMPONENTS_DIR):
        for file in files:
            if file.endswith('.tsx'):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
