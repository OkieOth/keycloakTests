Tomcat protected by keycloak server. The following URLs and Users are available

```
cd TomcatAuthTests
docker-compose/bin/start.sh
# open browser of your choise an test the configured URLs
```

Replace YOUR_LOCAL_IP with the ip address of your computer, but don't use localhost or 127.0.0.1.

Protected by realm role
* http://YOUR_LOCAL_IP:8000/eins/    
* User: lisa, marge

Protected by client role
* http://YOUR_LOCAL_IP:8000/eins2/   
* User: lisa

Protected by realm role
* http://YOUR_LOCAL_IP:8000/zwei/    
* User: lisa, homer

Available user:
* lisa,  Pwd: IchBinLisa
* marge, Pwd: IchBinMarge
* homer, Pwd: IchBinHomer
* bart,  Pwd: IchBinBart

Keycloak-Admin-Console
* http://YOUR_LOCAL_IP:8000/auth/admin/master/console
* User: batman, Pwd: IchBinBatman

