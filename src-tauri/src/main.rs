mod app_state;
mod clipboard_watcher;
mod commands;

use app_state::AppState;
use clipboard_watcher::start_clipboard_watcher;
use commands::{add_to_clipboard, get_clipboard_history, search_clipboard};
use crate::clipboard_manager::ClipboardManager;
use std::sync::{Arc, Mutex};
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_dir = app
                .path_resolver()
                .app_data_dir()
                .expect("[✗]Failed to get app data dir");
            println!("[✦]App data directory: {:?}", app_dir);

            let images_dir = app_dir.join("images");
            std::fs::create_dir_all(&images_dir).expect("[✗]Failed to create images directory");
            println!("[✦]Images directory: {:?}", images_dir);

            let clipboard_manager = Arc::new(Mutex::new(
                ClipboardManager::new(&app_dir).expect("[✗]Failed to initialize clipboard manager"),
            ));

            let app_handle = app.handle();
            start_clipboard_watcher(Arc::clone(&clipboard_manager), images_dir, app_handle);

            app.manage(AppState { clipboard_manager });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_clipboard_history,
            add_to_clipboard,
            search_clipboard
        ])
        .run(tauri::generate_context!())
        .expect("[✗]Error while running tauri application");
}
