var missing_places = ["Olbia-Tempio", "Ogliastra", "Medio Campidano", "Carbonia-Iglesias", "Monza e della Brianza", "Forlì-Cesena",
    "Fermo", "Barletta-Andria-Trani", "Mosso Santa Maria", "Pistolesa", "Colcavagno", "Montiglio", "Scandeluzza", " Consiglio di Rumo", " Germasino", " Gravedona",
    " Santa Maria Rezzonico", " Sant'Abbondio", " Bezzecca", " Concei", " Molina di Ledro", " Pieve di Ledro", " Tiarno di Sopra",
    " Tiarno di Sotto", " Bleggio Inferiore", " Lomaso", " Carrara San Giorgio", " Carrara Santo Stefano", " Contarina", " Donada",
    " Campolongo al Torre", " Tapogliano", " Casteldelci", " Maiolo", " Novafeltria", " Pennabilli", " San Leo", " Sant'Agata Feltria",
    " Talamello", " Montemaggiore al Metauro", " Margherita di Savoia", " San Ferdinando di Puglia", " Trinitapoli", " Andria", " Barletta",
    " Bisceglie", " Canosa di Puglia", " Minervino Murge", " Spinazzola", " Trani", "Bosa", "Budoni", "Flussio", "Laconi", "Magomadas", "Modolo",
    "Montresta", "Oniferi", "Orosei", "Sagama", "Suni", "Tinnura", "agrate brianza", "aicurzio", "albiate", "arcore", "barlassina", "bellusco",
    "bernareggio", "besana in brianza", "biassono", "bovisio-masciago", "briosco", "brugherio", "burago di molgora", "busnago", "camparada",
    "caponago", "carate brianza", "carnate", "cavenago di brianza", "ceriano laghetto", "cesano maderno", "cogliate", "Concorezzo", "Cornate d'Adda",
    "Correzzana", "Desio", "Giussano", "Lazzate", "Lentate sul Seveso", "Lesmo", "Limbiate", "Lissone", "Macherio", "Meda", "Mezzago", "Misinto",
    "Monza", "Muggiò", "Nova Milanese", "Ornago", "Renate", "Roncello", "Ronco Briantino", "Seregno", "Seveso", "Serramanna", "Serrenti", "Setzu",
    "Siddi", "Tratalias", "Tuili", "Turri", "Sovico", "Sulbiate", "Triuggio", "San Gavino Monreale", "San Giovanni Suergiu", "Sanluri", "Santadi",
    "Sant'Anna Arresi", "Sant'Antioco", "Sardara", "Segariu", "Lunamatrona", "Masainas", "Musei", "Narcao", "Nuxis", "Pabillonis", "Padru",
    "Pauli Arbarei", "Perdaxius", "Portoscuso", "Samassi", "Gesturi",
    "Usmate Velate", "Varedo", "Vedano al Lambro", "Veduggio con Colzano", "Verano Brianza", "Villasanta", "Vimercate", "Ussaramanna", "Villacidro",
    "Villamar", "Villamassargia", "Villanovaforru", "Villanovafranca", "Villaperuccio", "Altidona", "Amandola",
    "Belmonte Piceno", "Campofilone", "Falerone", "Fermo", "Francavilla d'Ete", "Grottazzolina", "Lapedona", "Magliano di Tenna",
    "Massa Fermana", "Monsampietro Morico", "Montappone", "Monte Giberto", "Monte Rinaldo", "Monte San Pietrangeli", "Monte Urano",
    "Monte Vidon Combatte", "Monte Vidon Corrado", "Montefalcone Appennino", "Montefortino", "Montegiorgio", "Montegranaro", "Monteleone di Fermo",
    "Montelparo", "Monterubbiano", "Montottone", "Moresco", "Ortezzano", "Pedaso", "Petritoli", "Ponzano di Fermo", "Porto San Giorgio",
    "Porto Sant'Elpidio", "Rapagnano", "Santa Vittoria in Matenano", "Sant'Elpidio a Mare", "Servigliano", "Smerillo", "Torre San Patrizio",
    "Aggius", "Aglientu", "Alà dei Sardi", "Arzachena", "Badesi", "Berchidda", "Bortigiadas", "Buddusò", "Calangianus", "Golfo Aranci",
    "La Maddalena", "Loiri Porto San Paolo", "Luogosanto", "Luras", "Monti", "Olbia", "Oschiri", "Palau", "Piscinas", "Santa Teresa Gallura",
    "Sant'Antonio di Gallura", "Telti", "Tempio Pausania", "Trinità d'Agultu e Vignola", "Arzana", "Bari Sardo", "Baunei", "Elini", "Gairo",
    "Girasole", "Ilbono", "Jerzu", "Lanusei", "Loceri", "Lotzorai", "Osini", "Perdasdefogu", "Talana", "Tertenia", "Tortolì", "Triei",
    "Ulassai", "Urzulei", "Ussassai", "Villagrande Strisaili", "Escalaplano", "Escolca", "Esterzili", "Genoni", "Gergei", "Isili", "Nuragus",
    "Nurallao", "Nurri", "Orroli", "Sadali", "Serri", "Seui", "Seulo", "Villanova Tulo", "Arbus", "Barumini", "Buggerru", "Calasetta",
    "Carbonia", "Cardedu", "Carloforte", "Collinas", "Domusnovas", "Fluminimaggiore", "Furtei", "Genuri", "Giba", "Gonnesa", "Gonnosfanadiga", "Guspini",
    "Iglesias", "Las Plassas"];

var map_array = new Array(268);
for (i = 0; i < 268; i++) {
    map_array[i] = [missing_places[i].toUpperCase().trim(), true];
}
var map_missing_places = new Map(map_array);

function is_place_missing(place_name) {
    place_name = place_name.toUpperCase().trim();
    return (map_missing_places.get(place_name)) ? true : false;
}
