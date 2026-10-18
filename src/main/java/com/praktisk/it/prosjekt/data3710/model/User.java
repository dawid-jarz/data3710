package com.praktisk.it.prosjekt.data3710.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    private String username;

    private String password;

    private boolean enabled = true;

    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
        this.enabled = true;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
