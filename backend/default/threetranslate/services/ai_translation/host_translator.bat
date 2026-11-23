llamacpp-server\llama-server.exe -m translategemma-12b-it.i1-Q4_K_M.gguf ^
--host 127.0.0.1 ^
--port 8080 ^
-ngl 0 ^
--temp 0 ^
--no-webui ^
--chat-template-file "chat_template.jinja"