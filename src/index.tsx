import { createRoot } from 'react-dom/client';
import { App } from './app';

const $root = document.getElementById('root');
if ($root) {
  createRoot($root).render(<App />);
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./mock.server.js');
}
