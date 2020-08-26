cls
call java6

cd tomcat\webapps

cd account\web-inf\src
call ant
cd ..\..\..\

cd alltogether\web-inf\src
call ant
cd ..\..\..\

cd error\web-inf\src
call ant
cd ..\..\..\

cd math\web-inf\src
call ant
cd ..\..\..\

cd ra_background\web-inf\src
call ant
cd ..\..\..\

cd ra_comet\web-inf\src
call ant
cd ..\..\..\

cd ra_piggybacking\web-inf\src
call ant
cd ..\..\..\

cd ra_polling\web-inf\src
call ant
cd ..\..\..\

cd ..
cd logs
erase /s /q /f *.log
cd ..
