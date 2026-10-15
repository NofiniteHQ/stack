---
sidebar_position: 2
title: Flexbox & Grid
---

# Flexbox & Grid

NUI CSS provides all standard flexbox and CSS grid primitives for building robust 1D and 2D layouts.

## Flexbox

### Flex Direction

- `flex-row`: `flex-direction: row;`
- `flex-row-reverse`: `flex-direction: row-reverse;`
- `flex-col`: `flex-direction: column;`
- `flex-col-reverse`: `flex-direction: column-reverse;`

### Flex Wrap

- `flex-wrap`: `flex-wrap: wrap;`
- `flex-wrap-reverse`: `flex-wrap: wrap-reverse;`
- `flex-nowrap`: `flex-wrap: nowrap;`

### Flex Properties

- `flex-1`: `flex: 1 1 0%;`
- `flex-auto`: `flex: 1 1 auto;`
- `flex-initial`: `flex: 0 1 auto;`
- `flex-none`: `flex: none;`

### Grow and Shrink

- `grow`: `flex-grow: 1;`
- `grow-0`: `flex-grow: 0;`
- `shrink`: `flex-shrink: 1;`
- `shrink-0`: `flex-shrink: 0;`

## Grid

### Grid Template Columns

Define the number of columns in your grid layout.

- `grid-cols-1` to `grid-cols-12`
- `grid-cols-none`

### Grid Column Start / End

Control how an item spans across grid columns.

- `col-auto`: `grid-column: auto;`
- `col-span-1` to `col-span-12`
- `col-span-full`: `grid-column: 1 / -1;`
- `col-start-1` to `col-start-13`
- `col-end-1` to `col-end-13`

### Grid Template Rows

Define the number of rows in your grid layout.

- `grid-rows-1` to `grid-rows-6`
- `grid-rows-none`

### Grid Row Start / End

- `row-auto`
- `row-span-1` to `row-span-6`
- `row-span-full`
- `row-start-1` to `row-start-7`
- `row-end-1` to `row-end-7`

## Gap

Control the gutters between grid and flexbox items.

- `gap-0` to `gap-96`
- `gap-x-0` to `gap-x-96`
- `gap-y-0` to `gap-y-96`
- Arbitrary gaps: `gap-[2rem]`

## Justify Content

- `justify-start`
- `justify-end`
- `justify-center`
- `justify-between`
- `justify-around`
- `justify-evenly`

## Align Items

- `items-start`
- `items-end`
- `items-center`
- `items-baseline`
- `items-stretch`
