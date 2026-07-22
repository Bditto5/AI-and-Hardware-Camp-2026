use futures_util::StreamExt;
use serde::Serialize;
use std::collections::HashMap;
use std::fs::File;
use std::io::Write;
use std::sync::Mutex;
use std::time::{Duration, Instant};
use tauri::Emitter;
use tokio_util::sync::CancellationToken;

#[derive(Default)]
struct OllamaRequestManager(Mutex<HashMap<String, CancellationToken>>);

impl OllamaRequestManager {
    fn register(&self, request_id: &str) -> Result<CancellationToken, String> {
        let token = CancellationToken::new();
        self.0
            .lock()
            .map_err(|_| "Couldn't lock the Ollama request manager.".to_string())?
            .insert(request_id.to_string(), token.clone());
        Ok(token)
    }

    fn cancel(&self, request_id: &str) -> Result<bool, String> {
        let token = self
            .0
            .lock()
            .map_err(|_| "Couldn't lock the Ollama request manager.".to_string())?
            .get(request_id)
            .cloned();
        if let Some(token) = token {
            token.cancel();
            Ok(true)
        } else {
            Ok(false)
        }
    }

    fn remove(&self, request_id: &str) {
        if let Ok(mut requests) = self.0.lock() {
            requests.remove(request_id);
        }
    }
}

