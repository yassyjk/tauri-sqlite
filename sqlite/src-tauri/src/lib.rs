// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::Manager;
use tauri_plugin_fs::FsExt;
pub mod database;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let fs_scope = app.fs_scope();
            fs_scope.allow_directory(app.path().app_data_dir().unwrap(), true)?;
            let app_dir = app.path().app_data_dir().unwrap();
            let db_path = app_dir.join(database::TAURI_DB);

            database::init(&db_path.to_str().unwrap()).map_err(|e| e.to_string())?;

            Ok(())
        })
        // .setup(|_app| {
        //     database::init().map_err(|e| e.to_string())?;
        //     Ok(())
        // })
        .invoke_handler(tauri::generate_handler![greet, database::signup_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
