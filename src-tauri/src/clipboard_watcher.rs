use crate::clipboard_manager::ClipboardManager;
use crate::content::ClipboardContent;
use crate::utils;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Manager};

// Determine if the clipboard content needs to be updated
fn should_update_content(
    last_content: &Option<ClipboardContent>,
    current_content: &ClipboardContent,
) -> bool {
    match (last_content, current_content) {
        (Some(ClipboardContent::Image(last_image)), ClipboardContent::Image(current_image)) => {
            last_image.hash != current_image.hash
        }
        (Some(ClipboardContent::Text(last_text)), ClipboardContent::Text(current_text)) => {
            last_text != current_text
        }
        (Some(ClipboardContent::Color(last_color)), ClipboardContent::Color(current_color)) => {
            last_color != current_color
        }
        _ => true,
    }
}

// Process image content, save the image and update clipboard content
fn process_image_content(content: &ClipboardContent, images_dir: &PathBuf) -> ClipboardContent {
    if let ClipboardContent::Image(image) = content {
        if let Some(data) = &image.data {
            let arboard_image = arboard::ImageData {
                width: image.width as usize,
                height: image.height as usize,
                bytes: std::borrow::Cow::Owned(data.clone()),
            };
            match utils::save_image(images_dir, &arboard_image) {
                Ok(path) => {
                    let mut new_image = image.clone();
                    new_image.path = path;
                    new_image.data = None;
                    ClipboardContent::Image(new_image)
                }
                Err(e) => {
                    eprintln!("Failed to save image: {}", e);
                    ClipboardContent::Image(image.clone())
                }
            }
        } else {
            ClipboardContent::Image(image.clone())
        }
    } else {
        content.clone()
    }
}

// Update clipboard history
fn update_clipboard_history(
    clipboard_manager: &Arc<Mutex<ClipboardManager>>,
    app_handle: &AppHandle,
    content: ClipboardContent,
) {
    if let Err(e) = clipboard_manager
        .lock()
        .unwrap()
        .add_item(content.clone(), None, None)
    {
        eprintln!("[✗]Failed to add item to clipboard history: {}", e);
    } else {
        app_handle.emit_all("clipboard-changed", &content).unwrap();
    }
}

// Start the clipboard watcher
pub fn start_clipboard_watcher(
    clipboard_manager: Arc<Mutex<ClipboardManager>>,
    images_dir: PathBuf,
    app_handle: AppHandle,
) {
    std::thread::spawn(move || {
        let mut clipboard = arboard::Clipboard::new().unwrap();
        let mut last_content: Option<ClipboardContent> = None;

        loop {
            let current_content = utils::get_clipboard_content(&mut clipboard);

            if should_update_content(&last_content, &current_content) {
                let content_to_add = process_image_content(&current_content, &images_dir);
                update_clipboard_history(&clipboard_manager, &app_handle, content_to_add.clone());
                last_content = Some(content_to_add);
            }

            std::thread::sleep(std::time::Duration::from_millis(500));
        }
    });
}
