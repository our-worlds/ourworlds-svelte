/// <reference types="@sveltejs/kit" />
import type { Moralis } from 'moralis';

declare global {
  interface Window {
    Moralis: Moralis;
  }
}