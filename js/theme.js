'use strict';
(() => {
 const key = 'form-theme';
 const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
 let preference;
 try { preference = localStorage.getItem(key); } catch { /* Use the system preference when storage is unavailable. */ }
 if (preference !== 'light' && preference !== 'dark') preference = null;

 function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
   button.setAttribute('aria-checked', String(theme === 'dark'));
   button.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  });
 }

 // This script runs in the head so the saved theme is applied before the page paints.
 applyTheme(preference || (systemTheme.matches ? 'dark' : 'light'));
 document.addEventListener('DOMContentLoaded', () => {
  applyTheme(document.documentElement.dataset.theme);
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
   button.addEventListener('click', () => {
    preference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(preference);
    try { localStorage.setItem(key, preference); } catch { /* The toggle still works for this page. */ }
   });
  });
 });
 systemTheme.addEventListener('change', event => {
  if (!preference) applyTheme(event.matches ? 'dark' : 'light');
 });
 window.addEventListener('storage', event => {
  if (event.key !== key && event.key !== null) return;
  preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
  applyTheme(preference || (systemTheme.matches ? 'dark' : 'light'));
 });
})();
