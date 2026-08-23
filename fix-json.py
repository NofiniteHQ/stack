# -*- coding: utf-8 -*-
with open("packages/nuicss/project.json", "rb") as f:
    content = f.read()

if content.startswith(b"\xef\xbb\xbf"):
    content = content[3:]

with open("packages/nuicss/project.json", "wb") as f:
    f.write(content)
