package de.oth.keycloak;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;
import java.util.Set;

import org.keycloak.AuthorizationContext;
import org.keycloak.KeycloakSecurityContext;
import org.keycloak.adapters.RefreshableKeycloakSecurityContext;
import org.keycloak.representations.AccessToken;
import org.keycloak.representations.idm.authorization.Permission;


/**
 * Created by eiko on 04.01.17.
 */
public class SimpleServlet extends HttpServlet {
    public void doGet(HttpServletRequest request,
                      HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        RefreshableKeycloakSecurityContext keycloakSecurityContext = (RefreshableKeycloakSecurityContext) request.getAttribute(KeycloakSecurityContext.class.getName());

        PrintWriter out = response.getWriter();
        out.println("<h1>Zwei</h1>");
        out.println("<h3>Where you are:</h3>");
        out.println("<ul>");
        out.println("<li>Context: "+request.getContextPath()+"</li>");
        out.println("<li>Realm: "+keycloakSecurityContext.getRealm()+"</li>");
        AccessToken token = keycloakSecurityContext.getToken();
        out.println("<li>User: "+token.getName()+"</li>");
        out.println("<li>First Name: "+token.getGivenName()+"</li>");
        out.println("<li>Last Name: "+token.getFamilyName()+"</li>");
        out.println("</ul>");

        AccessToken.Access realmAccess = token.getRealmAccess();
        if (realmAccess!=null) {
            out.println("<br/><h3>Your realm permissions are:</h3>");
            Set<String> realmRoles = realmAccess.getRoles();
            out.println("<ul>");
            for (String r:realmRoles) {
                switch(r) {
                    case "app-eins":
                        out.println("<li><a href='/eins/' title='Go to app-eins'>" + r + "</a></li>");
                        break;
                    case "app-zwei":
                        out.println("<li><a href='/zwei/' title='Go to app-zwei'>" + r + "</a></li>");
                        break;
                    default:
                        out.println("<li>" + r + "</li>");
                }
            }
            out.println("</ul>");
        }

        Map<String, AccessToken.Access> resRoles  = token.getResourceAccess();
        if (resRoles!=null) {
            out.println("<br/><h3>Your resource permissions are:</h3>");
            Set<String> resourceNames = resRoles.keySet();
            out.println("<ul>");
            for (String res: resourceNames) {
                AccessToken.Access access = resRoles.get(res);
                Set<String> resRolesSet = access.getRoles();
                StringBuilder sb = new StringBuilder();
                for (String s: resRolesSet) {
                    if (sb.length()>0)
                        sb.append(", ");
                    if (s.equals("eins-admin")) {
                        sb.append("<a href='/eins2/' title='Go to app-eins'>");
                        sb.append(s);
                        sb.append("</a>");
                    }
                    else
                        sb.append(s);
                }
                out.println("<li>"+res+": ["+sb.toString()+"]</li>");
            }
            out.println("</ul>");
        }
    }
}
