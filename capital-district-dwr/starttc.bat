cls
cd \
call java6
cd dwrpresentation\tomcat\bin
call shutdown
ping -n 5 localhost
cd ..
cd logs
erase /s /q *.log
cd ..
cd bin
call startup
