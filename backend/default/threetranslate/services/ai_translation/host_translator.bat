llamacpp-server\llama-server.exe -m Hy-MT3-1.8B-Q8_0.gguf ^
-c 8192 ^
--parallel 5 ^
--host 127.0.0.1 ^
--port 8080 ^
-ngl 0 ^
--temp 0 ^
--no-webui ^
--chat-template-file "chat_template.jinja"