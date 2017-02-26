Tomcat protected by keycloak server. The following URLs and Users are available

Replace YOUR_LOCAL_IP with the ip address of your computer, but don't use localhost or 127.0.0.1.

Protected by realm role
http://YOUR_LOCAL_IP/eins/    User: lisa, marge

Protected by client role
http://YOUR_LOCAL_IP/eins2/   User: lisa

Protected by realm role
http://YOUR_LOCAL_IP/zwei/    User: lisa, homer

Available user:
lisa,  Pwd: IchBinLisa
marge, Pwd: IchBinMarge
homer, Pwd: IchBinHomer
bart,  Pwd: IchBinBart

Keycloak-Admin-Console
http://YOUR_LOCAL_IP/auth/admin/master/console
User: batman, Pwd: IchBinBatman

