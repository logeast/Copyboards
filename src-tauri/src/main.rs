// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod clipboard_manager;

use clipboard_manager::{ClipboardManager, ClipboardItem, ClipboardContent};
use tauri::State;
use tauri::Manager;
use std::sync::Mutex;
use tauri::async_runtime::spawn;
use arboard::Clipboard;
use std::time::Duration;
use std::sync::Arc;
use std::thread;
use base64::encode;

struct AppState {
    clipboard_manager: Arc<Mutex<ClipboardManager>>,
}

#[tauri::command]
fn get_clipboard_history(state: State<AppState>, limit: i64) -> Result<Vec<ClipboardItem>, String> {
    state.clipboard_manager
        .lock()
        .unwrap()
        .get_history(limit)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn add_to_clipboard(state: State<AppState>, content: ClipboardContent, category: Option<String>) -> Result<(), String> {
    state.clipboard_manager
        .lock()
        .unwrap()
        .add_item(content, category.as_deref())
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn search_clipboard(state: State<AppState>, query: String, limit: i64) -> Result<Vec<ClipboardItem>, String> {
    state.clipboard_manager
        .lock()
        .unwrap()
        .search(&query, limit)
        .map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let clipboard_manager = Arc::new(Mutex::new(
                ClipboardManager::new().expect("Failed to initialize clipboard manager")
            ));
            
            let app_handle = app.handle();
            let clipboard_manager_clone = Arc::clone(&clipboard_manager);

            // Spawn a background task to monitor clipboard changes
            spawn(async move {
                let mut clipboard = Clipboard::new().unwrap();
                let mut last_content = ClipboardContent::Text(String::new());

                loop {
                    let current_content = if let Ok(text) = clipboard.get_text() {
                        ClipboardContent::Text(text)
                    } else if let Ok(image) = clipboard.get_image() {
                        ClipboardContent::Image(encode(&image.bytes))
                    } else {
                        ClipboardContent::Unknown
                    };

                    if current_content != last_content {
                        // Clipboard content has changed
                        clipboard_manager_clone.lock().unwrap()
                            .add_item(current_content.clone(), None)
                            .expect("Failed to add item to clipboard history");

                        // Notify the frontend about the change
                        app_handle.emit_all("clipboard-changed", &current_content).unwrap();

                        last_content = current_content;
                    }
                    thread::sleep(Duration::from_millis(500));
                }
            });

            app.manage(AppState {
                clipboard_manager,
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_clipboard_history, add_to_clipboard, search_clipboard])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}