#[derive(Clone, Serialize)]
struct DownloadProgressPayload {
    downloaded: u64,
    total: Option<u64>,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct OllamaStreamPayload {
    request_id: String,
    line: Option<String>,
    done: bool,
    error: Option<String>,
}

async fn stream_ollama_lines(
    window: tauri::Window,
    event_name: &str,
    request_id: String,
    response: reqwest::Response,
    cancellation: CancellationToken,
) -> Result<(), String> {
    let mut stream = response.bytes_stream();
    let mut buffer = String::new();

    loop {
        let next = tokio::select! {
            _ = cancellation.cancelled() => {
                window
                    .emit(
                        event_name,
                        OllamaStreamPayload {
                            request_id,
                            line: None,
                            done: true,
                            error: Some("STOPPED".to_string()),
                        },
                    )
                    .map_err(|err| format!("Couldn't emit Ollama cancellation: {err}"))?;
                return Ok(());
            }
            next = stream.next() => next,
        };
        let Some(next) = next else { break };
        let chunk = next.map_err(|err| format!("Ollama stream failed: {err}"))?;
        let text = String::from_utf8_lossy(&chunk);
        buffer.push_str(&text);

        let mut lines = buffer.split('\n').map(|line| line.to_string()).collect::<Vec<_>>();
        buffer = lines.pop().unwrap_or_default();

        for raw in lines {
            let line = raw.trim();
            if line.is_empty() {
                continue;
            }
            window
                .emit(
                    event_name,
                    OllamaStreamPayload {
                        request_id: request_id.clone(),
                        line: Some(line.to_string()),
                        done: false,
                        error: None,
                    },
                )
                .map_err(|err| format!("Couldn't emit Ollama stream line: {err}"))?;
        }
    }

    let tail = buffer.trim();
    if !tail.is_empty() {
        window
            .emit(
                event_name,
                OllamaStreamPayload {
                    request_id: request_id.clone(),
                    line: Some(tail.to_string()),
                    done: false,
                    error: None,
                },
            )
            .map_err(|err| format!("Couldn't emit Ollama stream tail: {err}"))?;
    }

    window
        .emit(
            event_name,
            OllamaStreamPayload {
                request_id,
                line: None,
                done: true,
                error: None,
            },
        )
        .map_err(|err| format!("Couldn't emit Ollama stream completion: {err}"))?;

    Ok(())
}

fn response_error_message(status: reqwest::StatusCode, body: &str) -> String {
    if body.trim().is_empty() {
        format!("Ollama responded with an unexpected status ({status}).")
    } else {
        format!("Ollama responded with an unexpected status ({status}): {}", body.trim())
    }
}

#[tauri::command]
async fn ollama_get_json(url: String) -> Result<String, String> {
    let response = reqwest::Client::new()
        .get(url)
        .send()
        .await
        .map_err(|err| format!("Couldn't reach Ollama: {err}"))?;

    if !response.status().is_success() {
        let status = response.status();
        let body = response.text().await.unwrap_or_default();
        return Err(response_error_message(status, &body));
    }

    response
        .text()
        .await
        .map_err(|err| format!("Couldn't read Ollama response: {err}"))
}

#[tauri::command]
async fn ollama_chat_stream(
    window: tauri::Window,
    manager: tauri::State<'_, OllamaRequestManager>,
    url: String,
    body_json: String,
    request_id: String,
) -> Result<(), String> {
    let body: serde_json::Value = serde_json::from_str(&body_json)
        .map_err(|err| format!("Invalid chat payload JSON: {err}"))?;

    let response = reqwest::Client::new()
        .post(url)
        .json(&body)
        .send()
        .await
        .map_err(|err| format!("Couldn't reach Ollama: {err}"))?;

    if !response.status().is_success() {
        let status = response.status();
        let body = response.text().await.unwrap_or_default();
        return Err(response_error_message(status, &body));
    }

    let cancellation = manager.register(&request_id)?;
    let result = stream_ollama_lines(
        window,
        "ollama-chat-stream",
        request_id.clone(),
        response,
        cancellation,
    )
    .await;
    manager.remove(&request_id);
    result
}

#[tauri::command]
async fn ollama_pull_stream(
    window: tauri::Window,
    manager: tauri::State<'_, OllamaRequestManager>,
    url: String,
    body_json: String,
    request_id: String,
) -> Result<(), String> {
    let body: serde_json::Value = serde_json::from_str(&body_json)
        .map_err(|err| format!("Invalid pull payload JSON: {err}"))?;

    let response = reqwest::Client::new()
        .post(url)
        .json(&body)
        .send()
        .await
        .map_err(|err| format!("Couldn't reach Ollama: {err}"))?;

    if !response.status().is_success() {
        let status = response.status();
        let body = response.text().await.unwrap_or_default();
        return Err(response_error_message(status, &body));
    }

    let cancellation = manager.register(&request_id)?;
    let result = stream_ollama_lines(
        window,
        "ollama-pull-stream",
        request_id.clone(),
        response,
        cancellation,
    )
    .await;
    manager.remove(&request_id);
    result
}

#[tauri::command]
fn ollama_cancel_request(
    manager: tauri::State<'_, OllamaRequestManager>,
    request_id: String,
) -> Result<bool, String> {
    manager.cancel(&request_id)
}

#[tauri::command]
async fn download_ollama_installer(
    window: tauri::Window,
    url: String,
    dest: String,
) -> Result<(), String> {
    let response = reqwest::Client::new()
        .get(url)
        .send()
        .await
        .map_err(|err| format!("Couldn't download Ollama installer: {err}"))?;

    if !response.status().is_success() {
        return Err(format!(
            "Couldn't download Ollama installer (status {}).",
            response.status()
        ));
    }

    let total = response.content_length();
    let mut downloaded = 0_u64;
    window
        .emit("ollama-download-progress", DownloadProgressPayload { downloaded, total })
        .map_err(|err| format!("Couldn't emit installer progress: {err}"))?;

    let mut output_file =
        File::create(&dest).map_err(|err| format!("Couldn't create installer file: {err}"))?;
    let mut stream = response.bytes_stream();
    let mut last_emit_at = Instant::now();

    while let Some(next) = stream.next().await {
        let chunk = next.map_err(|err| format!("Installer download failed: {err}"))?;
        output_file
            .write_all(&chunk)
            .map_err(|err| format!("Couldn't write installer file: {err}"))?;
        downloaded += chunk.len() as u64;

        if last_emit_at.elapsed() >= Duration::from_millis(500) {
            window
                .emit("ollama-download-progress", DownloadProgressPayload { downloaded, total })
                .map_err(|err| format!("Couldn't emit installer progress: {err}"))?;
            last_emit_at = Instant::now();
        }
    }

    output_file
        .flush()
        .map_err(|err| format!("Couldn't finalize installer file: {err}"))?;
    window
        .emit("ollama-download-progress", DownloadProgressPayload { downloaded, total })
        .map_err(|err| format!("Couldn't emit installer progress: {err}"))?;

    Ok(())
}

#[tauri::command]
fn launch_ollama_installer(path: String) -> Result<(), String> {
    std::process::Command::new(&path)
        .spawn()
        .map(|_| ())
        .map_err(|err| format!("Couldn't launch Ollama installer: {err}"))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(OllamaRequestManager::default())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            ollama_get_json,
            ollama_chat_stream,
            ollama_pull_stream,
            ollama_cancel_request,
            download_ollama_installer,
            launch_ollama_installer
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
