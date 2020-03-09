package Main;

import authentication.AuthConsumer;
public class Main {

    public static void main(String[] args) throws Exception {
        System.out.println("Helladdo");
        AuthConsumer authConsumer = new AuthConsumer();
        authConsumer.runConsumer();
    }
}
