import { app } from 'electron';

import { isDevMode } from '../utils/devmode';
import { setupDialogs } from './dialogs';
import { listenForProtocolHandler, setupProtocolHandler } from './protocol';
import { setupUpdates } from './update';
import { getOrCreateMainWindow } from './windows';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

app.setName('Electron Fiddle');

listenForProtocolHandler();

app.on('ready', async () => {
  // If we're packaged, we want to run
  // React in production mode.
  if (!isDevMode()) {
    process.env.NODE_ENV = 'production';
  }

  getOrCreateMainWindow();

  const { setupMenu } = await import('./menu');
  const { setupFileListeners } = await import('./files');

  setupMenu();
  setupProtocolHandler();
  setupFileListeners();
  setupUpdates();
  setupDialogs();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', getOrCreateMainWindow);
