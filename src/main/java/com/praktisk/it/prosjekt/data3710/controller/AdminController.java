package com.praktisk.it.prosjekt.data3710.controller;

import com.praktisk.it.prosjekt.data3710.model.*;
import com.praktisk.it.prosjekt.data3710.service.sideInnholdService;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.List;





@RestController
@RequestMapping("/api")
public class AdminController {
    
    private final sideInnholdService innholdService;

    private final String ADMIN_BRUKERNAVN = "admin";
    private final String ADMIN_PASSORD = "admin123";

    public AdminController(sideInnholdService innholdService) {
        this.innholdService = innholdService;
    }


    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoggInnForespørsel req, HttpSession session) {
    if (ADMIN_BRUKERNAVN.equals(req.brukernavn) && ADMIN_PASSORD.equals(req.passord)) {
        session.setAttribute("ADMIN", true);
        return ResponseEntity.ok().build();
    }
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Feil brukernavn eller passord.");
}


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    private boolean erAdmin(HttpSession session) {
        Boolean admin = (Boolean) session.getAttribute("ADMIN");
        return admin != null && admin;
    }








    @GetMapping("/åpningstider")
    public ÅpningsTider hentÅpningsTider() {
      return innholdService.hentÅpningsTider();
    }

    @PutMapping("/åpningstider")
    public ResponseEntity<ÅpningsTider> oppdaterÅpningstider(@RequestBody ÅpningsTider nyeTider, HttpSession session) {
        if (!erAdmin(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ÅpningsTider oppdatert = innholdService.oppdaterÅpningstider(nyeTider);
        return ResponseEntity.ok(oppdatert);
    }






    @GetMapping("/priser")
    public List<PrisEnhet> hentPrisEnheter() {
        return innholdService.hentPrisEnheter();
    }

    @PostMapping("/priser")
    public ResponseEntity<List<PrisEnhet>> lagrePriser(@RequestBody List<PrisEnhet> prisEnheter, HttpSession session) {
        if (!erAdmin(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<PrisEnhet> oppdatert = innholdService.byttPrisEnheter(prisEnheter);
        return ResponseEntity.ok(oppdatert);
    }   


    @GetMapping("/innlegg")
public List<Innlegg> hentInnlegg() {
    return innholdService.hentInnlegg();
}

@PostMapping(
    value = "/innlegg",
    consumes = MediaType.MULTIPART_FORM_DATA_VALUE
)
public ResponseEntity<Innlegg> nyttInnlegg(
        @RequestPart("navn") String navn,
        @RequestPart("innhold") String innhold,
        @RequestPart(value = "fil", required = false) MultipartFile fil,
        HttpSession session
) {
    if (!erAdmin(session)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Innlegg innlegg = new Innlegg();
    innlegg.navn = navn;
    innlegg.innhold = innhold;

    if (fil != null && !fil.isEmpty()) {
        try {
            String url = lagreFil(fil);
            innlegg.bildeUrl = url;
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    Innlegg lagret = innholdService.leggTilInnlegg(innlegg);
    return ResponseEntity.ok(lagret);
}






private String lagreFil(MultipartFile fil) throws IOException {
    String uploadsDir = "uploads/innlegg";
    Files.createDirectories(Paths.get(uploadsDir));

    String opprinneligNavn = fil.getOriginalFilename();
    String filnavn = System.currentTimeMillis() + "_" + (opprinneligNavn != null ? opprinneligNavn : "fil");
    Path path = Paths.get(uploadsDir, filnavn);

    Files.write(path, fil.getBytes());

   
    return "/uploads/innlegg/" + filnavn;
}

}
