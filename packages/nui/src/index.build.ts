// src/index.build.ts

// Force Vite to process the base styles FIRST
import './styles/index.css'; 

// Then, pull in all the components (and their specific CSS) SECOND
export * from './index';