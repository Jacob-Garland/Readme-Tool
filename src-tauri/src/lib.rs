// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_store::StoreExt;

mod state;
use state::{AppSettings, EditorDraft};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let store = app.store("store.json")?;
            // Ensure settings exist
            if store.get("settings").is_none() {
                let default_settings = AppSettings {
                    theme: "light".to_string(),
                    preview: true,
                };
                let _ = store.set("settings", serde_json::to_value(default_settings).unwrap());
                let _ = store.save();
            }
            // Ensure draft exists
            if store.get("draft").is_none() {
                let default_draft = EditorDraft {
                    markdown: String::new(),
                    selections: Vec::new(),
                };
                let _ = store.set("draft", serde_json::to_value(default_draft).unwrap());
                let _ = store.save();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
