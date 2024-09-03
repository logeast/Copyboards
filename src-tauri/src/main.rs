use copyboards::clipboard_manager::{models::ClipboardItem, ClipboardManager};
use copyboards::content::ClipboardContent;
use copyboards::utils;

use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tauri::Manager;

struct AppState {
    clipboard_manager: Arc<Mutex<ClipboardManager>>,
    images_dir: PathBuf,
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

            let images_dir = app_dir.join("images");
            std::fs::create_dir_all(&images_dir).expect("[✗]Failed to create images directory");
            println!("[✦]Images directory: {:?}", images_dir);

            let clipboard_manager = Arc::new(Mutex::new(
                ClipboardManager::new(&app_dir).expect("[✗]Failed to initialize clipboard manager"),
            ));

            let app_handle = app.handle();
            let clipboard_manager_clone = Arc::clone(&clipboard_manager);
            let images_dir_clone = images_dir.clone();

            std::thread::spawn(move || {
                let mut clipboard = arboard::Clipboard::new().unwrap();
                let mut last_content = None;

                loop {
                    let (current_content, _) =
                        utils::get_clipboard_content(&mut clipboard, &images_dir_clone);

                    let should_update = match (&last_content, &current_content) {
                        (
                            Some(ClipboardContent::Image(last_path)),
                            ClipboardContent::Image(current_path),
                        ) => last_path != current_path,
                        (
                            Some(ClipboardContent::Text(last_text)),
                            ClipboardContent::Text(current_text),
                        ) => last_text != current_text,
                        (
                            Some(ClipboardContent::Color(last_color)),
                            ClipboardContent::Color(current_color),
                        ) => last_color != current_color,
                        _ => true,
                    };

                    if should_update {
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

                        last_content = Some(current_content);
                    }
                    std::thread::sleep(std::time::Duration::from_millis(500));
                }
            });

            app.manage(AppState {
                clipboard_manager,
                images_dir,
            });
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
