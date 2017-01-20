@ECHO OFF
set CASPER_PATH=%~dp0..
set CASPER_BIN=%CASPER_PATH%\bin\
set ARGV=%*
set PHANTOM=%CASPER_PATH%\phantomjs\
rem set SCRIPTS=%~dp0..\..\scripts\
rem call "%PHANTOM%phantomjs" "%CASPER_BIN%bootstrap.js" --casper-path="%CASPER_PATH%" --cli"%SCRIPTS%downloadcsi.js" %ARGV%

echo "=== DEBUG start ==="
echo %CASPER_PATH%
echo %ARGV%
echo %PHANTOM%
echo %CASPER_BIN%
echo "=== DEBUG end ==="

IF "%proxy%" == "" GOTO noproxy
echo "PROXY!"
call "%PHANTOM%phantomjs" --ignore-ssl-errors=yes --ssl-protocol=any --proxy="%proxy%" "%CASPER_BIN%bootstrap.js" --casper-path="%CASPER_PATH%" --cli %ARGV%
GOTO end

:noproxy
echo "No Proxy"
call "%PHANTOM%phantomjs" --ignore-ssl-errors=yes --ssl-protocol=any "%CASPER_BIN%bootstrap.js" --casper-path="%CASPER_PATH%" --cli %ARGV%

:end
ECHO "DONE"
