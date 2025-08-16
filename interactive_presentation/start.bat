@echo off
echo Activating virtual environment...
call venv\Scripts\activate

echo Starting the application...
python run.py
pause