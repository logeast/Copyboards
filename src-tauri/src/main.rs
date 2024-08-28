// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod clipboard_manager;

use clipboard_manager::{ClipboardManager, ClipboardItem};
use tauri::State;
use tauri::Manager;
use std::sync::Mutex;

struct AppState {
    clipboard_manager: Mutex<ClipboardManager>,
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
fn add_to_clipboard(state: State<AppState>, content: String, category: Option<String>) -> Result<(), String> {
    state.clipboard_manager
        .lock()
        .unwrap()
        .add_item(&content, category.as_deref())
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
            let clipboard_manager = ClipboardManager::new().expect("Failed to initialize clipboard manager");
            app.manage(AppState {
                clipboard_manager: Mutex::new(clipboard_manager),
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_clipboard_history, add_to_clipboard, search_clipboard])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}