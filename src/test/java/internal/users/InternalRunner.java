package internal.users;

import com.intuit.karate.junit5.Karate;

class InternalRunner {
    
    @Karate.Test
    Karate testUsers() {
        return Karate.run("users").relativeTo(getClass());
    }      

    @Karate.Test
    Karate testTorneo() {
        return Karate.run("CrearTorneo").relativeTo(getClass());
    }
}
