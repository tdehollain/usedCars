
const list = require('./existingVehicles.js');
const db = require('./db.js');
const VEHICLE_LIST_TABLE = process.env.VEHICLE_LIST_TABLE;

exports.handler = async (event, context, callback) => {

    let nbVehiclesAdded = 0;
    let start = 0;
    let end = Math.min(1000, list.length); // for DEBUG - try with 1 or 11 vehicles instead of the full list
    // let end = list.length;

    for (let i = start; i < end; i++) {
        let vehicle = list[i];
        let cleanedUpVehicle = cleanUpVehicle(vehicle);

        let { err } = await db.addVehicle(cleanedUpVehicle, VEHICLE_LIST_TABLE);
        if (err) {
            console.error(`Error adding vehicle "${vehicle.title}": + ${err}`);
        } else {
            nbVehiclesAdded++;
        }
    }
    return { success: true, nbVehiclesAdded };
};

const cleanUpVehicle = vehicle => {
    let brandDictionary = {
        "16396": "abarth",
        "6": "alfa-romeo",
        "8": "aston-martin",
        "9": "audi",
        "13": "bmw",
        "11": "bentley",
        "15": "bugatti",
        "21": "citroen",
        "51779": "de-tomaso",
        "16339": "donkervoort",
        "27": "ferrari",
        "29": "ford",
        "31": "honda",
        "37": "jaguar",
        "51781": "koenigsegg",
        "41": "lamborghini",
        "43": "lexus",
        "44": "lotus",
        "45": "maserati",
        "16348": "maybach",
        "46": "mazda",
        "51519": "mclaren",
        "47": "mercedes-benz",
        "50": "mitsubishi",
        "52": "nissan",
        "57": "porsche",
        "61": "rolls-royce",
        "67": "subaru",
        "71": "tvr",
        "70": "toyota",
        "74": "volkswagen",
        "16351": "wiesmann"
    };

    let modelDictionary = {
        "74336": "124-spider",
        "21170": "595",
        "20323": "595-competizione",
        "20258": "595-turismo",
        "20387": "595c",
        "19690": "695",
        "20386": "695c",
        "1611": "giulietta",
        "18553": "giulia",
        "74543": "stelvio",
        "74438": "db11",
        "1615": "db7",
        "18517": "db9",
        "19068": "dbs",
        "19531": "rapide",
        "15119": "v8",
        "18261": "vanquish",
        "15120": "vantage",
        "18925": "r8",
        "20385": "rs-q3",
        "19728": "rs2",
        "19729": "rs3",
        "19730": "rs4",
        "19731": "rs5",
        "19732": "rs6",
        "20295": "rs7",
        "20317": "rs7-sportback",
        "20369": "s1",
        "15637": "s3",
        "2108": "s4",
        "2108": "s5",
        "19048": "s5",
        "1633": "s6",
        "20155": "s7",
        "15123": "s8",
        "20056": "tt-rs",
        "19741": "1er-m-coupé",
        "15779": "330",
        "21097": "340",
        "74335": "440",
        "1652": "530",
        "1654": "540",
        "1664": "850",
        "74386": "140",
        "21157": "m2",
        "74388": "240",
        "1646": "m3",
        "20393": "m4",
        "1655": "m5",
        "18710": "550",
        "18577": "m6",
        "1666": "z1",
        "20223": "z3-m",
        "19617": "z4-m",
        "16402": "z8",
        "20319": "i3",
        "20320": "i8",
        "18304": "57",
        "18305": "62",
        "15755": "288",
        "2116": "308",
        "1725": "328",
        "1726": "348",
        "15957": "356",
        "16389": "360",
        "1728": "456",
        "19245": "458",
        "21085": "488",
        "1734": "512",
        "1730": "550",
        "18347": "575",
        "18791": "599",
        "18468": "612",
        "74660": "812",
        "1950": "911",
        "18527": "912",
        "15980": "914",
        "20156": "918",
        "1951": "924",
        "1952": "928",
        "20845": "930",
        "1953": "944",
        "15743": "959",
        "15977": "964",
        "1954": "968",
        "20025": "991",
        "15881": "993",
        "15880": "996",
        "18548": "997",
        "15667": "3200",
        "18403": "4200",
        "1875": "3000-gt",
        "21166": "540c",
        "74440": "570gt",
        "21167": "570s",
        "20423": "650s-coupe",
        "20424": "650s-spider",
        "21168": "675lt",
        "20255": "a-45-amg",
        "74639": "aguera",
        "19722": "aventador",
        "21181": "bentayga",
        "1955": "boxster",
        "16582": "c-32amg",
        "14807": "c-36-amg",
        "15632": "c-43-amg",
        "18422": "c-55-amg",
        "19107": "c-63-amg",
        "19157": "california",
        "1756": "capri",
        "15359": "carrera-gt",
        "18684": "cayman",
        "18284": "cayenne",
        "74640": "cc",
        "15234": "cerbera",
        "15232": "chimaera",
        "74381": "chiron",
        "1775": "civic",
        "20301": "cla-45-amg",
        "18815": "clk-63 amg",
        "18813": "cls-55-amg",
        "18814": "cls-63-amg",
        "15127": "continental",
        "15673": "countach",
        "18263": "coupe",
        "16605": "d8",
        "74424": "dawn",
        "15174": "diablo",
        "19523": "ds3",
        "15694": "e-36-amg",
        "74457": "e-43-amg",
        "15549": "e-50-amg",
        "15699": "e-55-amg",
        "18804": "e-63-amg",
        "18309": "enzo",
        "16391": "espada",
        "19224": "evora",
        "20194": "f-type",
        "20140": "f12",
        "1731": "f355",
        "1732": "f40",
        "18547": "f430",
        "15668": "f50",
        "15671": "f512",
        "19719": "ff",
        "1758": "fiesta",
        "20362": "flying-spur",
        "15537": "focus",
        "20216": "g-500",
        "18425": "g-55-amg",
        "20167": "g-63-amg",
        "18356": "gallardo",
        "19263": "ghost",
        "20253": "gl-63-amg",
        "20388": "gla-45-amg",
        "74389": "glc-43-amg",
        "74629": "glc-53-amg",
        "74391": "gle-43-amg",
        "20923": "gle-63-amg",
        "74257": "gls-63-amg",
        "2084": "golf",
        "20342": "golf-gti",
        "19530": "grancabrio",
        "18635": "gransport",
        "19075": "granturismo",
        "15233": "griffith",
        "18708": "gt",
        "19234": "gt-r",
        "74328": "gtc4-lusso",
        "20361": "huracán",
        "2023": "impreza",
        "19159": "is-f",
        "15672": "jalpa",
        "20331": "laferrari",
        "1884": "lancer",
        "20192": "lfa",
        "16392": "lm",
        "20311": "macan",
        "18661": "mc12",
        "18332": "mf-3",
        "19152": "mf-4",
        "19153": "mf-5",
        "16438": "ml-55-amg",
        "18753": "ml-63-amg",
        "20030": "mp4-12c",
        "18402": "mulsanne",
        "16618": "murciélago",
        "1842": "mx-5",
        "1782": "nsx",
        "19136": "panamera",
        "74535": "pantera",
        "15821": "phantom",
        "19057": "phantom",
        "15821": "phantom",
        "74687": "portofino",
        "20813": "rc-f",
        "74638": "regera",
        "19527": "reventon",
        "1844": "rx-7",
        "18343": "rx-8",
        "16489": "s-55-amg",
        "18990": "s-63-amg",
        "18580": "s-65-amg",
        "74630": "s-650",
        "2092": "scirocco",
        "18060": "sl-55-amg",
        "19546": "sl-60-amg",
        "19151": "sl-63-amg",
        "18492": "sl-65-amg",
        "74262": "slc-43-amg",
        "16509": "slk-32-amg",
        "18424": "slk-55-amg",
        "16381": "slr",
        "19223": "sls",
        "18695": "slyline",
        "16620": "spyder",
        "2063": "supra",
        "1734": "testarossa",
        "18385": "tuscan",
        "16635": "urraco-p250",
        "74675": "urus",
        "18843": "veyron",
        "20294": "wraith",
        "15170": "xkr"
    };

    // map brand and model to brandId and modelId
    // replace empty strings with null
    let newVehicle = {
        "checkedTransAuto": vehicle.checkedTransAuto,
        "checkedTransMan": vehicle.checkedTransMan,
        "checkedTransSemi": vehicle.checkedTransSemi,
        "checkedFuelPetrol": vehicle.checkedFuelPetrol,
        "checkedFuelDiesel": vehicle.checkedFuelDiesel,
        "checkedFuelElec": vehicle.checkedFuelElec,
        "checkedFuelElecPetrol": vehicle.checkedFuelElecPetrol,
        "checkedFuelElecDiesel": vehicle.checkedFuelElecDiesel,
        "checkedBodyCompact": vehicle.checkedBodyCompact,
        "checkedBodyConvertible": vehicle.checkedBodyConvertible,
        "checkedBodyCoupe": vehicle.checkedBodyCoupe,
        "checkedBodySUV": vehicle.checkedBodySUV,
        "checkedBodySedan": vehicle.checkedBodySedan,
        "checkedBodySW": vehicle.checkedBodySW,
        "vehicleURL": vehicle.vehicleURL,
        "brandId": vehicle.brand,
        "modelId": vehicle.model,
        "brand": brandDictionary[vehicle.brand],
        "model": modelDictionary[vehicle.model],
        "title": vehicle.title,
        "regFrom": vehicle.regFrom,
        "regTo": vehicle.regTo || null,
        "chFrom": vehicle.chFrom || null,
        "chTo": vehicle.chTo || null,
        "doorsFrom": vehicle.doorsFrom || null,
        "doorsTo": vehicle.doorsTo || null,
        "version": vehicle.version || null,
        "dateAdded": vehicle.dateAdded.$date,
        "timingDay": vehicle.timingDay,
        "timingHour": vehicle.timingHour,
        "lastCount": vehicle.lastCount
    }

    // clean up nb of doors
    if (newVehicle.doorsFrom === 2) newVehicle.doorsTo = 3;
    if (newVehicle.doorsFrom === 4) newVehicle.doorsTo = 5;

    return newVehicle;
}