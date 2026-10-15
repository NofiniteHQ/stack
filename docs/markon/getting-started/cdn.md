---
title: CDN Usage
sidebar_position: 3
---

# CDN Usage

Load the Markon bundle directly from the CDN.

```html
<script src="https://cdn.jsdelivr.net/npm/@nofinite/markon@1.1.1/dist/index.min.js"></script>
```

The CDN build exposes a global function named `JSMarkon`.

---

## Basic Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Markon CDN Example</title>
  </head>
  <body>
    <div id="output"></div>

    <script src="https://cdn.jsdelivr.net/npm/@nofinite/markon@1.1.1/dist/index.min.js"></script>
    <script>
      const content = '#b[Hello]# World';
      const html = JSMarkon(content);

      document.getElementById('output').innerHTML = html;
    </script>
  </body>
</html>
```

## Notes and Limitations

- The CDN build does not provide TypeScript types.
- Output is a raw HTML string.
- Styling must be handled by the consumer.
- Markon does not sanitize HTML; input should be trusted or sanitized externally.
- For complex applications, package-based installation is preferred.
