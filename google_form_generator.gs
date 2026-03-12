/**
 * VLARIO Huisaansluitfiches — Google Form Generator
 * ===================================================
 * Colas Belgium | Puurs & Zwijndrecht
 *
 * INSTALLATIE:
 * 1. Ga naar https://script.google.com
 * 2. Maak nieuw project → plak deze code
 * 3. Klik ▶ Run → maakVLARIOForm()
 * 4. Geef toestemming wanneer gevraagd
 * 5. Check je Google Drive voor het nieuwe formulier
 *
 * Het formulier wordt automatisch gekoppeld aan een Google Sheet.
 */

function maakVLARIOForm() {
  // =========================================================================
  // FORMULIER AANMAKEN
  // =========================================================================
  var form = FormApp.create("VLARIO Huisaansluitfiche — Colas Belgium");
  form.setDescription(
    "Werfformulier voor het verzamelen van data per huisaansluiting (DWA/RWA/kolk).\n\n" +
    "Vul dit formulier in per aansluiting, direct op de werf.\n" +
    "Bij gescheiden riolering: vul 1× in voor DWA en 1× voor RWA per adres.\n\n" +
    "Alle velden met * zijn verplicht."
  );
  form.setConfirmationMessage(
    "✅ Aansluiting opgeslagen!\n\n" +
    "Vergeet niet: bij gescheiden stelsel moet je dit formulier 2× invullen per adres (1× DWA + 1× RWA)."
  );
  form.setAllowResponseEdits(true);
  form.setCollectEmail(false);

  // =========================================================================
  // SECTIE 1: PROJECTIDENTIFICATIE
  // =========================================================================
  form.addSectionHeaderItem()
    .setTitle("📋 Projectidentificatie")
    .setHelpText("Welke werf en fase?");

  form.addListItem()
    .setTitle("Werf (Puurs/Zwijndrecht)")
    .setChoiceValues(["Puurs", "Zwijndrecht"])
    .setRequired(true);

  form.addListItem()
    .setTitle("Fase")
    .setChoiceValues([
      "Puurs - Fase 1",
      "Puurs - Fase 2",
      "Puurs - Fase 3",
      "Zwijndrecht - Fase 1 Burchtsestraat",
      "Zwijndrecht - Fase 2 Burchtsestraat",
      "Zwijndrecht - Fase 3 Laarstraat-Molenbergstraat",
      "Zwijndrecht - Fase 4 vervolg Burchtsestraat",
      "Zwijndrecht - Fase 5 Alfred Van Oststraat",
      "Zwijndrecht - Fase 6 Laarstraat-Antwerpsesteenweg",
      "Zwijndrecht - Fase 7 Burchtsestraat-Verbrandendijk",
    ])
    .setRequired(true);

  form.addTextItem()
    .setTitle("Datum uitvoering")
    .setHelpText("DD/MM/JJJJ")
    .setRequired(true);

  // =========================================================================
  // SECTIE 2: ADRESGEGEVENS
  // =========================================================================
  form.addSectionHeaderItem()
    .setTitle("🏠 Adresgegevens")
    .setHelpText("Welk adres/perceel wordt aangesloten?");

  form.addTextItem()
    .setTitle("Straatnaam")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Huisnummer")
    .setHelpText("Voor wachtaansluitingen: volgnummer (01, 02, ...). Voor kolken: kolknummer.")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Equipmentnummer")
    .setHelpText("9-cijferig nummer van rioolbeheerder. Bij WA: projectnr-volgnr. Bij kolk: projectnr-kolknr.")
    .setRequired(true);

  form.addListItem()
    .setTitle("Aard water (DWA/RWA/GEM)")
    .setHelpText("DWA = droogweerafvoer (afvalwater), RWA = regenwater, GEM = gemengd")
    .setChoiceValues(["DWA", "RWA", "GEM"])
    .setRequired(true);

  form.addListItem()
    .setTitle("Soort (HA/WA/kolk)")
    .setHelpText("HA = huisaansluiting (bewoond), WA = wachtaansluiting (onbebouwd), kolk = straatkolk")
    .setChoiceValues(["HA", "WA", "kolk"])
    .setRequired(true);

  // =========================================================================
  // SECTIE 3: MATERIAAL
  // =========================================================================
  form.addSectionHeaderItem()
    .setTitle("🔧 Materiaal")
    .setHelpText("Welk materiaal en diameter?");

  form.addListItem()
    .setTitle("Diameter (mm)")
    .setChoiceValues(["160", "200", "250", "315", "400"])
    .setRequired(true);

  form.addListItem()
    .setTitle("Materiaal (PVC/PP/grès)")
    .setChoiceValues(["PVC", "PP", "grès"])
    .setRequired(true);

  // =========================================================================
  // SECTIE 4: POSITIE T.O.V. RIOOL
  // =========================================================================
  form.addSectionHeaderItem()
    .setTitle("📐 Positie t.o.v. rioolstelsel")
    .setHelpText("Tussen welke putten ligt de aansluiting?");

  form.addTextItem()
    .setTitle("Put stroomafwaarts (nr)")
    .setHelpText("Putnummer uit het plan, bv. P12 of K5")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Put stroomopwaarts (nr)")
    .setHelpText("Putnummer uit het plan, bv. P13 of K6")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Afstand tot stroomafwaartse put (m)")
    .setHelpText("Afstand van midden stroomafwaartse put tot de mof van de aansluiting. Meetlint langs riool-as. Bv: 8.50")
    .setRequired(true);

  form.addListItem()
    .setTitle("Ligging HA-putje")
    .setChoiceValues(["oprit", "voortuin", "berm", "voetpad", "fietspad", "MANUEEL INVULLEN"])
    .setRequired(true);

  form.addTextItem()
    .setTitle("Diepte HA-putje tov MV (m)")
    .setHelpText("Diepte van bovenkant HA-putje t.o.v. maaiveld. Bv: 0.80")
    .setRequired(false);

  form.addTextItem()
    .setTitle("Diepte aanboring op hoofdriool tov MV (m)")
    .setHelpText("ENKEL invullen bij aansluiting op BESTAANDE riolering. Bij nieuwe riool: leeg laten.")
    .setRequired(false);

  form.addListItem()
    .setTitle("Type aansluiting op hoofdriool")
    .setChoiceValues(["T-buis", "T-stuk", "Y-stuk", "flexibele aansluiting", "aanboring"])
    .setRequired(true);

  form.addListItem()
    .setTitle("Hoek aansluiting (graden)")
    .setHelpText("Gezien van stroomafwaarts naar stroomopwaarts")
    .setChoiceValues(["90°", "135°", "180°", "225°", "270°", "NVT"])
    .setRequired(true);

  // =========================================================================
  // SECTIE 5: AFSTANDEN SITUATIESCHETS
  // =========================================================================
  form.addSectionHeaderItem()
    .setTitle("📏 Afstanden voor situatieschets")
    .setHelpText("Afstand van het HA-putje tot gevel/rooilijn. Nodig voor de VLARIO situatieschets.");

  form.addTextItem()
    .setTitle("Afstand putje horizontaal (m)")
    .setHelpText("Horizontale afstand van putje tot referentiepunt (gevel/perceelsgrens). Bv: 3.20")
    .setRequired(false);

  form.addListItem()
    .setTitle("Afstand putje horizontaal (letter)")
    .setHelpText("Richtingsletter volgens VLARIO schema")
    .setChoiceValues(["a", "b", "c", "d", "e", "f"])
    .setRequired(false);

  form.addTextItem()
    .setTitle("Afstand putje vertikaal (m)")
    .setHelpText("Vertikale afstand (loodrecht op gevel). Bv: 1.50")
    .setRequired(false);

  form.addListItem()
    .setTitle("Afstand putje vertikaal (letter)")
    .setHelpText("Richtingsletter volgens VLARIO schema")
    .setChoiceValues(["g", "h"])
    .setRequired(false);

  // =========================================================================
  // SECTIE 6: HOEVEELHEDEN (FITTINGEN)
  // =========================================================================
  form.addSectionHeaderItem()
    .setTitle("🔢 Hoeveelheden — Fittingen & Materiaal")
    .setHelpText("Tel alle gebruikte onderdelen voor deze aansluiting. Dit bepaalt de facturatie!");

  form.addTextItem()
    .setTitle("Buis (m)")
    .setHelpText("Totaal aantal meters PVC buis gebruikt. Bv: 6.50")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Mof (st)")
    .setHelpText("Aantal moffen. Vul 0 in als niet gebruikt.")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Bocht (st)")
    .setHelpText("Totaal aantal bochten (15°+30°+45°+90° samen). Noteer detail in opmerkingen.")
    .setRequired(true);

  form.addTextItem()
    .setTitle("Y/T-stuk (st)")
    .setRequired(false);

  form.addTextItem()
    .setTitle("Krimpmof (st)")
    .setRequired(false);

  form.addTextItem()
    .setTitle("Koppelstuk (st)")
    .setRequired(false);

  form.addTextItem()
    .setTitle("Reductie (st)")
    .setHelpText("Reductie 110→90 of 110→130. Noteer type in opmerkingen.")
    .setRequired(false);

  form.addTextItem()
    .setTitle("Stop (st)")
    .setRequired(false);

  form.addTextItem()
    .setTitle("Andere")
    .setHelpText("Andere hulpstukken niet in bovenstaande lijst")
    .setRequired(false);

  // =========================================================================
  // SECTIE 7: HA-PUTJE DETAILS
  // =========================================================================
  form.addSectionHeaderItem()
    .setTitle("🔲 HA-putje details");

  form.addListItem()
    .setTitle("HA-putje diameter (mm)")
    .setChoiceValues(["315", "400", "500", "NVT (geen putje)"])
    .setRequired(true);

  form.addListItem()
    .setTitle("Terugslagklep (ja/nee)")
    .setChoiceValues(["ja", "nee"])
    .setRequired(true);

  // =========================================================================
  // SECTIE 8: EXTRA (KOLK / RWA)
  // =========================================================================
  form.addSectionHeaderItem()
    .setTitle("💧 Extra velden (RWA / kolk)")
    .setHelpText("Enkel invullen indien van toepassing");

  form.addListItem()
    .setTitle("RWA infiltratieputje (ja/nee)")
    .setChoiceValues(["ja", "nee", "NVT"])
    .setRequired(false);

  form.addListItem()
    .setTitle("RWA aansluiting op opengracht (ja/nee)")
    .setChoiceValues(["ja", "nee", "NVT"])
    .setRequired(false);

  form.addListItem()
    .setTitle("Kolk infiltratieklok (ja/nee)")
    .setChoiceValues(["ja", "nee", "NVT"])
    .setRequired(false);

  form.addListItem()
    .setTitle("Kolk aansluiting op opengracht (ja/nee)")
    .setChoiceValues(["ja", "nee", "NVT"])
    .setRequired(false);

  // =========================================================================
  // SECTIE 9: FOTO'S
  // =========================================================================
  form.addSectionHeaderItem()
    .setTitle("📷 Foto's (4 verplicht per aansluiting)")
    .setHelpText(
      "Upload de 4 foto's volgens VLARIO SB250 v4.1:\n" +
      "1. Boring/opening op hoofdriool\n" +
      "2. Na plaatsing buizen + hulpstukken + HA-putje\n" +
      "3. Verbinding HA-putje ↔ privé-riool\n" +
      "4. Zelfde als foto 2, maar met omhulling"
    );

  form.addImageItem()
    .setTitle("ℹ️ Maak foto's TIJDENS de aanleg, niet achteraf!");

  // NOTA: Google Forms ondersteunt file upload, maar dat vereist dat
  // respondenten ingelogd zijn met Google account. Alternatief:
  // gebruik een apart foto-upload systeem of de Google Drive app.

  // Workaround: text velden voor foto-referenties
  form.addTextItem()
    .setTitle("Foto referentie")
    .setHelpText("Optioneel: bestandsnaam of referentie van de foto's die je apart uploadt naar de gedeelde map")
    .setRequired(false);

  // =========================================================================
  // SECTIE 10: OPMERKINGEN
  // =========================================================================
  form.addSectionHeaderItem()
    .setTitle("📝 Opmerkingen");

  form.addParagraphTextItem()
    .setTitle("Opmerkingen")
    .setHelpText(
      "Bv. detail bochttypes (2× 45° + 1× 90°), bijzonderheden, " +
      "problemen bij aanleg, afwijkingen van plan, etc."
    )
    .setRequired(false);

  // =========================================================================
  // SHEET KOPPELING
  // =========================================================================
  // Maak automatisch een gekoppelde spreadsheet
  form.setDestination(FormApp.DestinationType.SPREADSHEET,
    SpreadsheetApp.create("VLARIO Data — Colas Belgium").getId()
  );

  // =========================================================================
  // OUTPUT
  // =========================================================================
  var formUrl = form.getPublishedUrl();
  var editUrl = form.getEditUrl();
  var shortUrl = form.shortenFormUrl(formUrl);

  Logger.log("✅ VLARIO Formulier aangemaakt!");
  Logger.log("📱 Formulier URL (voor Olivier/Junior): " + formUrl);
  Logger.log("📱 Korte URL: " + shortUrl);
  Logger.log("✏️  Bewerkings-URL (voor Jolien): " + editUrl);
  Logger.log("");
  Logger.log("VOLGENDE STAPPEN:");
  Logger.log("1. Open de korte URL op je smartphone om te testen");
  Logger.log("2. Print de QR-code van de korte URL en hang op in werfkeet");
  Logger.log("3. Laat Olivier en Junior 1 test-aansluiting invullen");
  Logger.log("4. Check de gekoppelde Google Sheet in je Drive");
}


