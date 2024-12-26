// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
pub mod database;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|_app| {
            database::init().map_err(|e| e.to_string())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, database::signup_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
