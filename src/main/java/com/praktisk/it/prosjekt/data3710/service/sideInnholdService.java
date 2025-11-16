package com.praktisk.it.prosjekt.data3710.service;
import com.praktisk.it.prosjekt.data3710.model.*;


import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class sideInnholdService {
    private ÅpningsTider åpningsTider;
    private List<PrisEnhet> prisEnheter = new ArrayList<>();
    private List<Innlegg> innleggListe = new ArrayList<>();
    private AtomicLong idGenerator = new AtomicLong(1);

    public sideInnholdService(){
        åpningsTider = new ÅpningsTider();
        åpningsTider.mandag = "10:00 - 16:30";
        åpningsTider.tirsdag = "12:00 - 16:30";
        åpningsTider.onsdag = "10:00 - 20:00";
        åpningsTider.torsdag = "12:00 - 16:30";
        åpningsTider.fredag = "10:00 - 16:30";
        åpningsTider.notat = "Fleksible åpningstider etter behov.";


        PrisEnhet p1 = new PrisEnhet();
        p1.id = idGenerator.getAndIncrement();
        p1.navn = "Konsultasjon 15 minutter";
        p1.pris = "375,-";
        p1.erUnderMeny = false;

        PrisEnhet p2 = new PrisEnhet();
        p2.id = idGenerator.getAndIncrement();
        p2.navn = "Konsultasjon 30 minutter";
        p2.pris = "599,-";
        p2.erUnderMeny = false;

        PrisEnhet p3 = new PrisEnhet();
        p3.id = idGenerator.getAndIncrement();
        p3.navn = "Konsultasjon 60 minutter";
        p3.pris = "1139,-";
        p3.erUnderMeny = false;

        PrisEnhet sub = new PrisEnhet();
        sub.id = idGenerator.getAndIncrement();
        sub.navn = "Klippekort";
        sub.pris = "";
        sub.erUnderMeny = true;

        PrisEnhet p4 = new PrisEnhet();
        p4.id = idGenerator.getAndIncrement();
        p4.navn = "Konsultasjon 6 x 30 minutter";
        p4.pris = "3299,-";
        p4.erUnderMeny = false;

        prisEnheter.add(p1);
        prisEnheter.add(p2);
        prisEnheter.add(p3);
        prisEnheter.add(sub);
        prisEnheter.add(p4);
    }

    public ÅpningsTider hentÅpningsTider() {
        return åpningsTider;
    }

    public ÅpningsTider oppdaterÅpningstider(ÅpningsTider nyeTider){
        this.åpningsTider = nyeTider;
        return this.åpningsTider;
    }

    public List<PrisEnhet> hentPrisEnheter() {
        return prisEnheter;
    }

    public List<PrisEnhet> byttPrisEnheter(List<PrisEnhet> nyListe) {
        this.prisEnheter = nyListe;
        return this.prisEnheter;
    }

    public List<Innlegg> hentInnlegg() {
        return innleggListe;
    }

    public Innlegg leggTilInnlegg(Innlegg nyttInnlegg) {
        nyttInnlegg.id = idGenerator.getAndIncrement();
        nyttInnlegg.postTidspunkt = LocalDateTime.now();
        innleggListe.add(nyttInnlegg);
        return nyttInnlegg;
    }
}