// =============================================================================
// BONUS: Auto-validatie trigger bij nieuwe inzending
// =============================================================================

/**
 * Stel deze trigger in via: Triggers → + Trigger toevoegen →
 * Function: onFormSubmit, Event: From spreadsheet, On form submit
 */
function onFormSubmit(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Basis validatie
  var warnings = [];
  var straat = data[3];  // Kolom D = straatnaam (0-indexed, na tijdstempel)
  var huisnr = data[4];
  var buis = parseFloat(data[19]) || 0;  // Kolom voor buis (m)

  if (buis === 0) warnings.push("Meters buis = 0");
  if (buis > 25) warnings.push("Meters buis > 25m (ongewoon)");

  // Markeer rij met kleur
  var range = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn());
  if (warnings.length > 0) {
    range.setBackground("#FFF3CD");  // Geel = waarschuwing
    // Voeg notitie toe
    sheet.getRange(lastRow, sheet.getLastColumn()).setNote(
      "⚠️ " + warnings.join(", ")
    );
  } else {
    range.setBackground("#D4EDDA");  // Groen = OK
  }

  // Optioneel: stuur e-mail bij waarschuwing
  // MailApp.sendEmail("jolien@colas.be", "VLARIO Waarschuwing", ...);
}


// =============================================================================
// BONUS: Dashboard tabblad aanmaken in de response Sheet
// =============================================================================

