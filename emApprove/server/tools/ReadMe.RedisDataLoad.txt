Introduction
----------------

This lets you to load Data from the Oracle Database 
which is present in the EA network to Redis Database
which is present in the loacl.

  
Pre-Requisites
-------------------

1. Neeed to have the JDK 1.6 and JVM installed
2. Need to have the Redis installed in the Local machine
3. Connect to EA network
4. Start the Redis server
5. Place the jar files - ojdbc14.jar, jedis.jar and dataLoadRedis.jar

How to Run
----------------

1. From cmd prompt go to the JDK installed directoy
2. execute the command with java -jar <jar file name with full path>

Support
-----------

1. Currently there is no external configuration support. It is configured as 
   build In to point to the EA network oracle Database
2. It is set to load for only one table

Future Support
--------------------
1. Data Load for other tables
2. External config  

Help
-----
Please contact EA offshore Team

Enjoy!
