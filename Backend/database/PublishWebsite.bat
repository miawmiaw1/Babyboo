@echo off
:: Navigate to the folder where ngrok is installed (if it's not in your PATH)
:: Uncomment and update the next line if ngrok is not in your PATH
:: cd C:\path\to\ngrok

:: Start ngrok for localhost:3000
ngrok http http://localhost:3000

:: Pause to keep the terminal open after execution
pause