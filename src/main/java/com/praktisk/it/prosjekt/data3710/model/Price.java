package com.praktisk.it.prosjekt.data3710.model;

import jakarta.persistence.*;

@Entity
@Table(name = "prices")
public class Price{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;   // Produktnavn
    private String price;  // Pris

    public Price() {}

    public Price(String name, String price) {
        this.name = name;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }
}
