import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpRequest.BodyPublishers;
import java.util.List;

public class TestDataPopulator {
    public static void main(String[] args) throws Exception {
        HttpClient client = HttpClient.newBuilder()
            .followRedirects(HttpClient.Redirect.ALWAYS)
            .build();

        List<String> users = List.of("weekly_user", "monthly_user", "annual_user");
        
        for (String user : users) {
            System.out.println("Registering: " + user);
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8080/register"))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(BodyPublishers.ofString("username=" + user + "&password=password"))
                .build();
            
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("Response status: " + response.statusCode());
        }
    }
}