function maakDashboard() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var responseSheet = ss.getSheets()[0];

  // Maak dashboard tabblad
  var dashboard = ss.insertSheet("📊 Dashboard");

  dashboard.getRange("A1").setValue("VLARIO Dashboard — Colas Belgium")
    .setFontSize(14).setFontWeight("bold");
  dashboard.getRange("A2").setValue("Laatst bijgewerkt: " + new Date().toLocaleString("nl-BE"));

  // Tellingen
  dashboard.getRange("A4").setValue("OVERZICHT").setFontWeight("bold");
  dashboard.getRange("A5").setValue("Totaal inzendingen:");
  dashboard.getRange("B5").setFormula('=COUNTA(\'Form Responses 1\'!A:A)-1');

  dashboard.getRange("A6").setValue("DWA aansluitingen:");
  dashboard.getRange("B6").setFormula('=COUNTIF(\'Form Responses 1\'!E:E,"DWA")');

  dashboard.getRange("A7").setValue("RWA aansluitingen:");
  dashboard.getRange("B7").setFormula('=COUNTIF(\'Form Responses 1\'!E:E,"RWA")');

  dashboard.getRange("A8").setValue("Kolken:");
  dashboard.getRange("B8").setFormula('=COUNTIF(\'Form Responses 1\'!F:F,"kolk")');

  // Per werf
  dashboard.getRange("A10").setValue("PER WERF").setFontWeight("bold");
  dashboard.getRange("A11").setValue("Puurs:");
  dashboard.getRange("B11").setFormula('=COUNTIF(\'Form Responses 1\'!B:B,"Puurs")');
  dashboard.getRange("A12").setValue("Zwijndrecht:");
  dashboard.getRange("B12").setFormula('=COUNTIF(\'Form Responses 1\'!B:B,"Zwijndrecht")');

  // Totaal hoeveelheden
  dashboard.getRange("A14").setValue("TOTAAL HOEVEELHEDEN").setFontWeight("bold");
  dashboard.getRange("A15").setValue("Meters buis (m):");
  dashboard.getRange("B15").setFormula('=SUM(\'Form Responses 1\'!T:T)');  // Pas kolom aan
  dashboard.getRange("A16").setValue("Bochten (st):");
  dashboard.getRange("B16").setFormula('=SUM(\'Form Responses 1\'!V:V)');
  dashboard.getRange("A17").setValue("Moffen (st):");
  dashboard.getRange("B17").setFormula('=SUM(\'Form Responses 1\'!U:U)');

  Logger.log("✅ Dashboard tabblad aangemaakt!");
  Logger.log("⚠️  Controleer of de kolomreferenties kloppen met je Form Responses sheet!");
}
