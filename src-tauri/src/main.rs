use copyboards::clipboard_manager::{models::ClipboardItem, ClipboardManager};
use copyboards::content::ClipboardContent;
use copyboards::utils;

use std::sync::{Arc, Mutex};
use tauri::Manager;

struct AppState {
    clipboard_manager: Arc<Mutex<ClipboardManager>>,
}

#[tauri::command]
fn get_clipboard_history(
    state: tauri::State<AppState>,
    limit: i64,
) -> Result<Vec<ClipboardItem>, String> {
    state
        .clipboard_manager
        .lock()
        .unwrap()
        .get_history(limit)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn add_to_clipboard(
    state: tauri::State<AppState>,
    content: ClipboardContent,
    category: Option<String>,
) -> Result<(), String> {
    state
        .clipboard_manager
        .lock()
        .unwrap()
        .add_item(content, category.as_deref())
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn search_clipboard(
    state: tauri::State<AppState>,
    query: String,
    limit: i64,
) -> Result<Vec<ClipboardItem>, String> {
    state
        .clipboard_manager
        .lock()
        .unwrap()
        .search(&query, limit)
        .map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_dir = app
                .path_resolver()
                .app_data_dir()
                .expect("[✗]Failed to get app data dir");
            println!("[✦]App data directory: {:?}", app_dir);

            let image_dir = app_dir.join("images");
            std::fs::create_dir_all(&image_dir).expect("[✗]Failed to create images directory");

            let clipboard_manager = Arc::new(Mutex::new(
                ClipboardManager::new(&app_dir).expect("[✗]Failed to initialize clipboard manager"),
            ));

            let app_handle = app.handle();
            let clipboard_manager_clone = Arc::clone(&clipboard_manager);

            std::thread::spawn(move || {
                let mut clipboard = arboard::Clipboard::new().unwrap();
                let mut last_content = ClipboardContent::Text(String::new());

                loop {
                    let current_content = utils::get_clipboard_content(&mut clipboard, &image_dir);

                    if current_content != last_content {
                        if let Err(e) = clipboard_manager_clone
                            .lock()
                            .unwrap()
                            .add_item(current_content.clone(), None)
                        {
                            eprintln!("Failed to add item to clipboard history: {}", e);
                        } else {
                            app_handle
                                .emit_all("clipboard-changed", &current_content)
                                .unwrap();
                        }

                        last_content = current_content;
                    }
                    std::thread::sleep(std::time::Duration::from_millis(500));
                }
            });

            app.manage(AppState { clipboard_manager });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_clipboard_history,
            add_to_clipboard,
            search_clipboard
        ])
        .run(tauri::generate_context!())
        .expect("[✗]error while running tauri application");
}
