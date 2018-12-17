Here you will find the slideshow and all source from the Philly JUG
DWR presentation of 3/25/2009 by Frank W. Zammetti (also gave this talk to
the Capital Distict Java Developer's Network in June 2009.

Each of the example webapps are in its own directory.  Certain slides
have the name of the associated webapp in the upper right-hand
corner, so you can view them in context if you wish.  I didn't WAR
them up, but you should be able to just drop them in Tomcat's
webapps directory and be off to the races (users of other servers
are on their own!) with one caveat: in the interest of having a smaller
download size, none of the webapps has dwr.jar or commons-logging.jar
in them.  You'll find both of thise in the same directory as this readme
file.  So, just copy them over into WEB-INF/lib and then you *really*
should be off to the races :)

Also, if you want to hack these a bit, each has the source in WEB-INF\src,
and there is an Ant build script there as well for each.

Frank
