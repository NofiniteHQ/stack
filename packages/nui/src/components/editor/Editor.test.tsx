/**
 * @vitest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Editor } from './Editor'

describe('Editor Component', () => {
 it('renders toolbar buttons', () => {
 render(<Editor />)
 
 expect(screen.getByRole('button', { name: /bold/i })).toBeDefined()
 expect(screen.getByRole('button', { name: /italic/i })).toBeDefined()
 expect(screen.getByRole('button', { name: /strike/i })).toBeDefined()
 expect(screen.getByRole('button', { name: /heading 2/i })).toBeDefined()
 expect(screen.getByRole('button', { name: /bullet list/i })).toBeDefined()
 expect(screen.getByRole('button', { name: /ordered list/i })).toBeDefined()
 expect(screen.getByRole('button', { name: /quote/i })).toBeDefined()
 expect(screen.getByRole('button', { name: /code/i })).toBeDefined()
 expect(screen.getByRole('button', { name: /link/i })).toBeDefined()
 expect(screen.getByRole('button', { name: /image/i })).toBeDefined()
 })

 it('renders editor content', () => {
 render(<Editor value="<p>Test content</p>" />)
 expect(screen.getByText('Test content')).toBeDefined()
 })
})
