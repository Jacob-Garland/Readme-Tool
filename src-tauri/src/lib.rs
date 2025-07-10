// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

mod state;
use state::{AppSettings, EditorDraft};
use tauri_plugin_store::Store;
use tauri::{State, Wry};

#[tauri::command]
async fn get_settings(store: State<'_, Store<Wry>>) -> Option<AppSettings> {
    store.get("settings").await.unwrap_or(None)
}

#[tauri::command]
async fn set_settings(store: State<'_, Store<Wry>>, settings: AppSettings) -> Result<(), String> {
    let _ = store.set("settings", settings).await;
    let _ = store.save().await;
    Ok(())
}

#[tauri::command]
async fn clear_settings(store: State<'_, Store<Wry>>) -> Result<(), String> {
    let _ = store.delete("settings").await;
    let _ = store.save().await;
    Ok(())
}

#[tauri::command]
async fn get_draft(store: State<'_, Store<Wry>>) -> Option<EditorDraft> {
    store.get("draft").await.unwrap_or(None)
}

#[tauri::command]
async fn set_draft(store: State<'_, Store<Wry>>, draft: EditorDraft) -> Result<(), String> {
    let _ = store.set("draft", draft).await;
    let _ = store.save().await;
    Ok(())
}

#[tauri::command]
async fn clear_draft(store: State<'_, Store<Wry>>) -> Result<(), String> {
    let _ = store.delete("draft").await;
    let _ = store.save().await;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(
            tauri_plugin_store::Builder::new().build()
        )
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let store = app.state::<Store<Wry>>()?;
            if tauri::async_runtime::block_on(store.get("settings")).unwrap_or(None).is_none() {
                let default_settings = AppSettings {
                    theme: "light".to_string(),
                    preview: true,
                };
                let _ = tauri::async_runtime::block_on(store.set("settings", default_settings));
                let _ = tauri::async_runtime::block_on(store.save());
            }
            if tauri::async_runtime::block_on(store.get("draft")).unwrap_or(None).is_none() {
                let default_draft = EditorDraft {
                    markdown: String::new(),
                    selections: Vec::new(),
                };
                let _ = tauri::async_runtime::block_on(store.set("draft", default_draft));
                let _ = tauri::async_runtime::block_on(store.save());
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            get_settings,
            set_settings,
            clear_settings,
            get_draft,
            set_draft,
            clear_draft
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
