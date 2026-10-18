package com.praktisk.it.prosjekt.data3710.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "opening_hours")
public class OpeningHours {

    @Id
    @Column(name = "day_name")
    private String day;

    @Column(name = "hours")
    private String hours;

    @Column(name = "note")
    private String note;

    public OpeningHours() {}

    public OpeningHours(String day, String hours, String note) {
        this.day = day;
        this.hours = hours;
        this.note = note;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getHours() {
        return hours;
    }

    public void setHours(String hours) {
        this.hours = hours;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
