use crate::app_state::AppState;
use crate::clipboard_manager::models::ClipboardItem;
use crate::content::ClipboardContent;

#[tauri::command]
pub fn get_clipboard_history(
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
pub fn add_to_clipboard(
    state: tauri::State<AppState>,
    content: ClipboardContent,
    category: Option<String>,
) -> Result<(), String> {
    state
        .clipboard_manager
        .lock()
        .unwrap()
        .add_item(content, category.as_deref(), None)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn search_clipboard(
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
