use crate::clipboard_manager::ClipboardManager;
use crate::content::{ClipboardContent, ClipboardImage};
use crate::utils;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tauri::AppHandle;

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

            let should_update = match (&last_content, &current_content) {
                (
                    Some(ClipboardContent::Image(last_image)),
                    ClipboardContent::Image(current_image),
                ) => last_image.hash != current_image.hash,
                (Some(ClipboardContent::Text(last_text)), ClipboardContent::Text(current_text)) => {
                    last_text != current_text
                }
                (
                    Some(ClipboardContent::Color(last_color)),
                    ClipboardContent::Color(current_color),
                ) => last_color != current_color,
                _ => true,
            };

            if should_update {
                let content_to_add = if let ClipboardContent::Image(image) = &current_content {
                    // Save the image and update the path
                    match utils::save_image(&images_dir, &image.hash, &clipboard) {
                        Ok(path) => ClipboardContent::Image(ClipboardImage {
                            path,
                            hash: image.hash.clone(),
                            size: image.size,
                            width: image.width,
                            height: image.height,
                        }),
                        Err(e) => {
                            eprintln!("Failed to save image: {}", e);
                            current_content.clone()
                        }
                    }
                } else {
                    current_content.clone()
                };

                if let Err(e) =
                    clipboard_manager
                        .lock()
                        .unwrap()
                        .add_item(content_to_add.clone(), None, None)
                {
                    eprintln!("[✗]Failed to add item to clipboard history: {}", e);
                } else {
                    app_handle
                        .emit_all("clipboard-changed", &content_to_add)
                        .unwrap();
                }

                last_content = Some(content_to_add);
            }
            std::thread::sleep(std::time::Duration::from_millis(500));
        }
    });
}
